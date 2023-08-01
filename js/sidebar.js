document.getElementById("menu-icon").addEventListener("click", clickSidebar);

isSidebarOpen = true;

function clickSidebar() {
    isSidebarOpen = !isSidebarOpen;

    toggleSidebar();
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (isSidebarOpen) {
        sidebar.style.width = "240px";
    } else {
        sidebar.style.width = "65px";
    }
}