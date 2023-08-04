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
  }

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
  let videoInfoBox = document.getElementById("video__info__text");

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
    <div class="channel__profile">
        <img src=${currentChannelInfo.channel_profile} alt="">
    </div>
    <a href ="${currentChannelURL}">
      <div id="channel__info__text" class="channel__info__text">
          <h5>${currentChannelInfo.channel_name}</h5>
          <p>구독자 ${convertViews(currentChannelInfo.subscribers)}명</p>
      </div>
    </a>
    `;

  let channelInfoDownSide = document.getElementById("channel__info__downside");
  channelInfoDownSide.innerHTML = `
    <p>${currentVideoInfo.video_detail}
    </p>
    <button>SHOW MORE</button>
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
  let videoListDiv = document.getElementById("video__list");
  let videoListItems = "";
  for (let i = 0; i < filteredVideoList.length; i++) {
    let video = filteredVideoList[i];
    let channelName = video.video_channel;
    let videoURL = `./video.html?id=${i}"`;
    let channelURL = `./channel.html?channelName=${channelName}`;

    videoListItems += `
        <div class="video__box">
            <div class="video__thumbnail">
                <img src="${video.image_link}" alt="">
            </div>
            <div class="video__textbox">
                <a href="${videoURL}">
                <h4>${video.video_title}</h4>
                </a>
                <a href = "${channelURL}">
                  <p>${video.video_channel}</p>
                </a>
                <p>조회수 ${convertViews(video.views)}  •  ${convertDate(
      video.upload_date
    )}</p>
            </div>
        </div>
        `;
  }

  videoListDiv.innerHTML = videoListItems;
}
