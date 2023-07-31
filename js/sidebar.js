document.getElementById("menu-icon").addEventListener("click", clickSidebar);

isSidebarOpen = true;

function clickSidebar() {
    isSidebarOpen = !isSidebarOpen;

    toggleSidebar();
}

// 함수 내용 추가 7.31 허유미
// 넓은 사이드바를 평소에는 안보이게 했다가, 클릭하면 보이도록 토글버튼 생성
function toggleSidebar() {
    const sidebar_wide = document.getElementById("sidebar-wide");
    const top_menu = document.getElementById("top-menu");
    const thumbnail = document.getElementById("thumbnail");
    if (isSidebarOpen) {
        sidebar_wide.style.display = "flex";
        top_menu.style.left = "240px"
        thumbnail.style.marginLeft = "250px";

    } else {
        sidebar_wide.style.display = "none";
        top_menu.style.left = "65px"
        thumbnail.style.marginLeft = "120px";
    }
}