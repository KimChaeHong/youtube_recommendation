// 동영상 한번에 매끄럽게 불러오기, 검색 기능 추가 허유미 8.2

// 처음 화면 로드 시 전체 비디오 리스트 가져오기
getVideoList().then(createVideoItem);

// 비디오 리스트 정보
async function getVideoList() {
    let response = await fetch("https://oreumi.appspot.com/video/getVideoList");
    let videoListData = await response.json();
    return videoListData;
}

// 각 비디오 정보
async function getVideoInfo(videoId) {
    let url = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
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

    let url = `https://oreumi.appspot.com/channel/getChannelInfo`;

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


// 컨텐츠 영역 비디오 리스트 로드
async function createVideoItem(videoList) {
    let contents = document.getElementById("contents");
    let contentsItems = "";

    let videoInfoPromises = videoList.map((video) =>
        getVideoInfo(video.video_id)
    );
    let videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        let videoId = videoList[i].video_id;
        let videoInfo = videoInfoList[i];
        let channelInfo = await getChannelInfo(videoList[i].video_channel);

        let channelURL = `./html/channel.html?channelName=${videoList[i].video_channel}`;
        let videoURL = `./html/video.html?id=${videoId}`;

        // 조회수 간단하게 표현
        function formatViews(views) {
            if (views >= 1000000) {
                return `${(views / 1000000).toFixed(1).replace(/\.0$/, '')}M`; // 백만 회
            } else if (views >= 1000) {
                return `${(views / 1000).toFixed(0)}K`; // 천 회
            } else {
                return `${views}`; 
            }
        }
        let simpleViews = formatViews(videoInfo.views);

        // 업로드 날짜 계산
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
                return `${daysAgo} days ago`;
            } else if (monthsAgo < 12) {
                return `${monthsAgo} months ago`;
            } else {
                return `${yearsAgo} years ago`;
            }
        }
        let uploadTimeAgo = calculateTimeAgo(videoInfo.upload_date);

        contentsItems += `
        <div class="contents__item">
            <a href='${videoURL}'>
                <div class="contents__item__thumbnail">
                    <video class="video-play fade-in" src="https://storage.googleapis.com/oreumi.appspot.com/video_${videoInfo.video_id}.mp4"></video>
                    <img src="https://storage.googleapis.com/oreumi.appspot.com/img_${videoId}.jpg" alt="Video Thumbnail">
                    <div class="contents__item__timebar">00:10</div>    
                </div>
            </a>
            <div class="contents__item__info">
                <a href='${channelURL}'><img class="contents__item__info__avatar" src='${channelInfo.channel_profile}'></a>
                <div class="contents__text__box">
                    <h3 class="contents__item__info__title">
                        <a href='${videoURL}'> ${videoInfo.video_title}</a>
                    </h3>
                    <a href="${channelURL}">${videoInfo.video_channel}</a>
                    <p>Views ${simpleViews} • ${uploadTimeAgo}</p>
                </div>
            </div>
        </div>
        `;
    }

    // 화면에 추가
    contents.innerHTML = contentsItems;

    // 마우스 오버하면 동영상 자동재생 & 마우스 아웃하면 영상 재생 사라짐 허유미 8.6
    let containers = document.getElementsByClassName("contents__item");
        for (let i = 0; i < containers.length; i++) {
            let container = containers[i];
            let thumbnail = container.querySelector(".contents__item__thumbnail");
            let thumbnail_img = thumbnail.querySelector("img");
            let video_play = thumbnail.querySelector(".video-play");

            // 마우스 오버됐을 때
            thumbnail.addEventListener('mouseenter', function() {
                timeoutId = setTimeout(function() {
                    video_play.style.display = "block";
                    thumbnail_img.style.height = "0px";
                    video_play.muted = true;
                    video_play.play();
                }, 500);
            });

            // 마우스 아웃 됐을 때
            thumbnail.addEventListener('mouseleave', function() {
                clearTimeout(timeoutId);
                video_play.currentTime = 0;
                video_play.style.display = "none";
                thumbnail_img.style.height = "inherit";
            });
        }
}


let searchBtn = document.getElementById("search-btn");
let searchInput = document.getElementById("searchInput");

// 검색 버튼 클릭 시 필터링 실행
// 검색어 입력값 - 비디오제목, 채널명, 비디오 설명, 태그 포함 허유미 8.7
searchBtn.addEventListener("click", function () {
    let searchKeyword = searchInput.value.toLowerCase();
    getVideoList().then((videoList) => {
        let filteredVideoList = videoList.filter((video) =>
            video.video_title.toLowerCase().includes(searchKeyword) ||
            video.video_channel.toLowerCase().includes(searchKeyword) ||
            video.video_detail.toLowerCase().includes(searchKeyword) ||
            video.video_tag.includes(searchKeyword)
        );
        if (filteredVideoList.length === 0) {
            alert('검색 결과가 없습니다.');
        } else {
            createVideoItem(filteredVideoList);
        }
    });
});

searchInput.addEventListener("keypress", function (event) {
    // 엔터 키의 키 코드 = 13
    if (event.keyCode === 13) {
        let searchKeyword = searchInput.value;
        getVideoList().then((videoList) => {
            let filteredVideoList = videoList.filter((video) =>
                video.video_title.toLowerCase().includes(searchKeyword) ||
                video.video_channel.toLowerCase().includes(searchKeyword) ||
                video.video_detail.toLowerCase().includes(searchKeyword) ||
                video.video_tag.includes(searchKeyword)
            );
            if (filteredVideoList.length === 0) {
                alert('검색 결과가 없습니다.');
            } else {
                createVideoItem(filteredVideoList);
            }
        });
    }
});
