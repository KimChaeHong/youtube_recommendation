// 처음 화면 로드 시 전체 비디오 리스트 가져오기
getVideoList().then(createVideoItem);

// 현재 주소에서 채널명 가져오기
let currentURL = window.location.href;
let url = new URL(currentURL);
let channelName = url.searchParams.get("channelName"); //채널명
channelName = "oreumi";

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
async function getChannelInfo() {
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
  let channelInfoContainer = document.getElementById(
    "channel__info__container"
  ); // 채널인포 컨테이너
  let channelBigVideoBox = document.getElementById("channel__big__video__box"); // 대표영상 컨테이너

  let channelInfoItems = ""; //채널인포
  let bigVideoItem = ""; //대표영상

  // 각 비디오들 정보 가져오기
  let videoInfoPromises = videoList.map((video) =>
    getVideoInfo(video.video_id)
  );
  let videoInfoList = await Promise.all(videoInfoPromises);
  
  //채널명으로 필터링
  let filteredVideoList = videoInfoList.filter(
    (videoInfo) => videoInfo.video_channel === channelName
  );

  //채널 정보 가져오기
  let channelInfo = await getChannelInfo();

  //채널정보 페이지에추가
  //css를 위한 태그 수정 8.4 신지수
  channelInfoItems += `
  <div class="channel-profile">
    <div>
      <img src='${channelInfo.channel_profile}' alt="">
    </div>
    <div class="channel-title" >
      <div>
        <div class="chanelname">${channelInfo.channel_name}</div> 
        <div class="subsc-count">${(channelInfo.subscribers)} subscribers</div>
      </div> 
      <div class="subsc-btn">SUBSCRIBES</div>
    </div>
  </div>
    `;

  channelInfoContainer.innerHTML = channelInfoItems;

  // 대표영상정보 페이지에 추가
  let masterVideo = filteredVideoList[0];
  bigVideoItem += `
    <div class="s-video">
    <video controls autoplay muted>
      <source src='${masterVideo.video_link}' type="video/mp4" > 
    </video>
  </div>
  <div class="big__video__info">
  <div class="video-title">${masterVideo.video_title}</div><br>
  <div class="video-time">
    <sapn class="views">${masterVideo.views} views.</sapn>
    <sapn class="upload-date">${masterVideo.upload_date}</sapn>
    </div><br>
    <div class="video-detail">${masterVideo.video_detail}</div>
    </div>
  </div>
    `;

  channelBigVideoBox.innerHTML = bigVideoItem;

  // 플레이리스트 정보 페이지에 추가
  let playlistContainer = document.getElementById("playlist");
  let playlistItems = "";
  for (let i = 0; i < filteredVideoList.length; i++) {
    let videoId = filteredVideoList[i].video_id;
    let videoInfo = filteredVideoList[i];
    let videoURL = `./video?id=${videoId}"`;

    playlistItems += `

    <button class="x-video">
      <div class="s-vedio">
        <div class="thumbnail-home">
          <img src="${filteredVideoList[i].image_link}" alt="">
        </div>
      </div>

      <div class="s-vedio-info">
        <div class="s-vedio-info-content"> 
          <a class="s-thumb-title">${filteredVideoList[i].video_title}</a>
          <a class="s-chanelname">${channelName}</a>
          <a class="s-views">${filteredVideoList[i].views} views. ${filteredVideoList[i].upload_date}</a>
        </div>
      </div>
    </button>

    
      `;
  }

  playlistContainer.innerHTML = playlistItems;
}