//8.1 신지수 툴바 영역별로 카테고리 생성
// 클릭 효과 추가
const menuItems = document.querySelectorAll('.toolbar-menu');

// 초기에는 "HOME" 선택
const defaultMenu = "HOME";
menuItems.forEach(menu => {
  if (menu.dataset.menu === defaultMenu) {
    menu.classList.add('active');
  }
});

// 클릭 이벤트
menuItems.forEach(menu => {
  menu.addEventListener('click', async function() {
    // 다른 메뉴 선택 시 제거
    const activeMenus = document.querySelectorAll('.toolbar-menu.active');
    activeMenus.forEach(activeMenu => activeMenu.classList.remove('active'));

    this.classList.add('active');

    // 동영상 영역 및 플레이 리스트, 커뮤니티, 채널, 어바웃 영역 초기화
    const homeSection = document.querySelector('.channel-home');
    homeSection.style.display = 'none';
    const videosSection = document.querySelector('.channel-videos');
    videosSection.style.display = 'none';
    const playlistsSection = document.querySelector('.channel-playlists');
    playlistsSection.style.display = 'none';
    const communitySection = document.querySelector('.channel-community');
    communitySection.style.display = 'none';
    const channelSection = document.querySelector('.channel-channels');
    channelSection.style.display = 'none';
    const aboutSection = document.querySelector('.channel-about');
    aboutSection.style.display = 'none';

    // 버튼들 숨김 처리
    const sortingButtonsDiv = document.getElementById('sortingButtons');
    sortingButtonsDiv.style.display = 'none';

    // 클릭한 메뉴에 따라 영역 활성화 및 처리
    if (this.dataset.menu === "VIDEOS") {
      videosSection.style.display = 'block';
      sortingButtonsDiv.style.display = 'block';
      //"최신순"버튼을 기본으로 적용
      const sortingButtons = document.querySelectorAll('.sorting-button');
      sortingButtons.forEach(button => button.classList.remove("clicked"));
      const latestButton = document.getElementById('latestButton');
      latestButton.classList.add("clicked");

    } else if (this.dataset.menu === "PLAYLISTS") {
      playlistsSection.style.display = 'block';
    } else if (this.dataset.menu === "COMMUNITY") {
      communitySection.style.display = 'block';
    } else if (this.dataset.menu === "CHANNELS") {
      channelSection.style.display = 'block';
    } else if (this.dataset.menu === "ABOUT") {
      aboutSection.style.display = 'block';
    } else if (this.dataset.menu === "HOME"){
      homeSection.style.display = 'block';
    }
  });
});
// 클릭 이벤트

//8.3 신지수 클릭 이벤트 문제 수정-해결
// 최신순~
document.getElementById('latestButton').addEventListener('click', async function() {
  chang_btn(event); // 버튼 클릭 효과 함수 호출
  await sortByLatest(); // 최신순 정렬 함수 호출
});
document.getElementById('popularButton').addEventListener('click', async function() {
  chang_btn(event);
  await sortByPopular();
});
document.getElementById('dateButton').addEventListener('click', async function() {
  chang_btn(event);
  await sortByDate();
});
// 정렬 버튼 클릭 효과 함수
function chang_btn(event) {
  var sortingButtons = document.querySelectorAll('.sorting-button');
  sortingButtons.forEach(function(button, i){
    if (button === event.target) {
      button.classList.add("clicked");
    } else {
      button.classList.remove("clicked");
    }
  });
}
// 처음 시작 시 최신순으로 정렬
document.addEventListener('DOMContentLoaded', sortByLatest);
//정렬 기준
async function sortByLatest() {
    const videoList = await getVideoList();
    const videoListContainer = document.getElementById('feed');
    videoListContainer.innerHTML = '';
    const sortedList = videoList.slice().sort((a, b) => {
      const dateA = new Date(a.upload_date.replace(/-/g, '/'));
      const dateB = new Date(b.upload_date.replace(/-/g, '/'));
      return dateB - dateA;
    });
    createVideoItem(sortedList);
}

async function sortByPopular() {
    const videoList = await getVideoList();
    const videoListContainer = document.getElementById('feed');
    videoListContainer.innerHTML = '';
    const sortedList = videoList.slice().sort((a, b) => b.views - a.views);
    createVideoItem(sortedList);
}

async function sortByDate() {
    const videoList = await getVideoList();
    const videoListContainer = document.getElementById('feed');
    videoListContainer.innerHTML = '';
    const sortedList = videoList.slice().sort((a, b) => {
      const dateA = new Date(a.upload_date.replace(/-/g, '/'));
      const dateB = new Date(b.upload_date.replace(/-/g, '/'));
      return dateA - dateB;
    });
    createVideoItem(sortedList);
}
// 최신순~ 여기까지


//api 동영상 불러오기
getVideoList().then(createVideoItem);
getVideoList().then(createPlaylistItem);

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

//채널 캐시정보 담을 객체 선언
let channelCache = {};

