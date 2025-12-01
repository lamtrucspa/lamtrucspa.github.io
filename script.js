document.addEventListener('DOMContentLoaded', () => {
    // 1. SWIPER INIT
    try {
        var swiper = new Swiper(".mySwiper", {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        });
    } catch(e) {}

    // 2. LIGHTBOX
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightbox = document.getElementById('closeLightbox');
    if (lightbox) {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('zoomable') && !e.target.closest('.service-modal-content')) {
                lightboxImage.src = e.target.src; 
                lightbox.classList.add('show'); 
            }
        });
        const close = () => { lightbox.classList.remove('show'); setTimeout(() => lightboxImage.src = '', 300); };
        closeLightbox.addEventListener('click', close);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    }

    // 3. SERVICE MODAL
    const serviceModal = document.getElementById('serviceModal');
    const closeServiceModal = document.getElementById('closeServiceModal');
    const modalMedia = document.getElementById('serviceModalMedia');
    if (serviceModal) {
        document.addEventListener('click', function(e) {
            const trigger = e.target.closest('.service-modal-trigger');
            if (e.target.classList.contains('booking-trigger-small') || e.target.classList.contains('zoomable')) return;

            if (trigger) {
                e.preventDefault(); 
                document.getElementById('serviceModalTitle').textContent = trigger.dataset.name;
                document.getElementById('serviceModalInfo').textContent = `${trigger.dataset.duration} | ${trigger.dataset.price}`;
                document.getElementById('serviceModalDesc').innerHTML = trigger.dataset.desc; 
                
                modalMedia.innerHTML = ''; 
                if (trigger.dataset.image) {
                    modalMedia.style.display = 'block';
                    modalMedia.innerHTML = `<img src="${trigger.dataset.image}" onerror="this.src='https://placehold.co/600x400';">`;
                } else {
                    modalMedia.style.display = 'none';
                }
                serviceModal.classList.add('show');
            }
        });
        const closeSvc = () => { serviceModal.classList.remove('show'); setTimeout(() => modalMedia.innerHTML = '', 300); };
        closeServiceModal.addEventListener('click', closeSvc);
        serviceModal.addEventListener('click', (e) => { if (e.target === serviceModal) closeSvc(); });
    }

    // 4. BOOKING MODAL
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingModal = document.getElementById('closeBookingModal');
    const bookingServiceInput = document.getElementById('bookServiceInput');

    function openBooking(serviceName = null) {
        if (bookingModal) {
            if (serviceName && bookingServiceInput) {
                bookingServiceInput.value = serviceName;
            }
            bookingModal.classList.add('show');
        }
    }
    function closeBooking() {
        if (bookingModal) bookingModal.classList.remove('show');
    }

    const heroBtn = document.getElementById('openBookingModalHero');
    const ctaBtn = document.getElementById('openBookingModalCta');
    if(heroBtn) heroBtn.addEventListener('click', (e) => { e.preventDefault(); openBooking(); });
    if(ctaBtn) ctaBtn.addEventListener('click', (e) => { e.preventDefault(); openBooking(); });
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('booking-trigger-small')) {
            e.preventDefault();
            e.stopPropagation();
            openBooking(e.target.dataset.serviceName);
        }
    });

    if (closeBookingModal) closeBookingModal.addEventListener('click', closeBooking);
    if (bookingModal) bookingModal.addEventListener('click', (e) => { if (e.target === bookingModal) closeBooking(); });

    // 5. MUSIC & ANIMATION
    const musicBtn = document.getElementById('musicToggleBtn');
    const bgMusic = document.getElementById('bgMusic');
    const bambooLeft = document.getElementById('bambooLeft');
    const bambooRight = document.getElementById('bambooRight');
    if (musicBtn && bgMusic) {
        function updateMusicUI(isPlaying) {
            if (isPlaying) {
                musicBtn.classList.add('playing');
                if (bambooLeft) bambooLeft.classList.add('swaying');
                if (bambooRight) bambooRight.classList.add('swaying-delayed');
            } else {
                musicBtn.classList.remove('playing');
                if (bambooLeft) bambooLeft.classList.remove('swaying');
                if (bambooRight) bambooRight.classList.remove('swaying-delayed');
            }
        }
        musicBtn.addEventListener('click', () => {
            if (bgMusic.paused) { bgMusic.play().then(() => updateMusicUI(true)).catch(() => {}); } 
            else { bgMusic.pause(); updateMusicUI(false); }
        });
        
        // Cố gắng tự động phát nhạc (trình duyệt thường chặn cái này)
        document.body.addEventListener('click', function() {
            if (bgMusic.paused) {
                 bgMusic.play().then(() => updateMusicUI(true)).catch(() => {});
            }
        }, { once: true });
    }

    // 6. FALLING LEAVES
    if (window.fallingLeafImageUrl) {
        const leafContainer = document.getElementById('leaf-container');
        if (leafContainer) {
            function createLeaf() {
                const leaf = document.createElement('div');
                leaf.classList.add('leaf');
                leaf.style.backgroundImage = `url('${window.fallingLeafImageUrl}')`;
                leaf.style.left = Math.random() * 100 + 'vw';
                const duration = Math.random() * 10 + 10;
                leaf.style.animationDuration = duration + 's';
                leaf.style.animationDelay = Math.random() * -10 + 's'; 
                leaf.style.width = (Math.random() * 20 + 20) + 'px';
                leaf.style.height = leaf.style.width;
                leaf.style.opacity = Math.random() * 0.5 + 0.3; 
                leafContainer.appendChild(leaf);
                setTimeout(() => leaf.remove(), duration * 1000); 
            }
            for(let i=0; i<3; i++) createLeaf();
            setInterval(createLeaf, 4000);
        }
    }

    // 7. SCROLL REVEAL
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));
});
