document.addEventListener('DOMContentLoaded', () => {
            
    // --- 1. KHỞI TẠO SWIPER ---
    try {
        var swiper = new Swiper(".mySwiper", {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    } catch(e) { console.error("Swiper init failed", e); }

    // --- 2. TỰ ĐỘNG ẨN THÔNG BÁO ---
    const alerts = document.querySelectorAll('[data-alert]');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert) {
                alert.style.transition = 'opacity 0.5s ease';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 500);
            }
        }, 4000); // Tăng thời gian lên 4 giây
    });
    
    // --- 3. XỬ LÝ LIGHTBOX (PHÓNG TO ẢNH) ---
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightbox = document.getElementById('closeLightbox');
    
    if (lightbox && lightboxImage && closeLightbox) {
        // Tìm tất cả ảnh có class 'zoomable'
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('zoomable')) {
                // CHỈNH SỬA: Không kích hoạt lightbox nếu nó nằm trong modal dịch vụ
                if (e.target.closest('.service-modal-content')) {
                    return;
                }
                lightboxImage.src = e.target.src; // Đặt src cho ảnh modal
                lightbox.classList.add('show'); // Hiển thị modal
            }
        });
        
        // Hàm đóng modal
        function close() {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightboxImage.src = ''; // Xóa src sau khi đóng
            }, 300);
        }
        
        closeLightbox.addEventListener('click', close);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Chỉ đóng khi click vào nền mờ
                close();
            }
        });
    }

    // --- 4. XỬ LÝ MODAL CHI TIẾT DỊCH VỤ ---
    const serviceModal = document.getElementById('serviceModal');
    const closeServiceModal = document.getElementById('closeServiceModal');
    
    const modalTitle = document.getElementById('serviceModalTitle');
    const modalInfo = document.getElementById('serviceModalInfo');
    const modalDesc = document.getElementById('serviceModalDesc');
    const modalMedia = document.getElementById('serviceModalMedia');

    if (serviceModal && closeServiceModal && modalTitle && modalInfo && modalDesc && modalMedia) {
        
        // Lắng nghe click trên toàn bộ document
        document.addEventListener('click', function(e) {
            // Sử dụng .closest() để tìm thẻ trigger, kể cả khi click vào thẻ con
            const trigger = e.target.closest('.service-modal-trigger');
            
            // Quan trọng: Không kích hoạt nếu click vào ảnh zoomable
            if (e.target.classList.contains('zoomable')) {
                return;
            }

            if (trigger) {
                e.preventDefault(); // Ngăn hành vi mặc định (nếu có)
                
                // 1. Lấy dữ liệu từ data attributes
                const name = trigger.dataset.name;
                const duration = trigger.dataset.duration;
                const price = trigger.dataset.price;
                const desc = trigger.dataset.desc;
                const image = trigger.dataset.image;
                const video = trigger.dataset.video;
                
                // 2. Đổ dữ liệu vào modal
                modalTitle.textContent = name;
                modalInfo.textContent = `${duration} | ${price}`;
                modalDesc.innerHTML = desc; // Dùng innerHTML vì data-desc đã nl2br
                
                // 3. Xử lý Media (Video ưu tiên)
                modalMedia.innerHTML = ''; // Xóa media cũ
                if (video) {
                    // Xử lý link YouTube
                    let embedUrl = video.replace("watch?v=", "embed/");
                    modalMedia.style.display = 'block';
                    modalMedia.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                } else if (image) {
                    modalMedia.style.display = 'block';
                    modalMedia.innerHTML = `<img src="${image}" alt="${name}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/eeeeee/aaaaaa?text=Image+Error';">`;
                } else {
                    // Không có ảnh hoặc video
                    modalMedia.style.display = 'none';
                }
                
                // 4. Hiển thị modal
                serviceModal.classList.add('show');
            }
        });
        
        // Hàm đóng modal
        function closeSvcModal() {
            serviceModal.classList.remove('show');
            // Dừng video đang phát (nếu có) bằng cách xóa nội dung
            setTimeout(() => {
                 modalMedia.innerHTML = '';
            }, 300); // Chờ hiệu ứng transition hoàn tất
        }
        
        closeServiceModal.addEventListener('click', closeSvcModal);
        
        serviceModal.addEventListener('click', (e) => {
            if (e.target === serviceModal) { // Chỉ đóng khi click vào nền mờ
                closeSvcModal();
            }
        });
    }

    // --- 5. PHẦN ĐIỀU KHIỂN NHẠC ĐÃ BỊ XÓA ---
    // (Vì chúng ta đã chuyển sang trình phát HTML5 mặc định)

    // --- 6. MỚI: XỬ LÝ HIỆU ỨNG LÁ RƠI ---
    // Kiểm tra xem URL ảnh lá rơi có tồn tại không (được truyền từ index.php)
    if (window.fallingLeafImageUrl && window.fallingLeafImageUrl.trim() !== '') {
        const leafContainer = document.getElementById('leaf-container');
        const leafImageUrl = window.fallingLeafImageUrl;

        if (leafContainer) {
            // Hàm tạo lá
            function createLeaf() {
                const leaf = document.createElement('div');
                leaf.classList.add('leaf');
                
                // Đặt ảnh nền
                leaf.style.backgroundImage = `url('${leafImageUrl}')`;
                
                // 1. Vị trí ngang ngẫu nhiên
                leaf.style.left = Math.random() * 100 + 'vw';
                
                // 2. Tốc độ rơi ngẫu nhiên (thời gian animation)
                // (Từ 5 đến 10 giây)
                const duration = Math.random() * 5 + 5;
                leaf.style.animationDuration = duration + 's';
                
                // 3. Độ trễ ngẫu nhiên (để lá không rơi cùng lúc)
                leaf.style.animationDelay = Math.random() * -10 + 's'; // Bắt đầu ngay
                
                // 4. Kích thước ngẫu nhiên (từ 20px đến 40px)
                const size = Math.random() * 20 + 20;
                leaf.style.width = size + 'px';
                leaf.style.height = size + 'px';

                // 5. Độ mờ ngẫu nhiên
                leaf.style.opacity = Math.random() * 0.5 + 0.3; // Từ 0.3 đến 0.8
                
                leafContainer.appendChild(leaf);
                
                // Xóa "lá" sau khi nó rơi xong (để tiết kiệm bộ nhớ)
                setTimeout(() => {
                    leaf.remove();
                }, duration * 1000); // Chuyển sang mili-giây
            }

            // Tạo ra 20 lá lúc ban đầu
            for(let i = 0; i < 20; i++) {
                createLeaf();
            }
            
            // Cứ mỗi 1 giây lại tạo thêm 1 lá mới
            setInterval(createLeaf, 1000);
        }
    }

});