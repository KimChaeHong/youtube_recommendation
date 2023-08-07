// 채널 내 동영상 검색 기능 추가 허유미 8.3

// 검색 아이콘, 검색창, 툴바 비디오메뉴  요소 가져오기
const cSearchIcon = document.querySelector(".c-search-icon");
const cSearchInput = document.querySelector(".c-search-input");
const toolbarVideo = document.querySelector(".toolbar-menu[data-menu='VIDEOS']");

// 검색창 초기 상태를 보이지 않도록 설정
cSearchInput.style.display = "none";

// 검색 아이콘 클릭 이벤트 핸들러 추가
cSearchIcon.addEventListener("click", (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지

    // 검색창 토글
    // 툴바 메뉴 중 Videos에서만 검색 가능하도록 조건 추가 허유미 8.6
    if ((cSearchInput.style.display === "none") && (toolbarVideo.classList.contains('active'))) {
        cSearchInput.style.display = "block";
    } else {
        if (!toolbarVideo.classList.contains('active')){
            alert("검색을 원하신다면 VIDEOS 메뉴로 이동하세요.")
        }
        cSearchInput.style.display = "none";
        cSearchInput.value = '';
    }
});

// Document 클릭 이벤트 핸들러 추가
document.addEventListener("click", (event) => {
    // 검색창이 보이는 상태이고, 검색 아이콘을 제외한 다른 영역을 클릭했을 때 검색창을 닫음
    if (cSearchInput.style.display === "block" && event.target !== cSearchIcon && event.target !== cSearchInput) {
        cSearchInput.style.display = "none";
        cSearchInput.value = '';
    }
});


// 채널 내 동영상 검색하면 결과 보여주기
cSearchInput.addEventListener("keypress", function (event) {
    // 엔터 키의 키 코드 = 13
    if (event.keyCode === 13) {
        let searchKeyword = cSearchInput.value;
        getVideoList().then((videoList) => {
            let filteredVideoList = videoList.filter((video) =>
                video.video_title.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            if (filteredVideoList.length === 0) {
                alert('검색 결과가 없습니다.');
            } else {
                createVideoItem(filteredVideoList);
            }
        });
    }
});