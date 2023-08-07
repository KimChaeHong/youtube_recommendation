// 처음 화면 로드 시 전체 비디오 리스트 가져오기
getVideoList().then(createVideoItem);

// 현재 주소에서 비디오ID 가져오기
let currentURL = window.location.href;
let url = new URL(currentURL);
let videoId = url.searchParams.get("id"); //채널명
// videoId = "12";

// 비디오 리스트 정보
async function getVideoList() {
  let response = await fetch("http://oreumi.appspot.com/video/getVideoList");
  let videoListData = await response.json();
  return videoListData;
}

// 각 비디오 정보
async function getVideoInfo(videoId) {
  let url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
  let response = await fetch(url);
  let videoData = await response.json();
  return videoData;
}videoListDiv

// 채널 정보
async function getChannelInfo(channelName) {
  let url = `http://oreumi.appspot.com/channel/getChannelInfo`;

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_channel: channelName }),
  });

  let channelData = await response.json();
  return channelData;
}

// 채널 내 영상정보
async function getChannelVideo() {
  let response = await fetch(
    `http://oreumi.appspot.com/video/getChannelVideo?video_channel=${channelName}`
  );
  let videoListData = await response.json();
  return videoListData;
}

// 피드 내용 로드
async function createVideoItem(videoList) {
  let videoContainer = document.getElementById("video__container");
  let videoTitle = document.getElementById("video__title");
  let videoInfoBox = document.getElementById("info-text");

  // 현재 비디오 정보 가져오기
  let currentVideoInfo = await getVideoInfo(videoId);
  let tagList = currentVideoInfo.video_tag;
  let channelName = currentVideoInfo.video_channel;

  // 비디오 추가
  videoContainer.innerHTML = `
        <video id="current__video" controls autoplay muted>
                    <source src="http://storage.googleapis.com/oreumi.appspot.com/video_${videoId}.mp4">
        </video>
    `;

  videoTitle.innerHTML = `
        <div id="video__title" class="video__title">
            ${currentVideoInfo.video_title}
        </div>
    `;
  videoInfoBox.innerHTML = `
        <p>조회수 ${convertViews(currentVideoInfo.views)}회 • ${convertDate(
    currentVideoInfo.upload_date
  )}</p>
    `;

  // 추천 태그
  let recoSortButtons = document.getElementById("reco__sort__buttons");

  recoSortButtons.innerHTML += `<button class="selected">${currentVideoInfo.video_channel}</button>`;

  for (let i = 0; i < tagList.length; i++) {
    let tag = tagList[i];

    recoSortButtons.innerHTML += `

            <button>${tag}</button>
            
            `;
  }

  let currentChannelInfo = await getChannelInfo(channelName);
  let currentChannelURL = `./channel.html?channelName=${channelName}`;
  let channelInfoBox = document.getElementById("channel__info__box");
  channelInfoBox.innerHTML = `
  <div id="channel-title">
  <div id="frame11">
      <div id="channel-profile-pic">
          <div class="user-avatar">
              <img src=${currentChannelInfo.channel_profile} alt="">
          </div>
      </div>
      <div id="channel-profile-name">
          <div id="channel-name">${currentChannelInfo.channel_name}</div>
          <div id="subscribers">${convertViews(currentChannelInfo.subscribers)}</div>
      </div>
      <div id="channel-subscribes-btn">
          <div id="sub-btn">SUBSCRIBES</div>
      </div>
  </div>
</div>
    `;

  let channelInfoDownSide = document.getElementById("channel__info__downside");
  channelInfoDownSide.innerHTML = `
  <div id="video-desc-text">
  <div>
      ${currentVideoInfo.video_detail}
  </div>
  <div id="desc-show-more">
    <button>SHOW MORE</button>
  </div>
</div>
    `;

  // 각 비디오들 정보 가져오기
  let videoInfoPromises = videoList.map((video) =>
    getVideoInfo(video.video_id)
  );
  let videoInfoList = await Promise.all(videoInfoPromises);
  //채널명으로 필터링
  let filteredVideoList = videoInfoList.filter(
    (videoInfo) => videoInfo.video_channel === channelName
  );

  // 비디오리스트에 추가
  let videoListDiv = document.getElementById("feed");
  let feedItems = "";
  for (let i = 0; i < filteredVideoList.length; i++) {
    let video = filteredVideoList[i];
    let channelName = video.video_channel;
    let videoURL = `./video.html?id=${i}"`;
    let channelURL = `./channel.html?channelName=${channelName}`;

    feedItems += `
    <div id="video">
    <a href="https://www.youtube.com/watch?v=JXl4QgYUi9c&t=1s"></a>
    <div id="thumnail">
        <div id="thumnail-images">
            <img src='${videoInfo.image_link}'> 
        </div>
    </div>
    </a>
    <div id="video-text">
        <ul>
            <li id="video-name"><a href='${videoURL}'> ${videoInfo.video_title}</a></li>
            
            <div id="channel-desc">
                <li id="chnnel-name"><a href="${channelURL}">${videoInfo.video_channel}</a></li>
                <li id="channel-views"><p>${simpleViews} views • ${uploadTimeAgo}</p></li>
                </div>
            </div>
            
        </ul>
    </div> 
</div>
        `;
  }

  videoListDiv.innerHTML = feedItems;
}

// 단위 변환 함수
function convertViews(views) {
  if (views >= 10000000) {
    const converted = (views / 10000000).toFixed(1);
    return converted.endsWith(".0")
      ? converted.slice(0, -2) + "천만"
      : converted + "천만";
  } else if (views >= 1000000) {
    const converted = (views / 1000000).toFixed(1);
    return converted.endsWith(".0")
      ? converted.slice(0, -2) + "백만"
      : converted + "백만";
  } else if (views >= 10000) {
    const converted = (views / 10000).toFixed(1);
    return converted.endsWith(".0")
      ? converted.slice(0, -2) + "만"
      : converted + "만";
  } else if (views >= 1000) {
    const converted = (views / 1000).toFixed(1);
    return converted.endsWith(".0")
      ? converted.slice(0, -2) + "천"
      : converted + "천";
  } else {
    return views.toString();
  }
}

// 날짜 변환 함수
function convertDate(dateString) {
  // 파라미터로 받은 날짜를 Date 객체로 변환
  const targetDate = new Date(dateString);

  // 현재 날짜를 구하기 위해 현재 시간 기준으로 Date 객체 생성
  const currentDate = new Date();

  // 두 날짜의 시간 차이 계산 (밀리초 기준)
  const timeDifference = currentDate - targetDate;

  // 1년의 밀리초 수
  const oneYearInMilliseconds = 31536000000;

  if (timeDifference < 86400000) {
    // 하루(24시간) 기준의 밀리초 수
    return "오늘";
  } else if (timeDifference < 172800000) {
    // 이틀(48시간) 기준의 밀리초 수 (어제)
    return "어제";
  } else if (timeDifference < 604800000) {
    // 일주일(7일) 기준의 밀리초 수
    return "1주 전";
  } else if (timeDifference < oneYearInMilliseconds) {
    // 한 달 전 계산
    const currentMonth = currentDate.getMonth();
    const targetMonth = targetDate.getMonth();

    if (currentMonth === targetMonth) {
      return "1개월 전";
    } else {
      return `${currentMonth - targetMonth}개월 전`;
    }
  } else {
    return `${Math.floor(timeDifference / oneYearInMilliseconds)}년 전`;
  }
}
