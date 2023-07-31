document.getElementById("search-btn").addEventListener("click", searchResult);

// 전체 동영상 리스트를 저장할 변수
let videoList = [];

// 초기화 함수를 호출하여 videoList를 불러옴
initialize();

function initialize() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                videoList = JSON.parse(xhr.responseText);
            } else {
                alert("동영상 리스트를 불러오는데 실패했습니다.");
            }
        }
    };
    xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoList', true);
    xhr.send();
}

function searchResult() {
    let searchInput = document.getElementById("searchInput").value;

    if (searchInput === '') {
        alert('검색어를 입력하세요.');
        return;
    }

    // 검색어에 따른 동영상 필터링 (검색어가 동영상 제목에 포함되어 있는지 확인)
    let filteredVideos = videoList.filter(function (video) {
        return video.video_title.includes(searchInput);
    });

    if (filteredVideos.length === 0) {
        alert('검색 결과가 없습니다.');
        return;
    }

    // 필터링된 동영상들을 innerHTML로 추가
    let thumbnailInfo = '';
    for (let i = 0; i < filteredVideos.length; i++) {
        // thumbnailInfo += '<img src="' + filteredVideos[i].image_link + '">';
        thumbnailInfo += '<div>영상 제목: ' + filteredVideos[i].video_title + '</div>';
        thumbnailInfo += '<p>조회수: ' + filteredVideos[i].views + '회</p>';
        thumbnailInfo += '<p>게시일: ' + filteredVideos[i].upload_date + '</p>';
        thumbnailInfo += '<p>채널: ' + filteredVideos[i].video_channel + '</p>';
        thumbnailInfo += '<p>영상 설명: ' + filteredVideos[i].video_detail + '</p>';
    }
    document.getElementById('search_result').innerHTML = thumbnailInfo;
}