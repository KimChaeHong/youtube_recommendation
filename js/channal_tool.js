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


async function getVideoInfo(videoId) {
    // API URL
    let apiUrl = 'http://oreumi.appspot.com/video/getVideoInfo?video_id=' + videoId;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('에러:', error);
        alert('에러');
    }
}

async function setDataVideoId() {
    const thumnailItems = document.querySelectorAll(".thumbnail-item");
    thumnailItems.forEach((element, index) => {
        element.setAttribute('data-video-id', index);
    });
}

// 비디오 정보를 가져와서 feed에 추가
async function createVideoItems(videoList) {
    const feed = document.getElementById("feed");
    let feedItems = "";

    for (let i = 0; i < 10; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = await getVideoInfo(videoId);
        // const channelInfo = await getChannelInfo(videoList[i].video_channel);

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
};

// getVideoList()
//     .then(videoList => createVideoItems(videoList))
//     .catch(error => {
//         console.error('에러:', error);
//         alert('에러');
//     });