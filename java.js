const menuToggle = document.querySelector('.menu-toggle input');
const nav = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('slide');
});
