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

//정렬 기준
async function sortByLatest() {
    const videoList = await getVideoList();
    const videoListContainer = document.getElementById('feed');
    videoListContainer.innerHTML = '';
    const sortedList = videoList.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
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


// html 비디오
async function createVideoItem(videoList) {
  let feed = document.getElementById("feed");
  let feedItems = "";

  let videoInfoPromises = videoList.map((video) =>
    getVideoInfo(video.video_id)
  );
  let videoInfoList = await Promise.all(videoInfoPromises);

  for (let i = 0; i < videoList.length; i++) {
    let videoId = videoList[i].video_id;
    let videoInfo = videoInfoList[i];

    let uploadTimeAgo = calculateTimeAgo(videoInfo.upload_date);
    let formattedViews = formatViews(videoInfo.views);

    let channelURL = `./channel?channelName=${videoList[i].video_channel}"`;
    let videoURL = `./video.html?id=${videoId}"`;

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
    `;
  }
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


  for (let i = 9; i<12; i++) {
    let videoId = videoList[i].video_id;
    let videoInfo = videoInfoList[i];
    let channelURL = `./channel?channelName=${videoList[i].video_channel}"`;
    let videoURL = `./video.html?id=${videoId}"`;

    feedListItems += `
      <div class="feed-list-item">
        <a href="./video.html?id=${videoId}">
        <div class="playlist-thumbnail-item">
          <img src="${videoInfo.image_link}">
          <div class="img-cover">
            <div class="img-cover-info">
              <div><img src="../svg/bropdown.svg"></div>
              <div>동영상 5개</div>
            </div>
          </div>
        </div>
        <div>
          <div class="playlist-info">${videoInfo.video_tag}</div>
          <div class="all-playlist">모든 재생목록 보기</div>
        </div>
        </a>
      </div>
    `;
  }

  feedList.innerHTML = feedListItems;
}