// 채널 정보
async function getChannelInfo(channelName) {
  // 캐시에 채널 정보가 있는지 확인
  if (channelCache[channelName]) {
    return channelCache[channelName];
  }

  let url = `http://oreumi.appspot.com/channel/getChannelInfo`;

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_channel: channelName }),
  });

  let channelData = await response.json();

  // 캐시에 채널 정보 저장
  channelCache[channelName] = channelData;

  return channelData;
}

//업로드 계산
function calculateTimeAgo(uploadDate) {
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
    return `${daysAgo}days ago`;
  } else if (monthsAgo < 12) {
    return `${monthsAgo}months ago`;
  } else {
    return `${yearsAgo}years ago`;
  }
}
//조회수 계산
function formatViews(views) {
  if (views < 1000) {
    return views + " views";
  } else if (views < 1000000) {
    const thousands = Math.floor(views / 1000);
    return thousands + "K views";
  } else {
    const millions = (views / 1000000).toFixed(1);
    return millions + "M views";
  }
}


// html 비디오, 커뮤니티
async function createVideoItem(videoList) {
  let feed = document.getElementById("feed");
  let feedItems = "";
  let communityone = document.querySelector(".channel-community");
  let communityItems = "";
  let aboutItemone = document.querySelector(".channel-about");
  let aboutItems = "";
  let playlistItemone = document.querySelector(".channel-playlists-info");
  let playlistItems = "";

  let videoInfoPromises = videoList.map((video) =>
    getVideoInfo(video.video_id)
  );
  let videoInfoList = await Promise.all(videoInfoPromises);

    //채널에 맞게 영상 나오게 하기
  let VCfilteredList = videoInfoList.filter(
    (videoInfo) => 
    videoInfo.video_channel === channelName
  );
  //최신순 먼저 출력
  // VCfilteredList.sort((a,b) => b.views - a.views);

  let channelInfo = await getChannelInfo();

  //커뮤니티
  // 8.5 신지수 채널별로 커뮤미니,정보 추가
  if (channelName==="oreumi"){
    communityItems +=`
        <div class="community-box">
          <div class="community-usericon"><img src="../svg/oreumi.png"></div>
          <div class="community-content">
            <div class="community-username">oreumi</div>
            <div class="community-content-in">
              <div>
                오르미 3기 모집 시작😆<br><br>

                당신도 개발자가 될 수 있다!<br><br>
                모집 마감 임박
              </div>
              <div id="community-img">
                <img src="../svg/oreumi3.png">
              </div>
              <div id="community-liked">
                <img src="../svg/video-liked.svg"> 3.6k  
                <img src="../svg/video-disliked.svg">
              </div>
            </div>
          </div>
        </div>
        `;
      aboutItems +=`
        <div class="channel-about-grid">
          <div class="about-explain">설명<br><br>
              <div>나는 오르미 2기!</div>
          </div>
          <div class="about-static">
            <div>통계</div>
            <div>가입일:2023.06.19.</div>
            <div>조회수:23,881회</div>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13.18 4L13.42 5.2L13.58 6H14.4H19V13H13.82L13.58 11.8L13.42 11H12.6H6V4H13.18ZM14 3H5V21H6V12H12.6L13 14H20V5H14.4L14 3Z" fill="white"/>
              </svg>
              <img src="../svg/video-share.svg">
            </span>
          </div>
          <div class="about-link">링크<br><br>
            <div><a href="https://estfamily.career.greetinghr.com/">사이트</a></div>
          </div>
        </div>
      `;
      communityone.innerHTML = communityItems;
      aboutItemone.innerHTML = aboutItems;

  }else if(channelName==="나와 토끼들"){
    communityItems +=`
        <div class="community-box">
          <div class="community-usericon"><img src="../svg/rabbit.png"></div>
          <div class="community-content">
            <div class="community-username">나와 토끼들</div>
            <div class="community-content-in">
              <div>
                지삐 체육관 원생 모집중<br><br>

                🐰토끼🐰라고 무시당하는 토끼를 위한 체육관<br><br>
                문의 : 02-777-7777<br>
                <a href="https://www.youtube.com/watch?v=11cta61wi0g"> 👉무술 맛보기 클릭!👈 </a>
              </div>
              <div id="community-img">
                <img src="../svg/rabbit_attack.PNG">
              </div>
              <div id="community-liked">
                <img src="../svg/video-liked.svg"> 2.8k
                <img src="../svg/video-disliked.svg">
              </div>
            </div>
          </div>
        </div>
        `;
        aboutItems +=`
        <div class="channel-about-grid">
          <div class="about-explain">설명<br><br>
              <div>지삐별이</div>
          </div>
          <div class="about-static">
            <div>통계</div>
            <div>가입일:2023.06.19.</div>
            <div>조회수:9,999회</div>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13.18 4L13.42 5.2L13.58 6H14.4H19V13H13.82L13.58 11.8L13.42 11H12.6H6V4H13.18ZM14 3H5V21H6V12H12.6L13 14H20V5H14.4L14 3Z" fill="white"/>
              </svg>
              <img src="../svg/video-share.svg">
            </span>
          </div>
          <div class="about-link">링크<br><br>
            <div><a href="https://www.youtube.com/@natgeokorea">사이트</a></div>
          </div>
        </div>
      `;
      communityone.innerHTML = communityItems;
      aboutItemone.innerHTML = aboutItems;
  }else if (channelName==="개조"){
    communityItems +=`
        <div class="community-box">
          <div class="community-usericon"><img src="../svg/gjprofile.png"></div>
          <div class="community-content">
            <div class="community-username">개조</div>
            <div class="community-content-in">
              <div>
                8월 4일자 강의 요약
              </div>
              <div id="community-img">
                <img src="../svg/gj.jpg">
              </div>
              <div id="community-liked">
                <img src="../svg/video-liked.svg"> 80
                <img src="../svg/video-disliked.svg">
              </div>
            </div>
          </div>
        </div>
        `;
        aboutItems +=`
        <div class="channel-about-grid">
          <div class="about-explain">설명<br><br>
              <div>개조로봇</div>
          </div>
          <div class="about-static">
            <div>통계</div>
            <div>가입일:2023.06.19.</div>
            <div>조회수:6,666회</div>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13.18 4L13.42 5.2L13.58 6H14.4H19V13H13.82L13.58 11.8L13.42 11H12.6H6V4H13.18ZM14 3H5V21H6V12H12.6L13 14H20V5H14.4L14 3Z" fill="white"/>
              </svg>
              <img src="../svg/video-share.svg">
            </span>
          </div>
          <div class="about-link">링크<br><br>
            <div><a href="https://www.youtube.com/@Bodeumofficial">사이트</a></div>
          </div>
        </div>
      `;
      playlistItems+='생성된 재생목록이 없습니다';
      playlistItemone.innerHTML = playlistItems;
      communityone.innerHTML = communityItems;
      aboutItemone.innerHTML = aboutItems;
  }
  
  for (let i = 0; i < VCfilteredList.length; i++) {
    let videoId = VCfilteredList[i].video_id;
    let videoInfo = VCfilteredList[i];
    // let VCFilterV = VCfilteredList[0];

    let uploadTimeAgo = calculateTimeAgo(videoInfo.upload_date);
    let formattedViews = formatViews(videoInfo.views);

    // let channelURL = `./channel?channelName=${VCfilteredList[i].video_channel}`;
    let videoURL = `./video.html?id=${videoId}`;

    feedItems += `
      <div class="feed-item">
          <a href="./video.html?id=${videoId}">
              <div class="thumbnail-item">
                  <img src="${videoInfo.image_link}">
              </div>
          </a>
          <div class="c-videos">
              <a href="./video.html?id=${videoId}">
                  <div class="c-videos-title">${videoInfo.video_title}</div>
                  <div class="c-videos-info">Views ${formattedViews} • ${uploadTimeAgo}</div>
              </a>
          </div>
      </div>
    `;}
    feed.innerHTML = feedItems;

}

