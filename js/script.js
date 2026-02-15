/**
 * UI Controller cho Trang Chủ (Hub) Xã Tiên Lữ
 */
const App = {
    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        console.log("Hệ thống số hóa xã Tiên Lữ - Sẵn sàng phục vụ bà con.");
    },

    /**
     * Xử lý menu trên thiết bị di động (Hamburger Menu)
     */
    setupMobileMenu() {
        const toggleBtn = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (toggleBtn && navLinks) {
            toggleBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                
                // Đổi icon nếu cần (Optional)
                const icon = toggleBtn.querySelector('i');
                if (navLinks.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
        }
    },

    /**
     * Hiệu ứng mượt mà khi cuộn hoặc tương tác
     */
    setupScrollEffects() {
        const cards = document.querySelectorAll('.feature-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease-out';
            observer.observe(card);
        });
    }
};

// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => App.init());