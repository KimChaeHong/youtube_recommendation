// 처음 화면 로드 시 전체 비디오 리스트 가져오기
getVideoChList().then(createVideoChItem);

// 현재 주소에서 채널명 가져오기
let currentURL = window.location.href;
let url = new URL(currentURL);
let channelName = url.searchParams.get("channelName"); //채널명

// 비디오 리스트 정보
async function getVideoChList() {
  let response = await fetch("https://oreumi.appspot.com/video/getVideoList");
  let videoListData = await response.json();
  return videoListData;
}

// 각 비디오 정보
async function getVideoChInfo(videoId) {
  let url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
  let response = await fetch(url);
  let videoData = await response.json();
  return videoData;
}

// 채널 정보
async function getVideoChannelInfo() {
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
async function createVideoChItem(videoList) {
  let channelInfoContainer = document.getElementById("channel_information"); // 채널인포 컨테이너
  let channelBigVideoBox = document.getElementById("channel__big__video__box"); // 대표영상 컨테이너
  let channelInfoItems = ""; //채널인포
  let bigVideoItem = ""; //대표영상

  // 각 비디오들 정보 가져오기
  let videoInfoPromises = videoList.map((video) =>
    getVideoChInfo(video.video_id)
  );
  let videoInfoList = await Promise.all(videoInfoPromises);
  
  //채널명으로 필터링
  let filteredVideoList = videoInfoList.filter(
    (videoInfo) => 
    videoInfo.video_channel === channelName
  );

  // 조회수 높은 것부터 출력되게 수정 8.4 이준희
  filteredVideoList.sort((a,b) => b.views - a.views);
  

  //채널 정보 가져오기
let channelInfo = await getVideoChannelInfo();

function smartViews(views) {
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1).replace(/\.0$/, '')}M`; // 백만 회
    } else if (views >= 1000) {
        return `${(views / 1000).toFixed(0)}K`; // 천 회
    } else {
        return `${views}`; 
    }
}
let channelSub = smartViews(channelInfo.subscribers);

function timeAgo(uploadDate) {
  const now = new Date();
  const upload = new Date(uploadDate);
  const timeDiff = now - upload;
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(monthsAgo / 12);

  if (daysAgo === 0) {
      return "today";
  } else if (daysAgo === 1) {
      return "yesterday";
  } else if (monthsAgo < 1) {
      return `${daysAgo} days ago`;
  } else if (monthsAgo < 12) {
      return `${monthsAgo} months ago`;
  } else {
      return `${yearsAgo} years ago`;
  }
}



  //채널정보 페이지에추가
  //css를 위한 태그 수정, 채널 커버 추가 8.4 신지수
  // 버튼 구현 8.4 이준희
  channelInfoItems += `
  <div class="channel-cover">
    <img src='${channelInfo.channel_banner}' alt="">
  </div>
  <div id="channel__info__container">
    <div class="channel-profile">
      <div>
        <img src='${channelInfo.channel_profile}' alt="">
      </div>
      <div class="channel-title" >
        <div>
          <div class="chanelname">${channelInfo.channel_name}</div> 
          <div class="subsc-count">${(channelSub)} subscribers</div>
        </div> 
        <button id = "subBtn" class="subsc-btn" type = "button" onclick = 'change()' >subscribe</button>
      </div>
    </div>
  </div> 
    `;

  channelInfoContainer.innerHTML = channelInfoItems;

  // 대표영상정보 페이지에 추가
  let masterVideo = filteredVideoList[0];
  let videoId = filteredVideoList[0].video_id;
  let svideoHtmlURL = `./video.html?id=${videoId}`;
  let bigVideoViews = smartViews(masterVideo.views);
  let loadTimeAgo = timeAgo(masterVideo.upload_date);
  
  bigVideoItem += `
    <div class="s-video">
    <video controls autoplay muted>
      <source src='${masterVideo.video_link}' type="video/mp4" > 
    </video>
  </div>
  <div class="big__video__info">
  <a href='${svideoHtmlURL}'>
  <div class="video-title">${masterVideo.video_title}</div></a>
  <br>
  <div class="video-time">
    <sapn class="views">${bigVideoViews} views.</sapn>
    <sapn class="upload-date">${loadTimeAgo}</sapn>
    </div><br>
    <div class="video-detail">${masterVideo.video_detail}</div>
    </div>
  </div>
    `;

  channelBigVideoBox.innerHTML = bigVideoItem;

  // 플레이리스트 정보 페이지에 추가
  let playlistContainer = document.getElementById("playlist");
  let playlistItems = "";
  for (let i = 1; i < filteredVideoList.length; i++) {
    // 오류 수정 8.7 이준희
    let videoId = filteredVideoList[i].video_id;
    let videoInfo = filteredVideoList[i];
    let videoURL = `./video?id=${videoId}`;
    let videoHtmlURL = `./video.html?id=${videoId}`;
    let listVideoViews = smartViews(filteredVideoList[i].views);
    let listUploadTimeAgo = timeAgo(filteredVideoList[i].upload_date);

    playlistItems += `

    <button class="x-video">
    <a href='${videoHtmlURL}'>
      <div class="s-vedio">
        <div class="thumbnail-home">
          <img src="${filteredVideoList[i].image_link}" alt="">
        </div>
      </div>
      </a>

      <div class="s-vedio-info">
        <div class="s-vedio-info-content"> 
          <a class="s-thumb-title">${filteredVideoList[i].video_title}</a>
          <a class="s-chanelname">${channelName}</a>
          <a class="s-views">${listVideoViews} views. ${listUploadTimeAgo}</a>
        </div>
      </div>
    </button>
      `;
  }

  playlistContainer.innerHTML = playlistItems;
}

// 구독 버튼 구현 8.4 이준희
function change() {
  const subs = document.getElementById('subBtn');
  subs.innerText = 'subscribing'
  subs.style.backgroundColor = "#303030"
}

// 8.7 신지수 스크롤 버튼
document.addEventListener("DOMContentLoaded", function() {
  const playlist = document.getElementById("playlist");
  const scrollLeftBtn = document.getElementById("scroll-left-btn");
  const scrollRightBtn = document.getElementById("scroll-right-btn");

  scrollLeftBtn.addEventListener("click", function() {
      playlist.scrollBy({ left: -250, behavior: "smooth" });
  });

  scrollRightBtn.addEventListener("click", function() {
      playlist.scrollBy({ left: 250, behavior: "smooth" });
  });
});