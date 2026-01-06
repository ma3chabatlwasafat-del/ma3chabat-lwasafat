// Mobile Menu Toggle
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.nav-links-mobile');
    
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
}

// Create hamburger menu and mobile nav if they don't exist
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    
    // Add hamburger menu if it doesn't exist
    if (!document.querySelector('.hamburger-menu')) {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.onclick = toggleMobileMenu;
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        nav.appendChild(hamburger);
    }
    
    // Create mobile navigation links if they don't exist
    if (!document.querySelector('.nav-links-mobile')) {
        const mobileNav = document.createElement('div');
        mobileNav.className = 'nav-links-mobile';
        mobileNav.innerHTML = `
            <a href="#home" onclick="toggleMobileMenu()">الرئيسية</a>
            <a href="#products" onclick="toggleMobileMenu()">المنتجات</a>
            <a href="#about" onclick="toggleMobileMenu()">حولنا</a>
            <a href="#blog" onclick="toggleMobileMenu()">نصائح</a>
            <a href="#contact" onclick="toggleMobileMenu()">تواصل</a>
            <a href="https://www.instagram.com/ma3chbat_lwasafat" target="_blank" class="nav-instagram instagram-btn">
                <span>📷</span> تابعنا على Instagram
            </a>
        `;
        nav.appendChild(mobileNav);
    }
});
