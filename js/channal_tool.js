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
  menu.addEventListener('click', function() {
    // 다른 메뉴 선택 시 제거
    const activeMenus = document.querySelectorAll('.toolbar-menu.active');
    activeMenus.forEach(activeMenu => activeMenu.classList.remove('active'));

    this.classList.add('active');

    // 동영상 영역 활성화
    if (this.dataset.menu === "VIDEOS") {
      const videosSection = document.querySelector('.channel-videos');
      videosSection.style.display = 'block';
      // 동영상 데이터를 불러와서 표시
    //   getVideoList().then(createVideoItems);
      // 버튼들 보이도록 처리
      const sortingButtonsDiv = document.getElementById('sortingButtons');
      sortingButtonsDiv.style.display = 'block';
    } else {
      // 다른 메뉴를 선택한 경우 동영상 영역 비활성화
      const videosSection = document.querySelector('.channel-videos');
      videosSection.style.display = 'none';
      // 버튼들 숨김 처리
      const sortingButtonsDiv = document.getElementById('sortingButtons');
      sortingButtonsDiv.style.display = 'none';
    }
  });
});
// 클릭 이벤트 여기까지
// 클릭 이벤트 여기까지
// 클릭 이벤트 여기까지
getVideoList().then(createVideoItem);

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

// 피드 비디오 리스트 로드
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
    let channelInfo = await getChannelInfo(videoList[i].video_channel);

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
                        <div class="c-videos-info">조회수 ${videoInfo.views}회 • ${videoInfo.date}</div>
                    </a>
                </div>
            </div>
        `;
    }

    feed.innerHTML = feedItems;
}

// getVideoList()
//     .then(videoList => createVideoItems(videoList))
//     .catch(error => {
//         console.error('에러:', error);
//         alert('에러');
//     });