//8.2 신지수 플레이 리스트에 동영상 추가+수정
// html 플레이 리스트
async function createPlaylistItem(videoList) {
  let feedList = document.getElementById("feed-list");
  let feedListItems = "";

  let videoInfoPromises = videoList.map((video) =>
    getVideoInfo(video.video_id)
  );
  let videoInfoList = await Promise.all(videoInfoPromises);
  let VCfilteredPList = videoInfoList.filter(
    (videoInfo) => 
    videoInfo.video_channel === channelName
  );


  for (let i = 0; i<VCfilteredPList.length; i++) {
    let videoId = VCfilteredPList[i].video_id;
    let videoInfo = VCfilteredPList[i];
    let pltitle = videoInfo.video_tag[0]
    let cvtitle = VCfilteredPList[i].video_title
    let channelURL = `./channel?channelName=${videoList[i].video_channel}`;
    let videoURL = `./video.html?id=${videoId}`;

    if (cvtitle.includes("일상")){
      feedListItems += `
    <div class="feed-list-item">
      <a href="./video.html?id=${videoId}">
      <div class="playlist-thumbnail-item">
        <img src="${videoInfo.image_link}">
        <div class="img-cover">
          <div class="img-cover-info">
            <div><img src="../svg/bropdown.svg"></div>
            <div>동영상 2개</div>
          </div>
        </div>
      </div>
      <div>
        <div class="playlist-info">${pltitle}</div>
        <div class="all-playlist">모든 재생목록 보기</div>
      </div>
      </a>
    </div>
  `;
  feedList.innerHTML = feedListItems;
}else if (cvtitle.includes("공학")){
  feedListItems += `
  <div class="feed-list-item">
    <a href="./video.html?id=${videoId}">
    <div class="playlist-thumbnail-item">
      <img src="${videoInfo.image_link}">
      <div class="img-cover">
        <div class="img-cover-info">
          <div><img src="../svg/bropdown.svg"></div>
          <div>동영상 2개</div>
        </div>
      </div>
    </div>
    <div>
      <div class="playlist-info">${pltitle}</div>
      <div class="all-playlist">모든 재생목록 보기</div>
    </div>
    </a>
  </div>
`;
feedList.innerHTML = feedListItems;
}
}
}




