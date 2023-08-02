// 처음 화면 로드 시 전체 비디오 리스트 가져오기

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

        let channelURL = `./channel.html?channelName=${videoList[i].video_channel}"`;
        let videoURL = `./video.html?id=${videoId}"`;

        // 조회수 표현
        function formatViews(views) {
            if (views >= 10000) {
                return `${(views / 10000).toFixed(1).replace(/\.0$/, '')}만`;
            } else if (views >= 1000) {
                return `${(views / 1000).toFixed(1).replace(/\.0$/, '')}천`;
            } else {
                return `${views}`;
            }
        }
        let simpleViews = formatViews(videoInfo.views);

        // 업로드 날짜 표현
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
        let uploadTimeAgo = calculateTimeAgo(videoInfo.upload_date);




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
            
        </ul>
    </div> 
</div>
    `;
    }

    // 화면에 추가
    feed.innerHTML = feedItems;
}
