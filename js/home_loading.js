// Youtube 로고버튼, 홈 아이콘 클릭시 홈화면 불러오기

let ytLogo = document.getElementById("yt-logo");
let sidebarMiniHome = document.getElementById("sidebar-mini-home");

ytLogo.addEventListener("click", function () {
    let feed = document.getElementById("feed");
    feed.innerHTML = "";
    let searchInput = document.getElementById("searchInput");
    searchInput.value = "";
    
    createVideoItem(0);
});

sidebarMiniHome.addEventListener("click", function () {
    let feed = document.getElementById("feed");
    feed.innerHTML = "";
    let searchInput = document.getElementById("searchInput");
    searchInput.value = "";
    
    createVideoItem(0);
});
