document.getElementById("menu-icon").addEventListener("click", clickSidebar);

isSidebarOpen = false;

function clickSidebar() {
    isSidebarOpen = !isSidebarOpen;

    toggleSidebar();
}

// 함수 내용 추가 7.31 허유미
// 넓은 사이드바를 평소에는 안보이게 했다가, 클릭하면 보이도록 토글버튼 생성
function toggleSidebar() {
    const sidebarWide = document.getElementById("sidebar-wide");
    const topMenu = document.getElementById("top-menu");
    const feed = document.getElementById("feed");
    if (isSidebarOpen) {
        sidebarWide.style.display = "flex";
        topMenu.style.left = "240px"
        feed.style.marginLeft = "250px";

    } else {
        sidebarWide.style.display = "none";
        topMenu.style.left = "65px"
        feed.style.marginLeft = "120px";
    }
}