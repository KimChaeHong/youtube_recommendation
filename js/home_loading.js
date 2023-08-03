// Youtube 로고버튼, 홈 아이콘 클릭시 홈화면 불러오기 허유미 8.1
// search.js 내용 변경에 따른 함수 변경 허유미 8.2

let ytLogo = document.getElementById("yt-logo");
let sidebarMiniHome = document.getElementById("sidebar-mini-home");

ytLogo.addEventListener("click", function () {
    let feed = document.getElementById("feed");
    feed.innerHTML = "";
    let searchInput = document.getElementById("searchInput");
    searchInput.value = "";
    
    getVideoList().then(createVideoItem);
});

sidebarMiniHome.addEventListener("click", function () {
    let feed = document.getElementById("feed");
    feed.innerHTML = "";
    let searchInput = document.getElementById("searchInput");
    searchInput.value = "";
    
    getVideoList().then(createVideoItem);
});
