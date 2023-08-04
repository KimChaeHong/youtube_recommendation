const menuIcon = document.getElementById('menu-icon');
const sidebarMini = document.getElementById('sidebar-mini');
const sidebarWide = document.getElementById('sidebar-wide');
const channelMargin = document.getElementById('contents');

menuIcon.addEventListener('click', () => {
  sidebarMini.classList.toggle('active');
  sidebarWide.classList.toggle('active');
  channelMargin.classList.toggle('active');
});
