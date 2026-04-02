document.addEventListener('DOMContentLoaded', () => {
    const pagesContainer = document.getElementById('pages-container');
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;
    const totalPages = pages.length;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;

    function updateNav(pageIndex) {
        pages.forEach((page, index) => {
            if (index === pageIndex) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        const navLinks = document.querySelectorAll('.dock-nav ul li a');
        navLinks.forEach((link, index) => {
            if (index === pageIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update dock navigation data attribute for page-specific colors
        const dockNav = document.querySelector('.dock-nav');
        if (dockNav) {
            dockNav.setAttribute('data-active-page', pageIndex);
        }
    }

    function scrollPage(event) {
        if (isScrolling) return;
        isScrolling = true;

        if (event.deltaY > 0) {
            // Scrolling down
            if (currentPage < totalPages - 1) {
                currentPage++;
            }
        } else {
            // Scrolling up
            if (currentPage > 0) {
                currentPage--;
            }
        }

        pagesContainer.style.transform = `translateY(-${currentPage * 100}vh)`;
        updateNav(currentPage);
        if (typeof triggerPageFlash === 'function') triggerPageFlash();

        setTimeout(() => {
            isScrolling = false;
        }, 1000); // This should match the transition duration
    }

    function handleTouchStart(event) {
        touchStartY = event.changedTouches[0].screenY;
    }

    function handleTouchEnd(event) {
        touchEndY = event.changedTouches[0].screenY;
        if (touchEndY < touchStartY) {
            // Swiped up
            if (currentPage < totalPages - 1) {
                currentPage++;
            }
        } else if (touchEndY > touchStartY) {
            // Swiped down
            if (currentPage > 0) {
                currentPage--;
            }
        }

        pagesContainer.style.transform = `translateY(-${currentPage * 100}vh)`;
        updateNav(currentPage); // Use updateNav instead of showPage
    }

    // Initialize on page load
    updateNav(currentPage);

    const nav = document.querySelector('.dock-nav');
    if (nav) {
        nav.addEventListener('click', (event) => {
            const link = event.target.closest('a'); // Handle icon clicks
            if (link) {
                event.preventDefault();
                const pageIndex = parseInt(link.dataset.page);
                if (!isNaN(pageIndex)) {
                    currentPage = pageIndex;
                    pagesContainer.style.transform = `translateY(-${currentPage * 100}vh)`;
                    updateNav(currentPage);
                    if (typeof triggerPageFlash === 'function') triggerPageFlash();
                }
            }
        });
    }

    document.addEventListener('wheel', scrollPage);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    // Page 1: Greeting Animation (Typing Effect)
    const greetingText = document.getElementById('greeting-text');
    const greetings = ["Hi", "Hallo", "Ciao", "Hola", "Bonjour", "Cześć", "Привет", "Hej", "Hei", "Γειά", "Ahoj", "Olá", "Salut", "Здравейте", "Laba diena", "Sveiki", "Servus"];
    let greetingIndex = 0;

    function typeWriter(text, i, fnCallback) {
        if (!greetingText.isConnected) return;
        if (i < (text.length)) {
            greetingText.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true" class="cursor">|</span>';
            setTimeout(function () {
                typeWriter(text, i + 1, fnCallback)
            }, 100);
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 2000); // Wait before deleting
        }
    }

    function deleteWriter(text, i, fnCallback) {
        if (!greetingText.isConnected) return;
        if (i >= 0) {
            greetingText.innerHTML = text.substring(0, i) + '<span aria-hidden="true" class="cursor">|</span>';
            setTimeout(function () {
                deleteWriter(text, i - 1, fnCallback)
            }, 50);
        } else if (typeof fnCallback == 'function') {
            fnCallback();
        }
    }

    function startTypingLoop() {
        const text = greetings[greetingIndex];
        typeWriter(text, 0, function () {
            deleteWriter(text, text.length, function () {
                greetingIndex = (greetingIndex + 1) % greetings.length;
                startTypingLoop();
            });
        });
    }

    // Start with "Hi" directly
    if (greetingText) startTypingLoop();

    // Matrix Particle Rain
    const canvas = document.createElement('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '0'; // Behind everything
        canvas.style.pointerEvents = 'none';
        document.body.prepend(canvas);

        let width, height;
        let particles = [];

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speed = Math.random() * 2 + 1; // Falling speed
                this.size = Math.random() * 15 + 10;
                this.text = chars[Math.floor(Math.random() * chars.length)];
                this.opacity = Math.random() * 0.15; // low opacity
            }

            update() {
                this.y += this.speed;
                if (this.y > height) {
                    this.y = -20;
                    this.x = Math.random() * width;
                    this.text = chars[Math.floor(Math.random() * chars.length)]; // Change char on reset
                }
                if (Math.random() < 0.05) {
                    this.text = chars[Math.floor(Math.random() * chars.length)];
                }
            }

            draw() {
                ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`; // Neon Cyan tint
                ctx.font = `${this.size}px 'Fira Code'`;
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    // Page 4: Carousel — IMMERSIVE REDESIGN
    const carousel = document.querySelector('.carousel');
    const slides   = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;
    let isSliding    = false;

    // Per-hobby accent colours + metadata
    const hobbyData = [
        { accent: '#c084fc', num: '01', label: 'Music Production',  stats: ['Self-Taught', 'Guitar', 'Bass', 'Ukulele', 'Producer'] },
        { accent: '#60a5fa', num: '02', label: 'Chess',             stats: ['FIDE · 1580', '2135 Peak Rapid', '14+ Years', 'International'] },
        { accent: '#f87171', num: '03', label: 'Drums',             stats: ['VIT Chennai', 'IIT Madras', 'Loyola College', '3 Bands'] },
        { accent: '#4ade80', num: '04', label: 'Animals',           stats: ['NGO Volunteer', 'Venus Welfare Trust', 'Durgapur'] },
        { accent: '#fb923c', num: '05', label: 'Story Games',       stats: ['Narrative Depth', 'Story-Driven', 'Immersive Worlds'] }
    ];

    // Inject chapter labels, underline, and stat chips into each slide
    slides.forEach((slide, i) => {
        const data    = hobbyData[i];
        if (!data) return;
        const textCol = slide.querySelector('.slide-column:nth-child(2)');
        if (!textCol) return;
        textCol.setAttribute('data-num', data.num);
        const h3 = textCol.querySelector('h3');
        if (!h3) return;

        const chEl = document.createElement('div');
        chEl.className = 'hobby-chapter-num';
        chEl.innerHTML = `<span>${data.label}</span><span style="opacity:0.4;margin-left:8px">${data.num} — 05</span>`;
        h3.before(chEl);

        const line = document.createElement('div');
        line.className = 'hobby-title-line';
        h3.after(line);

        const statsEl = document.createElement('div');
        statsEl.className = 'hobby-stats';
        data.stats.forEach(s => {
            const chip = document.createElement('span');
            chip.className = 'hobby-stat-chip';
            chip.textContent = s;
            statsEl.appendChild(chip);
        });
        line.after(statsEl);
    });

    // Update accent CSS variable + progress bar + dot glow
    function setAccent(index) {
        const data = hobbyData[index];
        if (!data) return;
        document.documentElement.style.setProperty('--hobby-accent', data.accent);
        const pb = document.querySelector('.hobby-progress-bar');
        if (pb) {
            pb.style.width      = `${((index + 1) / slides.length) * 58}%`;
            pb.style.background = data.accent;
            pb.style.boxShadow  = `0 0 12px ${data.accent}`;
        }
    }

    function updateDots(idx) {
        document.querySelectorAll('#page4 .dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Directional slide transition
    function goToSlide(newIdx) {
        if (newIdx === currentSlide || isSliding) return;
        if (newIdx < 0 || newIdx >= slides.length) return;
        isSliding = true;

        const dir      = newIdx > currentSlide ? 1 : -1;
        const outSlide = slides[currentSlide];
        const inSlide  = slides[newIdx];
        const ease     = 'cubic-bezier(0.77, 0, 0.175, 1)';

        // Position incoming slide off-screen without a transition
        inSlide.style.transition = 'none';
        inSlide.style.transform  = `translateX(${dir * 105}%)`;
        inSlide.style.opacity    = '1';
        inSlide.classList.add('active');

        requestAnimationFrame(() => requestAnimationFrame(() => {
            inSlide.style.transition  = `transform 0.78s ${ease}`;
            inSlide.style.transform   = 'translateX(0)';
            outSlide.style.transition = `transform 0.78s ${ease}, opacity 0.4s ease`;
            outSlide.style.transform  = `translateX(${-dir * 105}%)`;
            outSlide.style.opacity    = '0';
        }));

        setTimeout(() => {
            outSlide.classList.remove('active');
            ['transform', 'transition', 'opacity'].forEach(p => {
                outSlide.style[p] = '';
                inSlide.style[p]  = '';
            });
            isSliding = false;
        }, 820);

        currentSlide = newIdx;
        updateDots(newIdx);
        setAccent(newIdx);
    }

    if (dotsContainer && slides.length > 0) {
        createDots();
        updateDots(0);
        slides[0].classList.add('active');
        setAccent(0);
    }

    if (nextButton) nextButton.addEventListener('click', () => goToSlide((currentSlide + 1) % slides.length));
    if (prevButton) prevButton.addEventListener('click', () => goToSlide((currentSlide - 1 + slides.length) % slides.length));

    // Keyboard arrow navigation for hobbies
    document.addEventListener('keydown', e => {
        if (currentPage !== 3) return; // page4 is index 3
        if (e.key === 'ArrowRight') goToSlide((currentSlide + 1) % slides.length);
        if (e.key === 'ArrowLeft')  goToSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    // Inject top progress bar
    const hobbyCarousel = document.querySelector('#page4 .carousel-container');
    if (hobbyCarousel) {
        const pb = document.createElement('div');
        pb.className        = 'hobby-progress-bar';
        pb.style.width      = `${(1 / slides.length) * 58}%`;
        pb.style.background = hobbyData[0].accent;
        pb.style.boxShadow  = `0 0 12px ${hobbyData[0].accent}`;
        hobbyCarousel.appendChild(pb);
    }

    // ── Music slide: swap left column to guitar2.mp4 video ──────────────────
    if (slides[0]) {
        const leftCol0 = slides[0].querySelector('.slide-column:nth-child(1)');
        if (leftCol0) {
            leftCol0.innerHTML = '';
            const guitarVid = document.createElement('video');
            guitarVid.src = 'pics/guitar2.mp4';
            guitarVid.autoplay = true;
            guitarVid.loop     = true;
            guitarVid.muted    = true;
            guitarVid.setAttribute('playsinline', '');
            guitarVid.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
            leftCol0.appendChild(guitarVid);
        }
    }

    // ── Chess slide: use hobbie_chess.JPG as left column image ───────────────
    if (slides[1]) {
        const leftCol1 = slides[1].querySelector('.slide-column:nth-child(1)');
        if (leftCol1) {
            const chessImg = leftCol1.querySelector('img');
            if (chessImg) chessImg.src = 'pics/hobbie_chess.JPG';
        }
    }

    // ── Gallery overlay ──────────────────────────────────────────────────────
    const galleryItems = [
        { src: 'pics/hobbies_gib_guitar.jpeg', type: 'image', caption: 'Me with my uke',                           category: 'Music'        },
        { src: 'pics/guitar2.mp4',             type: 'video', caption: 'Making music is fun',                      category: 'Music'        },
        { src: 'pics/gt2.mp4',                 type: 'video', caption: 'Making music with friend is more fun',     category: 'Music'        },
        { src: 'pics/prodd.mp4',               type: 'video', caption: 'Was trying to make Swing but :)',          category: 'Music'        },
        { src: 'pics/hobbie_chess.JPG',        type: 'image', caption: 'Got this on IIT Madras Sports Fest',       category: 'Chess'        },
        { src: 'pics/hob_drums.jpeg',          type: 'image', caption: 'Rock night pic',                           category: 'Drums'        },
        { src: 'pics/drums2.JPG',              type: 'image', caption: 'Performing at my uni',                     category: 'Drums'        },
        { src: 'pics/Hob__gib_animals.JPG',    type: 'image', caption: 'I love animals',                           category: 'Animals'      },
        { src: 'pics/hob_video_games.webp',    type: 'image', caption: 'One of the best games ever played',        category: 'Gaming'       },
        { src: 'pics/NEI.jpeg',                type: 'image', caption: 'Final year project to measure exhaustion', category: 'Engineering™' },
        { src: 'pics/Btech.jpeg',              type: 'image', caption: "Rawdogging btech ain't for the weak",      category: 'Engineering™' },
    ];

    let galleryActiveFilter = 'All';
    let lightboxIndex = 0;
    let filteredItems  = [...galleryItems];

    // Build overlay DOM
    const galleryOverlay = document.createElement('div');
    galleryOverlay.id = 'hobby-gallery-overlay';
    galleryOverlay.innerHTML = `
        <div class="gallery-header">
            <div class="gallery-header-title">Gallery<span>/ All Hobbies</span></div>
            <button class="gallery-close-btn" aria-label="Close gallery">✕</button>
        </div>
        <div class="gallery-filters"></div>
        <div class="gallery-grid-scroll">
            <div class="gallery-grid"></div>
        </div>
    `;
    document.body.appendChild(galleryOverlay);

    // Build lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">✕</button>
        <button class="lightbox-arrow left" aria-label="Previous">&#8592;</button>
        <div class="lightbox-media"></div>
        <button class="lightbox-arrow right" aria-label="Next">&#8594;</button>
        <div class="lightbox-caption"></div>
        <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);

    // Gallery trigger button
    const galleryBtn = document.createElement('button');
    galleryBtn.className = 'hobby-gallery-btn';
    galleryBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
        </svg>
        Gallery
    `;
    if (hobbyCarousel) hobbyCarousel.appendChild(galleryBtn);

    // Build category filter tabs
    const categories = ['All', ...new Set(galleryItems.map(i => i.category))];
    const filtersEl  = galleryOverlay.querySelector('.gallery-filters');
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className    = 'gallery-filter-btn' + (cat === 'All' ? ' active' : '');
        btn.textContent  = cat;
        btn.dataset.cat  = cat;
        btn.addEventListener('click', () => {
            galleryActiveFilter = cat;
            filtersEl.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
            renderGrid();
        });
        filtersEl.appendChild(btn);
    });

    function renderGrid() {
        const grid = galleryOverlay.querySelector('.gallery-grid');
        filteredItems = galleryActiveFilter === 'All'
            ? [...galleryItems]
            : galleryItems.filter(i => i.category === galleryActiveFilter);
        grid.innerHTML = '';
        filteredItems.forEach((item, idx) => {
            const cell = document.createElement('div');
            cell.className = 'gallery-cell';
            if (item.type === 'video') {
                cell.innerHTML = `
                    <div class="gallery-thumb">
                        <video src="${item.src}" muted loop playsinline preload="metadata"></video>
                        <div class="gallery-play-overlay">
                            <svg viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                        </div>
                        <div class="gallery-cat-badge">${item.category}</div>
                    </div>
                    <div class="gallery-caption">${item.caption}</div>
                `;
                const thumbVid = cell.querySelector('video');
                cell.querySelector('.gallery-thumb').addEventListener('mouseenter', () => thumbVid.play());
                cell.querySelector('.gallery-thumb').addEventListener('mouseleave', () => { thumbVid.pause(); thumbVid.currentTime = 0; });
            } else {
                cell.innerHTML = `
                    <div class="gallery-thumb">
                        <img src="${item.src}" alt="${item.caption}" loading="lazy">
                        <div class="gallery-cat-badge">${item.category}</div>
                    </div>
                    <div class="gallery-caption">${item.caption}</div>
                `;
            }
            cell.addEventListener('click', () => openLightbox(idx));
            grid.appendChild(cell);
        });
    }

    function openGallery() {
        renderGrid();
        galleryOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeGallery() {
        galleryOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function openLightbox(idx) {
        lightboxIndex = idx;
        renderLightbox();
        lightbox.classList.add('open');
    }
    function closeLightbox() {
        lightbox.classList.remove('open');
        const lbVid = lightbox.querySelector('.lightbox-media video');
        if (lbVid) { lbVid.pause(); lbVid.src = ''; }
    }

    function renderLightbox() {
        const item   = filteredItems[lightboxIndex];
        const media  = lightbox.querySelector('.lightbox-media');
        const capEl  = lightbox.querySelector('.lightbox-caption');
        const ctrEl  = lightbox.querySelector('.lightbox-counter');

        // Clear previous media
        const prevVid = media.querySelector('video');
        if (prevVid) { prevVid.pause(); prevVid.src = ''; }
        media.innerHTML = '';

        if (item.type === 'video') {
            const v = document.createElement('video');
            v.src = item.src;
            v.controls = true;
            v.autoplay  = true;
            v.setAttribute('playsinline', '');
            media.appendChild(v);
        } else {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.caption;
            media.appendChild(img);
        }
        capEl.textContent = item.caption;
        ctrEl.textContent = `${lightboxIndex + 1} / ${filteredItems.length}`;
    }

    // Wiring
    galleryBtn.addEventListener('click', openGallery);
    galleryOverlay.querySelector('.gallery-close-btn').addEventListener('click', closeGallery);
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-arrow.left').addEventListener('click', () => {
        lightboxIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
        renderLightbox();
    });
    lightbox.querySelector('.lightbox-arrow.right').addEventListener('click', () => {
        lightboxIndex = (lightboxIndex + 1) % filteredItems.length;
        renderLightbox();
    });
    // Close on backdrop click
    galleryOverlay.addEventListener('click', e => { if (e.target === galleryOverlay) closeGallery(); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // ── Clicking left-column image/video on any slide opens gallery ──────────
    // Map each slide index → gallery category filter
    const slideCategoryMap = ['Music', 'Chess', 'Drums', 'Animals', 'Gaming'];
    slides.forEach((slide, i) => {
        const leftCol = slide.querySelector('.slide-column:nth-child(1)');
        if (!leftCol) return;
        leftCol.style.cursor = 'pointer';
        // Tooltip hint
        leftCol.title = 'Click to open gallery';
        leftCol.addEventListener('click', () => {
            const cat = slideCategoryMap[i] || 'All';
            galleryActiveFilter = cat;
            // Sync filter buttons
            filtersEl.querySelectorAll('.gallery-filter-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.cat === cat);
            });
            openGallery();
        });
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        if (lightbox.classList.contains('open')) {
            if (e.key === 'Escape')     { closeLightbox(); e.stopImmediatePropagation(); return; }
            if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % filteredItems.length; renderLightbox(); e.stopImmediatePropagation(); return; }
            if (e.key === 'ArrowLeft')  { lightboxIndex = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length; renderLightbox(); e.stopImmediatePropagation(); return; }
        }
        if (galleryOverlay.classList.contains('open')) {
            if (e.key === 'Escape') { closeGallery(); e.stopImmediatePropagation(); }
        }
    });

    const video = document.getElementById('guitar-video');
    if (video) {
        video.addEventListener('click', () => {
            if (video.muted) {
                video.muted = false;
                video.play();
            } else {
                video.muted = true;
            }
        });
    }

    // --- Page 3: RESEARCH SECTION ---
    const researchOptions = document.querySelectorAll('.research-options .option');
    const researchTitle = document.getElementById('research-title');
    const researchDescription = document.getElementById('research-description');

    const researchData = {
        research: {
            title: 'Research & Publications',
            description: 'Spanning Cybersecurity, AI, Digital Forensics, and Intelligent System Design.',
            stats: [
                { value: 10, label: 'Papers' },
                { value: 1,  label: 'Published' },
                { value: 6,  label: 'Under Review' },
                { value: 3,  label: 'In Preparation' }
            ],
            sections: [
                {
                    label: 'Published',
                    papers: [
                        {
                            num: 1,
                            featured: true,
                            title: 'The Mental Health Index (MHI): A Personalized Multi-Task Deep Learning Framework for Real-Time and Explainable Mental Well-Being Assessment',
                            journal: 'IEEE Xplore',
                            badge: 'published',
                            badgeText: 'Published',
                            tags: ['GRU', 'HRV', 'XAI', 'Multi-Task Learning', 'Wearables'],
                            link: 'https://ieeexplore.ieee.org/document/11269758',
                            award: 'PROFILE/PAPERS/MHI/Screenshot%202026-03-26%20145820.png',
                            abstract: 'Mental health disorders represent a growing global burden, yet continuous, objective, and personalized monitoring remains limited by self-report bias and sparse clinical interaction. This paper presents the Mental Health Index (MHI), a personalized multi-task deep learning framework designed for real-time and explainable mental well-being assessment using wearable sensor data. The framework fuses multimodal physiological signals — Heart Rate Variability (HRV), Galvanic Skin Response (GSR), and Respiration Rate — with behavioral data through a Gated Recurrent Unit (GRU)-based multi-task architecture that simultaneously performs mood classification and stress regression. A personalization module adapts the shared feature extractor to individual baselines, improving robustness against inter-user physiological variability. The model achieves 93.9% mood classification accuracy with a regression RMSE of 14.49 and MAE of 8.06. SHAP-based post-hoc explainability provides feature-level attributions for each prediction, making the system interpretable to end users and clinicians. The framework is designed to operate on resource-constrained wearable hardware, supporting continuous, non-intrusive mental health monitoring in everyday environments.'
                        }
                    ]
                },
                {
                    label: 'Under Review — Journal Submitted',
                    papers: [
                        {
                            num: 1,
                            featured: false,
                            title: 'A Resilient Edge–Fog Collaborative Framework for Explainable AI in IoT Systems: Disaster Detection and Beyond',
                            journal: 'IEEE Access',
                            badge: 'review',
                            badgeText: 'Under Review',
                            tags: ['Edge-Fog', 'XAI', 'IoT', 'Arduino', 'Disaster Detection'],
                            link: null,
                            abstract: 'The rapid expansion of IoT devices in safety-critical environments has created an urgent demand for systems that remain reliable when network connections fail or sensor readings become uncertain. This paper proposes a domain-agnostic Edge–Fog collaborative framework that pairs a calibrated, explainable AI model at the Fog layer with lightweight deterministic rules at the Edge layer, ensuring decision-making continuity even during network outages or low-confidence predictions. The framework is validated for disaster detection across eleven event classes: Normal, Fire, Flood, Earthquake, Gas Leak, Short Circuit, Energy Theft, Tampering, Heatwave, Power Failure, and Storm. A synthetic dataset of 120,000 samples with added Gaussian noise and sensor drift was used for training. Results show that the Fog-only mode achieves 99.59% accuracy but fails during disconnections, while the Edge-only mode maintains 100% operational continuity but achieves only about 43.6% accuracy. In contrast, the proposed hybrid approach achieves approximately 91.4% accuracy while maintaining near-continuous operation. A working Arduino UNO R4 WiFi prototype with heterogeneous sensors and a live web dashboard further validates the practical feasibility of the framework. Although implemented for disaster detection, the architecture can be generalized to applications such as smart agriculture, industrial safety, and environmental monitoring.'
                        },
                        {
                            num: 2,
                            featured: false,
                            title: 'FA-AIIDS: A Lightweight Forensic-Aware Intrusion Detection Framework for Edge IoT with Merkle-Tree Provenance',
                            journal: 'IEEE Access',
                            badge: 'review',
                            badgeText: 'Under Review',
                            tags: ['XGBoost', 'Digital Forensics', 'Merkle Tree', 'IoT Security', 'RSA-3072'],
                            link: null,
                            abstract: 'Securing resource-constrained Internet of Things (IoT) environments exposes a persistent tension between low-latency intrusion detection and the forensic reliability of generated audit logs. Most AI-based intrusion detection systems prioritize detection accuracy while treating log integrity as a secondary concern, whereas blockchain-driven forensic approaches impose computational and latency overheads that exceed the capabilities of edge-class microcontrollers. To address this gap, this paper introduces the Forensic-Aware AI-Driven Intrusion Detection System (FA-AIIDS), a hybrid framework that couples lightweight anomaly detection with cryptographically verifiable evidence generation at inference time. FA-AIIDS evaluates five candidate classifiers on a realistic synthetic multimodal sensor dataset incorporating sensor noise, temporal correlation, and adversarial class overlap, selecting XGBoost as the deployed inference model based on a mean cross-validated accuracy of 95.20% (σ = 0.13%) across five folds. The forensic layer cryptographically binds each inference output using SHA-256 hash chaining and Merkle tree aggregation, introducing an amortised cryptographic overhead of 0.028 ms per event. This design enforces tamper-evident provenance without reliance on distributed consensus or persistent connectivity. The framework employs an edge-gateway architecture in which an Arduino UNO R4 Wi-Fi acts as the sensing node and a co-located edge host performs inference and forensic chaining, demonstrating competitive detection accuracy relative to MLP, CNN, GRU, and Random Forest baselines. To satisfy non-repudiation requirements central to post-incident forensic analysis, Merkle roots are signed using RSA-3072, introducing a bounded cryptographic cost that remains feasible for intermittent edge operation. These results indicate that forensic accountability and real-time intrusion detection need not be mutually exclusive in edge IoT deployments.'
                        }
                    ]
                },
                {
                    label: 'Under Review — Awaiting Institutional Submission',
                    papers: [
                        {
                            num: 3,
                            featured: false,
                            title: 'Asymmetric Supervised Training via Reinforcement-driven Attack Augmentation for Robust Network Intrusion Detection',
                            journal: 'IEEE Transactions on Information Forensics and Security',
                            badge: 'review',
                            badgeText: 'Under Review',
                            tags: ['DDPG', 'Adversarial Training', 'NIDS', 'Dueling-DQN', 'Robustness'],
                            link: null,
                            abstract: 'Machine learning-based Network Intrusion Detection Systems (NIDS) achieve near-perfect accuracy on standard benchmarks but remain highly vulnerable to adversarial attacks. This paper introduces ASTRA (Asymmetric Supervised Training via Reinforcement-driven Attack Augmentation), a two-phase framework that integrates a Deep Deterministic Policy Gradient (DDPG) attacker with a supervised Dueling-DQN defender. Ablation experiments conducted across three reinforcement learning loss weight settings over 50,000 adversarial training steps demonstrate identical performance across configurations, indicating that robustness emerges entirely from adversarially augmented training data rather than from the reinforcement learning reward signal itself. Gradient-level analysis further reveals that Layer Normalization substantially reduces the defender\'s Jacobian norm by 42x on CIC-IDS-2017 and 870x on UNSW-NB15, providing a mechanistic explanation for the observed perturbation resistance. A direct comparison with DNN + PGD adversarial training, using the same architecture and perturbation budget, shows that ASTRA achieves comparable robustness while maintaining 34% higher clean Macro-F1 (0.7608 vs. 0.4998), thereby Pareto-dominating the white-box baseline. Evaluation against TRADES indicates that while TRADES achieves slightly higher clean Macro-F1, its performance drops significantly under the DDPG adaptive attacker — by 6.28% and 16.28% on CIC-IDS-2017 and UNSW-NB15 respectively — whereas ASTRA declines by only 0.02% and 1.7%. These results demonstrate that white-box adversarial training objectives fail to generalize to adaptive black-box attackers regardless of objective formulation. Multi-seed experiments confirm reproducibility with low variance (Macro-F1 = 0.7468 ± 0.037 on CIC-IDS-2017). Under adaptive attack conditions, traditional models such as XGBoost and Random Forest suffer Macro-F1 reductions of 27.1% and 29.6% respectively, while ASTRA declines by only 0.02%, demonstrating that benchmark accuracy alone is insufficient to evaluate NIDS reliability in adversarial environments.'
                        },
                        {
                            num: 4,
                            featured: false,
                            title: 'Constraint-Preserving Backdoor Attacks on Machine Learning-Based Network Intrusion Detection Systems',
                            journal: 'IEEE Transactions on Information Forensics and Security',
                            badge: 'review',
                            badgeText: 'Under Review',
                            tags: ['Backdoor Attacks', 'NIDS', 'Adversarial ML', 'Cybersecurity', 'CPBA'],
                            link: null,
                            abstract: 'Existing backdoor attacks on machine learning-based Network Intrusion Detection Systems (NIDS) typically rely on trigger values that are protocol-illegal, statistically anomalous, and operationally infeasible, resulting in a threat model that is both unrealistic and self-defeating. Such unconstrained triggers can reduce clean accuracy by as much as 43 percentage points even under moderate poisoning rates. We argue that this reflects a fundamental misspecification of the adversarial setting and address it through the Constraint-Preserving Backdoor Attack (CPBA) framework. CPBA enforces that trigger values satisfy protocol validity (C1), socket-level realizability (C2), and preservation of inter-feature dependencies (C3). We demonstrate that any CPBA-compliant trigger maps inputs into the support of the training distribution, thereby providing a theoretical guarantee that spectral and clustering-based defenses will fail to detect the attack. We instantiate this framework through the Protocol-Constrained Trigger (PCT) attack and evaluate it across three benchmarks (CIC-IDS-2017, UNSW-NB15, TON-IoT; 7.5 million flows), four classifiers (MLP, TabNet, XGBoost, Random Forest), and four defenses (Spectral Signatures, Activation Clustering, STRIP, Fine-Pruning). Experimental results show that PCT achieves an attack success rate of at least 99.7% while maintaining negligible impact on clean accuracy. Spectral and clustering-based defenses fail entirely, STRIP exhibits threshold calibration instability, and Fine-Pruning proves ineffective (ASR >= 99.9% across pruning rates up to 50%) because the dormant-neuron assumption does not hold in tabular NIDS settings. Finally, we extend CPBA to additional domains including ICS/SCADA systems, API-log classifiers, and IoT sensor data, and introduce three theoretically grounded constraint-aware defense strategies.'
                        },
                        {
                            num: 5,
                            featured: false,
                            title: 'The Neural Exhaustion Index (NEI): A Cross-Domain Physiological Framework Integrating Wearable Stress Biomarkers and Sleep Quality Archetypes for Continuous Exhaustion Estimation',
                            journal: 'IEEE Journal of Biomedical and Health Informatics',
                            badge: 'review',
                            badgeText: 'Under Review',
                            tags: ['Wearables', 'Stress Biomarkers', 'Sleep Quality', 'NEI', 'Physiological AI'],
                            link: null,
                            abstract: 'Physical and cognitive exhaustion represents a critical yet under-monitored dimension of human health, with direct implications for occupational safety, athletic performance, and long-term wellbeing. Existing wearable-based frameworks largely focus on acute stress detection or broad mental wellness estimation and fail to capture the compounding influence of sleep quality on physiological exhaustion dynamics. In this work, we introduce the Neural Exhaustion Index (NEI), a cross-domain framework that integrates multimodal wrist-worn physiological signals with sleep quality archetypes derived from polysomnographic data to produce a continuous and interpretable exhaustion score on a 0–100 scale. The NEI pipeline utilizes a pretrained Temporal Convolutional Network (TCN) as a physiological encoder to extract 25-dimensional latent representations from accelerometry and photoplethysmography signals. These representations are combined with 15 handcrafted features capturing heart rate variability, electrodermal activity, and skin temperature characteristics. Sleep quality archetypes — derived from the Sleep-EDF database using literature-grounded Gaussian distributions parameterized from population-level polysomnographic statistics — are incorporated as contextual inputs through an exponential temporal decay function that models the diminishing influence of prior sleep across the waking day. The resulting 47-dimensional feature representation is processed by an XGBoost regressor evaluated using Leave-One-Subject-Out (LOSO) cross-validation across 15 subjects from the WESAD dataset. The full NEI model achieves a Mean Absolute Error of 4.16 ± 2.35 and an R² of 0.77 ± 0.17, representing a 40% reduction in MAE compared to the physiological-only baseline (p = 6.10 × 10⁻⁵). Statistical fidelity validation confirms that the synthetic sleep augmentation preserves the physiological data manifold, yielding a Global Distribution Distance of 0.00168 and a Kolmogorov–Smirnov test pass rate of 92.5%. The NEI extends and specializes the Mental Health Index framework by focusing specifically on exhaustion-related physiological dynamics through cross-dataset fusion, replacing broad mental wellness classification with high-resolution continuous exhaustion regression grounded in real-world multimodal datasets.'
                        },
                        {
                            num: 6,
                            featured: false,
                            title: 'PAN: Perturbation-Aware Normalization for Adversarially Robust Network Intrusion Detection',
                            journal: 'IEEE Transactions on Information Forensics and Security',
                            badge: 'review',
                            badgeText: 'Under Review',
                            tags: ['Adversarial Robustness', 'Normalization', 'NIDS', 'CIC-IDS-2017', 'PAN'],
                            link: null,
                            abstract: 'The predominant defense against adversarial attacks in network intrusion detection systems (NIDS) has been adversarial training using Projected Gradient Descent (PGD-AT). While PGD-AT improves robustness to gradient-based attacks, it often significantly reduces clean accuracy. On the CIC-IDS-2017 dataset, PGD-AT achieves a clean Macro-F1 score of only 0.4998 — barely above the 0.33 random baseline — whereas an undefended LayerNorm baseline achieves 0.7608. This degradation occurs because PGD augmentation compresses the hypothesis space and removes the minority-class boundaries that are critical for Macro-F1 performance in imbalanced datasets. However, the dominant real-world threat is not strictly white-box gradient attacks but stochastic corruption such as sensor noise, feature-extraction jitter, and distribution shift, for which PGD-AT provides limited protection. To address this limitation, we introduce Perturbation-Aware Normalization (PAN), a lightweight mechanism that integrates a learnable gate into each hidden layer where the gate adapts to the self-normalized magnitude of activations. During perturbations, normalization pressure increases; on clean data it relaxes to preserve discriminative information. PAN introduces only eight scalar parameters (less than 0.02% overhead) and requires no labels or attack signatures. Experiments across three enterprise NIDS benchmarks — CIC-IDS-2017, UNSW-NB15, and TON-IoT — show that PAN achieves a clean Macro-F1 of 0.8003 on CIC-IDS-2017, surpassing LayerNorm at 0.7601 and PGD-AT at 0.4998. Ablation studies confirm that PAN and PGD-AT are complementary rather than competing defenses, and even under gradient attacks PAN achieves a post-attack Macro-F1 of 0.4436 — 2.2x higher than PGD-AT — due to its strong clean-performance preservation.'
                        }
                    ]
                },
                {
                    label: 'In Preparation',
                    papers: [
                        {
                            num: 1,
                            featured: false,
                            title: 'Non-Performing Assets in Indian Commercial Banks: A Comparative Analysis of Public and Private Sector Banks in the Pre- and Post-COVID-19 Era (FY2019–FY2025)',
                            journal: 'Preparing Manuscript',
                            badge: 'preparation',
                            badgeText: 'In Preparation',
                            tags: ['Banking', 'OLS Regression', 'NPA', 'COVID-19', 'Quantitative Finance'],
                            link: null,
                            abstract: 'India\'s banking sector has undergone one of its most dramatic turnarounds in recent financial history, moving from a decade-high Gross NPA ratio of approximately 11.2% in FY2018 to roughly 2.7% by FY2025. This study examines the dynamics of Non-Performing Assets (NPAs) across twelve major Indian commercial banks — six Public Sector Banks (PSBs) and six Private Sector Banks — spanning fiscal years 2019 through 2025. The period encompasses a complete cycle: the post-Asset Quality Review cleanup, the COVID-19 shock, regulatory forbearance, and the subsequent structural recovery. An original panel dataset of 84 bank-year observations is constructed from publicly available annual report disclosures and macroeconomic databases. Using Ordinary Least Squares (OLS) regression, independent samples t-tests, and K-means clustering, the study identifies determinants and temporal patterns of NPA accumulation and resolution. Key findings include: a statistically significant decline in mean GNPA from 8.14% in the pre-COVID period to 3.93% post-COVID (t = 3.52, p = 0.001); PSBs carry 2.36 times higher average NPAs than private banks (8.01% vs. 3.40%); Return on Assets and Net Interest Margin are the only statistically significant predictors of GNPA, accounting for 66.2% of variance (R2 = 0.662); and clustering reveals three distinct bank risk archetypes, with Yes Bank anomalously grouping with the highest-stress PSBs despite being privately owned. The results provide strong empirical support for the "bad management" hypothesis in the Indian context and carry direct implications for PSB reform strategy and banking regulation.'
                        },
                        {
                            num: 2,
                            featured: false,
                            title: 'X-Former: A Cross-Modal Forensic Transformer for Explainable Image Tampering Detection',
                            journal: 'Working On It',
                            badge: 'preparation',
                            badgeText: 'In Preparation',
                            tags: ['Digital Forensics', 'Transformer', 'Image Tampering', 'XAI', 'Cross-Modal'],
                            link: null,
                            abstract: 'Digital image manipulation poses a growing threat to media integrity, demanding forensic tools that are both accurate and interpretable. This work presents the Cross-Modal Forensic Transformer (X-Former), a novel deep learning framework for image tampering detection that jointly reasons over spatial and frequency-domain representations through explicit cross-attention mechanisms. Rather than learning superficial manipulation artifacts, X-Former is trained via a self-supervised forensic pretext task — learning to distinguish authentic image patterns from subtly tampered frequency representations — before being fine-tuned for binary tampered/authentic classification. The architecture\'s dual-stream design, fused through cross-modal attention blocks, enables the model to capture inter-domain statistical inconsistencies that are hallmarks of forgery. Crucially, the framework produces per-patch anomaly maps that localize regions of suspected tampering, offering causal, human-interpretable explanations alongside its predictions. A systematic ablation study evaluates the contribution of each component — cross-attention, spatial stream, and frequency stream — and performance is benchmarked against the HD-Net baseline.'
                        },
                        {
                            num: 3,
                            featured: false,
                            title: 'ProteinLoc3D: Deep Learning-Based Protein Subcellular Localization with Residue-Level Interpretability',
                            journal: 'Preparing Manuscript',
                            badge: 'preparation',
                            badgeText: 'In Preparation',
                            tags: ['Bioinformatics', 'Protein Language Models', 'ESM-2', 'Subcellular Localization', 'XAI'],
                            link: null,
                            abstract: 'Accurate prediction of protein subcellular localization is critical for understanding cellular function, disease mechanisms, and drug target identification. Existing computational methods rely on hand-crafted physicochemical features and classical machine learning classifiers, limiting both predictive accuracy and biological interpretability. In this work, we present ProteinLoc3D, a deep learning pipeline that leverages frozen ESM-2 650M protein language model embeddings with a lightweight MLP classification head to predict localization across 10 subcellular compartments. Evaluated on the benchmark dataset of 531 proteins from Mandal et al. (2015) using 10-fold stratified cross-validation, our method achieves 85.8% overall accuracy, representing a +37.8 percentage point improvement over the original MOPSO-SVM approach (48.0%). To address severe class imbalance — with as few as 7 samples for the Golgi class — we incorporate Focal Loss, per-class weighted sampling, and Gaussian noise augmentation in embedding space. Beyond classification, we introduce residue-level gradient saliency maps and validate that high-importance residues are statistically enriched at known biological targeting signals, including Nuclear Localization Signals (NLS), ER signal peptides, and mitochondrial targeting sequences, providing mechanistic interpretability absent from prior approaches. We further develop an interactive web application featuring real-time prediction, 3D protein structure visualization, UMAP embedding exploration, and a SHAP-based interpretability dashboard, enabling accessible analysis without computational expertise.'
                        }
                    ]
                }
            ]
        },
        patents: {
            title: 'Patents & Intellectual Property',
            description: 'Protecting innovations through formal patent filings. Patentability reports completed for two inventions; one patent is filed and published.',
            stats: [
                { value: 4, label: 'Filed' },
                { value: 2, label: 'Reports Done' },
                { value: 1, label: 'Published' }
            ],
            sections: [
                {
                    label: 'Filed',
                    papers: [
                        {
                            num: 1,
                            featured: false,
                            title: 'Energy Theft Detection System Using Real-Time AI and Pole-to-Pole Analysis',
                            journal: 'Patent Application',
                            badge: 'filed',
                            badgeText: 'Filed & Published',
                            tags: ['IoT', 'AI', 'Energy Security', 'Anomaly Detection', 'Edge Computing'],
                            link: null,
                            patentNo: '202641030651',
                            filedThrough: 'Vellore Institute of Technology',
                            abstract: 'Developed a system for real-time detection and localization of electricity theft using sensor-based monitoring and anomaly detection techniques. The system identifies illegal electricity consumption and assists energy utilities in monitoring and preventing power theft in real time. Pole-to-pole analysis enables granular fault localization across distribution networks, allowing utilities to pinpoint the exact segment where theft or tampering is occurring. The underlying AI model processes live sensor telemetry from smart meters and current sensors to distinguish between legitimate load variations and anomalous consumption patterns indicative of bypassing or meter tampering. The system is designed for low-latency edge deployment, enabling near-instantaneous alerts without reliance on continuous cloud connectivity.'
                        },
                        {
                            num: 2,
                            featured: false,
                            title: 'A Personalized AI-Powered Mental Health Monitoring Smartwatch Using Multimodal Physiological and Behavioral Data Fusion',
                            journal: 'Patent Application',
                            badge: 'filed',
                            badgeText: 'Filed',
                            tags: ['Wearable AI', 'Mental Health', 'Multi-Task Learning', 'HRV', 'XAI'],
                            link: null,
                            reportImg: 'PROFILE/PATENTS/MHI/Screenshot%202026-03-26%20144011.png',
                            abstract: 'This invention describes an AI-enabled smartwatch system for continuous and personalized mental health monitoring through multimodal physiological and behavioral data fusion. The device acquires Heart Rate Variability, Galvanic Skin Response, respiration rate, and behavioral activity data in real time, feeding these into a personalized multi-task deep learning framework running on-device. The system computes an explainable Mental Health Index (MHI) that simultaneously estimates mood state and stress levels, with SHAP-based attributions surfaced to the user for transparency. A personalization module adapts the model to individual physiological baselines, ensuring robustness against inter-user variability without requiring cloud-side retraining. The architecture is designed for energy-efficient wearable deployment, supporting continuous background monitoring with anomaly-triggered alerts for deteriorating mental well-being.'
                        },
                        {
                            num: 3,
                            featured: false,
                            title: 'Smart Disaster Resilience and Management System with AI-Driven Analysis and Offline Failsafe Capabilities',
                            journal: 'Patent Application',
                            badge: 'filed',
                            badgeText: 'Filed',
                            tags: ['IoT', 'Edge-Fog', 'Disaster Management', 'Offline AI', 'Fail-Safe'],
                            link: null,
                            reportImg: 'PROFILE/PATENTS/Disaster/Screenshot%202026-03-26%20144104.png',
                            abstract: 'This invention describes a multi-sensor Edge-Fog IoT system designed for proactive disaster detection and resilient emergency management. The architecture pairs an explainable AI model at the Fog layer — capable of classifying eleven disaster event types including Fire, Flood, Earthquake, Gas Leak, and Heatwave — with lightweight deterministic rules at the Edge layer that activate autonomously during network outages or cloud unavailability. This dual-layer design ensures fail-safe operation: safety-critical responses are never gated on connectivity. The system integrates heterogeneous environmental sensors, a real-time web dashboard for situational awareness, and a confidence-based handoff mechanism between Edge and Fog decision modes. The invention is applicable to smart buildings, industrial facilities, and community-scale disaster preparedness infrastructure.'
                        },
                        {
                            num: 4,
                            featured: false,
                            title: 'Forensic-Aware AI-Driven IoT Intrusion Detection System (FA-AIIDS) with Merkle-Based Evidence Verification',
                            journal: 'Patent Application',
                            badge: 'filed',
                            badgeText: 'Filed',
                            tags: ['IoT Security', 'GRU', 'Merkle Tree', 'Digital Forensics', 'Edge AI'],
                            link: null,
                            note: 'Currently under institutional administration — patentability report in progress.',
                            abstract: 'This invention presents a lightweight IoT intrusion detection system that couples real-time AI-driven threat detection with cryptographically verifiable forensic evidence preservation. A GRU-based temporal anomaly detector operates at sub-millisecond inference latency on edge hardware, flagging malicious network events as they occur. Each detection event is committed to a Merkle-tree hash chain, with the Merkle root signed using RSA-3072 digital signatures, producing an append-only, tamper-evident forensic log suitable for legal proceedings and regulatory audits. The Merkle structure permits efficient verification of individual log entries without replaying the full history, and supports selective evidence disclosure for investigative purposes. The system addresses the forensic accountability gap present in existing IoT security solutions, providing a deployable architecture that satisfies both operational security and evidentiary integrity requirements.'
                        }
                    ]
                }
            ]
        }
    };

    // --- Unified Research Stream Logic ---
    const researchStream = document.getElementById('research-stream');

    // ── Confidential caution modal ────────────────────────────────────────
    const confCautionModal = document.createElement('div');
    confCautionModal.id = 'conf-caution-modal';
    confCautionModal.innerHTML = `
        <div class="conf-caution-inner">
            <div class="conf-caution-icon"><i class="fas fa-lock"></i></div>
            <h3>Confidential Document</h3>
            <p>This preview shows <strong>only the first page</strong> of the patentability report.<br>The complete document is confidential and cannot be displayed publicly.</p>
            <button class="conf-caution-close">Got it</button>
        </div>`;
    document.body.appendChild(confCautionModal);
    confCautionModal.addEventListener('click', e => {
        if (e.target === confCautionModal || e.target.classList.contains('conf-caution-close'))
            confCautionModal.classList.remove('active');
    });
    function showConfidentialCaution() { confCautionModal.classList.add('active'); }

    // ── Abstract modal card ───────────────────────────────────────────────
    const abstractModal = document.createElement('div');
    abstractModal.id = 'abstract-modal';
    abstractModal.innerHTML = `
        <div class="abstract-modal-inner">
            <button class="abstract-modal-close"><i class="fas fa-times"></i></button>
            <div class="abstract-modal-badge"></div>
            <h3 class="abstract-modal-title"></h3>
            <div class="abstract-modal-journal"></div>
            <div class="abstract-modal-divider"></div>
            <p class="abstract-modal-text"></p>
        </div>`;
    document.body.appendChild(abstractModal);
    abstractModal.addEventListener('click', e => {
        if (e.target === abstractModal || e.target.classList.contains('abstract-modal-close') || e.target.closest('.abstract-modal-close'))
            abstractModal.classList.remove('active');
    });
    function showAbstractModal(paper) {
        abstractModal.querySelector('.abstract-modal-title').textContent  = paper.title;
        abstractModal.querySelector('.abstract-modal-journal').innerHTML  = `<i class="fas fa-book-open"></i> ${paper.journal} &nbsp;<span class="status-badge ${paper.badge}">${paper.badgeText}</span>`;
        abstractModal.querySelector('.abstract-modal-text').textContent   = paper.abstract;
        abstractModal.querySelector('.abstract-modal-badge').className    = `abstract-modal-badge badge-accent-${paper.badge}`;
        abstractModal.classList.add('active');
    }

    // ── Award lightbox ────────────────────────────────────────────────────
    const awardLightbox = document.createElement('div');
    awardLightbox.id = 'award-lightbox';
    awardLightbox.innerHTML = `
        <div class="award-lb-inner">
            <button class="award-lb-close"><i class="fas fa-times"></i></button>
            <img class="award-lb-img" src="" alt="Award">
            <p class="award-lb-caption">Award · The Mental Health Index (MHI)</p>
        </div>`;
    document.body.appendChild(awardLightbox);
    awardLightbox.addEventListener('click', e => {
        if (e.target === awardLightbox || e.target.classList.contains('award-lb-close') || e.target.closest('.award-lb-close'))
            awardLightbox.classList.remove('active');
    });
    function showAwardLightbox(src) {
        awardLightbox.querySelector('.award-lb-img').src = src;
        awardLightbox.classList.add('active');
    }

    function buildPaperCard(paper) {
        const card = document.createElement('div');
        card.className = 'paper-card' + (paper.featured ? ' featured' : '');

        const featuredBadge = paper.featured
            ? '<span class="featured-badge">&#9733; Featured</span>'
            : '';

        const tagsHtml = paper.tags.map(t => `<span class="paper-tag">${t}</span>`).join('');

        const linkHtml = paper.link
            ? `<a href="${paper.link}" target="_blank" class="paper-link"><i class="fas fa-external-link-alt"></i> View Paper</a>`
            : '';

        const patentNoHtml = paper.patentNo
            ? `<div class="patent-no-row"><i class="fas fa-certificate"></i>&nbsp; App No: <strong>${paper.patentNo}</strong>&nbsp;·&nbsp;Filed via ${paper.filedThrough}</div>`
            : '';

        const reportImgHtml = paper.reportImg
            ? `<div class="patent-report-thumb">
                   <img src="${paper.reportImg}" alt="Patentability Report" class="confidential-report-img" title="Click to view (Confidential)">
                   <span class="confidential-label"><i class="fas fa-lock"></i> Patentability Report — Click to View</span>
               </div>`
            : '';

        const noteHtml = paper.note
            ? `<div class="patent-note"><i class="fas fa-info-circle"></i> ${paper.note}</div>`
            : '';

        const awardHtml = paper.award
            ? `<div class="paper-award-row">
                   <img src="${paper.award}" alt="Award" class="paper-award-thumb" title="Click to expand">
                   <span class="paper-award-label"><i class="fas fa-trophy"></i> Award</span>
               </div>`
            : '';

        card.innerHTML = `
            ${featuredBadge}
            <div class="paper-card-header">
                <span class="paper-num">[${paper.num}]</span>
                <h4 class="paper-title">${paper.title}</h4>
            </div>
            <div class="paper-meta">
                <span class="paper-journal"><i class="fas fa-book-open"></i> ${paper.journal}</span>
                <span class="status-badge ${paper.badge}">${paper.badgeText}</span>
            </div>
            ${patentNoHtml}
            ${noteHtml}
            ${awardHtml}
            ${reportImgHtml}
            <div class="paper-footer">
                <div class="paper-tags">${tagsHtml}</div>
                <div class="paper-actions">
                    ${linkHtml}
                    <button class="paper-expand-btn"><i class="fas fa-align-left"></i> Click here to read abstract</button>
                </div>
            </div>
        `;

        // Abstract button → modal card
        card.querySelector('.paper-expand-btn').addEventListener('click', () => showAbstractModal(paper));

        // Confidential report click
        const confImg = card.querySelector('.confidential-report-img');
        if (confImg) confImg.addEventListener('click', showConfidentialCaution);

        // Award click → lightbox
        const awardImg = card.querySelector('.paper-award-thumb');
        if (awardImg) awardImg.addEventListener('click', () => showAwardLightbox(paper.award));

        return card;
    }

    function animateCounters() {
        const statNums = document.querySelectorAll('.stat-number[data-target]');
        statNums.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 30));
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 40);
        });
    }

    // --- Card view state (shared across updateResearchContent calls) ---
    let cardViewState = { papers: [], current: 0, isCardMode: false };

    function buildSpotlightCard(paper, sectionLabel, animDir) {
        const card = document.createElement('div');
        card.className = `spotlight-card status-${paper.badge}`;
        if (animDir) card.classList.add(`anim-${animDir}`);

        const featuredBadge = paper.featured
            ? '<span class="featured-badge">&#9733; Featured</span>'
            : '';
        const tagsHtml = paper.tags.map(t => `<span class="paper-tag">${t}</span>`).join('');
        const linkHtml = paper.link
            ? `<a href="${paper.link}" target="_blank" class="paper-link"><i class="fas fa-external-link-alt"></i> View Paper</a>`
            : '';

        const patentNoHtml = paper.patentNo
            ? `<div class="patent-no-row"><i class="fas fa-certificate"></i>&nbsp; App No: <strong>${paper.patentNo}</strong>&nbsp;·&nbsp;Filed via ${paper.filedThrough}</div>`
            : '';

        const noteHtml = paper.note
            ? `<div class="patent-note"><i class="fas fa-info-circle"></i> ${paper.note}</div>`
            : '';

        const reportImgHtml = paper.reportImg
            ? `<div class="patent-report-thumb">
                   <img src="${paper.reportImg}" alt="Patentability Report" class="confidential-report-img" title="Click to view (Confidential)">
                   <span class="confidential-label"><i class="fas fa-lock"></i> Patentability Report — Click to View</span>
               </div>`
            : '';

        const awardHtml = paper.award
            ? `<div class="paper-award-row">
                   <img src="${paper.award}" alt="Award" class="paper-award-thumb" title="Click to expand">
                   <span class="paper-award-label"><i class="fas fa-trophy"></i> Award</span>
               </div>`
            : '';

        card.innerHTML = `
            <div class="spotlight-progress" style="width:0%"></div>
            ${featuredBadge}
            <div class="spotlight-section-label">${sectionLabel}</div>
            <h3 class="spotlight-card-title">${paper.title}</h3>
            <div class="spotlight-card-meta">
                <span class="spotlight-card-journal"><i class="fas fa-book-open"></i> ${paper.journal}</span>
                <span class="status-badge ${paper.badge}">${paper.badgeText}</span>
            </div>
            ${patentNoHtml}
            ${noteHtml}
            ${awardHtml}
            ${reportImgHtml}
            <div class="spotlight-card-footer">
                <div class="spotlight-card-tags">${tagsHtml}</div>
                <div class="spotlight-card-actions">
                    ${linkHtml}
                    <button class="paper-expand-btn"><i class="fas fa-align-left"></i> Click here to read abstract</button>
                </div>
            </div>
        `;

        // Abstract button → modal card
        card.querySelector('.paper-expand-btn').addEventListener('click', () => showAbstractModal(paper));

        // Confidential report click
        const confImg = card.querySelector('.confidential-report-img');
        if (confImg) confImg.addEventListener('click', showConfidentialCaution);

        // Award click → lightbox
        const awardImg = card.querySelector('.paper-award-thumb');
        if (awardImg) awardImg.addEventListener('click', () => showAwardLightbox(paper.award));

        return card;
    }

    function renderSpotlightCard(cardView, index, animDir) {
        const papers = cardViewState.papers;
        const wrapper = cardView.querySelector('.card-spotlight-wrapper');
        wrapper.innerHTML = '';
        const p = papers[index];
        wrapper.appendChild(buildSpotlightCard(p, p._sectionLabel, animDir));

        // progress bar
        const prog = wrapper.querySelector('.spotlight-progress');
        setTimeout(() => {
            prog.style.width = ((index + 1) / papers.length * 100) + '%';
        }, 30);

        // dots + counter
        cardView.querySelectorAll('.card-dot-item').forEach((d, i) => d.classList.toggle('active', i === index));
        const counter = cardView.querySelector('.card-counter');
        if (counter) counter.textContent = `${index + 1} / ${papers.length}`;

        // nav buttons
        const prevBtn = cardView.querySelector('.card-nav-prev');
        const nextBtn = cardView.querySelector('.card-nav-next');
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === papers.length - 1;
    }

    function updateResearchContent(contentKey) {
        const content = researchData[contentKey];
        researchTitle.textContent = content.title;
        researchDescription.textContent = content.description;

        researchStream.innerHTML = '';
        researchStream.style.opacity = 0;

        // --- Stats bar ---
        if (content.stats && content.stats.length) {
            const statsBar = document.createElement('div');
            statsBar.className = 'research-stats-bar';
            content.stats.forEach(s => {
                const item = document.createElement('div');
                item.className = 'stat-item';
                item.innerHTML = `
                    <div class="stat-number" data-target="${s.value}">0</div>
                    <div class="stat-label">${s.label}</div>
                `;
                statsBar.appendChild(item);
            });
            researchStream.appendChild(statsBar);
        }

        // --- View toggle bar ---
        const toggleBar = document.createElement('div');
        toggleBar.className = 'view-toggle-bar';
        toggleBar.innerHTML = `
            <button class="view-btn" data-view="list">
                <i class="fas fa-list-ul"></i> List
            </button>
            <button class="view-btn active" data-view="cards">
                <i class="fas fa-layer-group"></i> Cards
            </button>
        `;
        researchStream.appendChild(toggleBar);

        // --- List view (hidden by default — cards are primary) ---
        const listView = document.createElement('div');
        listView.className = 'stream-list-view hidden';
        content.sections.forEach(section => {
            const header = document.createElement('div');
            header.className = 'stream-category-header';
            header.textContent = section.label;
            listView.appendChild(header);
            section.papers.forEach(paper => listView.appendChild(buildPaperCard(paper)));
        });
        researchStream.appendChild(listView);

        // --- Card spotlight view ---
        // Flatten papers for card navigation
        const flatPapers = [];
        content.sections.forEach(section => {
            section.papers.forEach(paper => {
                flatPapers.push({ ...paper, _sectionLabel: section.label });
            });
        });
        cardViewState.papers = flatPapers;
        cardViewState.current = 0;
        cardViewState.isCardMode = true; // cards are default

        const cardView = document.createElement('div');
        cardView.className = 'research-card-view visible'; // visible by default

        // Spotlight wrapper
        const spotlightWrapper = document.createElement('div');
        spotlightWrapper.className = 'card-spotlight-wrapper';
        cardView.appendChild(spotlightWrapper);

        // Navigation row
        const navRow = document.createElement('div');
        navRow.className = 'card-nav-row';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'card-nav-btn card-nav-prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = true;

        const dotsEl = document.createElement('div');
        dotsEl.className = 'card-dots';
        flatPapers.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'card-dot-item' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                const dir = i > cardViewState.current ? 'right' : 'left';
                cardViewState.current = i;
                renderSpotlightCard(cardView, i, dir);
            });
            dotsEl.appendChild(dot);
        });

        const counterEl = document.createElement('span');
        counterEl.className = 'card-counter';
        counterEl.textContent = `1 / ${flatPapers.length}`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'card-nav-btn card-nav-next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

        prevBtn.addEventListener('click', () => {
            if (cardViewState.current > 0) {
                cardViewState.current--;
                renderSpotlightCard(cardView, cardViewState.current, 'left');
            }
        });
        nextBtn.addEventListener('click', () => {
            if (cardViewState.current < flatPapers.length - 1) {
                cardViewState.current++;
                renderSpotlightCard(cardView, cardViewState.current, 'right');
            }
        });

        navRow.append(prevBtn, dotsEl, counterEl, nextBtn);
        cardView.appendChild(navRow);

        // Touch swipe on spotlight wrapper
        let swipeStartX = 0;
        spotlightWrapper.addEventListener('touchstart', e => {
            swipeStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        spotlightWrapper.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - swipeStartX;
            if (Math.abs(dx) > 45) {
                if (dx < 0 && cardViewState.current < flatPapers.length - 1) {
                    cardViewState.current++;
                    renderSpotlightCard(cardView, cardViewState.current, 'right');
                } else if (dx > 0 && cardViewState.current > 0) {
                    cardViewState.current--;
                    renderSpotlightCard(cardView, cardViewState.current, 'left');
                }
            }
        }, { passive: true });

        researchStream.appendChild(cardView);

        // --- View toggle wiring ---
        toggleBar.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleBar.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (btn.dataset.view === 'cards') {
                    listView.classList.add('hidden');
                    cardView.classList.add('visible');
                    cardViewState.isCardMode = true;
                    cardViewState.current = 0;
                    renderSpotlightCard(cardView, 0, null);
                } else {
                    listView.classList.remove('hidden');
                    cardView.classList.remove('visible');
                    cardViewState.isCardMode = false;
                }
            });
        });

        // Fade in + render first card + counters
        setTimeout(() => {
            researchStream.style.transition = 'opacity 0.5s ease';
            researchStream.style.opacity = 1;
            animateCounters();
            // Render first spotlight card on load
            renderSpotlightCard(cardView, 0, null);
        }, 60);
    }

    // Global keyboard nav for card view (arrow keys)
    document.addEventListener('keydown', (e) => {
        if (!cardViewState.isCardMode) return;
        if (e.key === 'ArrowRight' && cardViewState.current < cardViewState.papers.length - 1) {
            cardViewState.current++;
            const cv = document.querySelector('.research-card-view.visible');
            if (cv) renderSpotlightCard(cv, cardViewState.current, 'right');
        } else if (e.key === 'ArrowLeft' && cardViewState.current > 0) {
            cardViewState.current--;
            const cv = document.querySelector('.research-card-view.visible');
            if (cv) renderSpotlightCard(cv, cardViewState.current, 'left');
        }
    });

    if (researchOptions.length > 0) {
        researchOptions.forEach(option => {
            option.addEventListener('click', () => {
                researchOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                updateResearchContent(option.dataset.content);
            });
        });

        const initialOption = document.querySelector('.research-options .option[data-content="research"]');
        if (initialOption) {
            initialOption.classList.add('active');
            updateResearchContent('research');
        }
    }


    // ══════════════════════════════════════════════════════════════════════
    // THEME / MODE SYSTEM
    // ══════════════════════════════════════════════════════════════════════
    const modeBadgeEl = document.createElement('div');
    modeBadgeEl.id = 'mode-badge';
    document.body.appendChild(modeBadgeEl);

    const modeToastEl = document.createElement('div');
    modeToastEl.id = 'mode-toast';
    document.body.appendChild(modeToastEl);

    // GIF layer (shown when a mode GIF is present)
    const modeGifLayer = document.createElement('div');
    modeGifLayer.id = 'mode-gif-layer';
    document.body.appendChild(modeGifLayer);

    let activeMode        = 'default';
    let toastTimer        = null;
    let terminalFirstOpen = true;
    let cpDOMActive       = false;

    // ── Saved original DOM values ─────────────────────────────────────────
    let orig = {};
    function saveDOMSnapshot() {
        if (orig.saved) return;
        orig.saved = true;
        const p1bg   = document.querySelector('#page1 .left-column .background');
        const p2pic  = document.querySelector('#page2 .profile-pic');
        const p1greet= document.querySelector('#page1 .greeting');
        const p2bio  = document.querySelector('#page2 .bio');
        const gSlide = slides[4];
        orig.p1bg    = p1bg  ? p1bg.style.backgroundImage : null;
        orig.p2pic   = p2pic ? p2pic.src : null;
        orig.p1greet = p1greet ? p1greet.innerHTML : null;
        orig.p2bio   = p2bio ? p2bio.innerHTML : null;
        if (gSlide) {
            const img = gSlide.querySelector('.slide-column:nth-child(1) img');
            orig.gamingSrc = img ? img.src : null;
        }
        const p5bg    = document.querySelector('#page5 .background');
        const p5outro = document.querySelector('#page5 .outro-text');
        orig.p5bg    = p5bg    ? p5bg.style.backgroundImage : null;
        orig.p5outro = p5outro ? p5outro.innerHTML : null;
    }

    // ── CP2077: apply / restore DOM swaps ─────────────────────────────────
    function applyCyberpunkDOM() {
        saveDOMSnapshot();
        if (cpDOMActive) return;
        cpDOMActive = true;

        // Page 1 — background → guitar.webp
        const p1bg = document.querySelector('#page1 .left-column .background');
        if (p1bg) p1bg.style.backgroundImage = "url('pics/theme1/guitar.webp')";

        // Page 2 — profile pic → samurai.gif
        const p2pic = document.querySelector('#page2 .profile-pic');
        if (p2pic) p2pic.src = 'pics/theme1/samurai.gif';

        // Page 1 — greeting text
        const p1greet = document.querySelector('#page1 .greeting');
        if (p1greet) p1greet.innerHTML =
            `<span id="greeting-text" class="cp-greeting-yo">Yo choom,</span><br>Anirud just<br><span class="cp-greeting-jacked">jacked in.</span>`;

        // Page 2 — cyberpunk bio
        const p2bio = document.querySelector('#page2 .bio');
        if (p2bio) p2bio.innerHTML = `
            <p class="cp-signal">Chipping in… signal locked.</p>
            <p>Driven by a need to understand what lies beneath the interface, I entered Computer Science and Engineering—not just to build systems, but to break, trace, and rebuild them from the inside out.</p>
            <p>My domains: <span class="cp-hl">Cybersecurity. Artificial Intelligence. Digital Forensics. System Design. Cryptography.</span> Fields where precision is survival, logic is weaponized, and creativity bends the rules.</p>
            <p>I don't just work on systems—I dissect them. I operate where complexity scales, where real-time decisions matter, and where automation begins to think. The problems most avoid? That's where I plug in.</p>
            <p>Research is exploration beyond mapped networks. I move into spaces where conventional approaches fail—and build what comes next.</p>
            <p>Communication protocols active: <span class="cp-cyan">English, Hindi, Bengali.</span> Collaboration across systems and cultures is standard.</p>
            <p>Core directives: <span class="cp-hl">Clarity. Discipline. Long-term execution.</span></p>
            <p class="cp-red">Beyond the code, there's signal— music, rhythm, strategy, motion. Guitar, drums, chess, fitness, animals, story-driven worlds— keeping the system grounded… human.</p>
            <p class="cp-signal"><em>"Digital Signature confirmed: Anirud."</em></p>`;

        // Hobbies — gaming slide → Johnny Silverhand
        if (slides[4]) {
            const img = slides[4].querySelector('.slide-column:nth-child(1) img');
            if (img) img.src = 'pics/theme1/Johnny-Silverhand-Cyberpunk-2077.jpg';
        }

        // Page 5 — last page override
        const p5bg = document.querySelector('#page5 .background');
        if (p5bg) p5bg.style.backgroundImage = "url('pics/theme1/johnny-silverhand-cyberpunk-2077.gif')";
        const p5outro = document.querySelector('#page5 .outro-text');
        if (p5outro) p5outro.innerHTML = `Signal doesn't lie.<br>Name's Anirud.`;

        showChippinIn(true);
    }

    function resetCyberpunkDOM() {
        if (!cpDOMActive) return;
        cpDOMActive = false;

        const p1bg = document.querySelector('#page1 .left-column .background');
        if (p1bg && orig.p1bg) p1bg.style.backgroundImage = orig.p1bg;

        const p2pic = document.querySelector('#page2 .profile-pic');
        if (p2pic && orig.p2pic) p2pic.src = orig.p2pic;

        const p1greet = document.querySelector('#page1 .greeting');
        if (p1greet && orig.p1greet) p1greet.innerHTML = orig.p1greet;

        const p2bio = document.querySelector('#page2 .bio');
        if (p2bio && orig.p2bio) p2bio.innerHTML = orig.p2bio;

        if (slides[4] && orig.gamingSrc) {
            const img = slides[4].querySelector('.slide-column:nth-child(1) img');
            if (img) img.src = orig.gamingSrc;
        }

        // Page 5 — restore last page
        const p5bg = document.querySelector('#page5 .background');
        if (p5bg && orig.p5bg) p5bg.style.backgroundImage = orig.p5bg;
        const p5outro = document.querySelector('#page5 .outro-text');
        if (p5outro && orig.p5outro) p5outro.innerHTML = orig.p5outro;

        showChippinIn(false);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MIDI SYNTH PLAYER  —  Chippin' In + I Really Want To Stay At Your House
    // ══════════════════════════════════════════════════════════════════════
    let cipPanel       = null;
    let cipMinipill    = null;
    let cipAudioCtx    = null;
    let cipPlaying     = false;
    let cipMidiCache   = [null, null];
    let cipActiveTrack = 0;
    let cipProgTimer   = null;
    let cipSchedTimer  = null;   // look-ahead scheduler interval
    let cipPlayStart   = 0;
    let cipAudioStart  = 0;      // ctx.currentTime when song note playback begins
    let cipSongDur     = 0;
    let cipScheduled   = [];
    let cipNotes       = [];     // current track's note list
    let cipNoteIdx     = 0;      // next note to schedule

    // ── MIDI base64 data (embedded to avoid fetch() restriction on file://) ──
    const IRL_B64 = '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KgAAkB4rAJAqK4FAgE4AAIBJAACAQgAAkEIrAJBJKwCQTiuBQIBOAACASQAAgEIAAIAqAACAHgAAkBkrAJAlK4FAkD0rAJBEKwCQSSuBQIBJAACARAAAgD0AAIAlAACAGQAAkEIrAJBJKwCQTisAkCUrgUCAJQAAkCwrAJAxK4FAgE4AAIBJAACAQgAAkEIrAJBJKwCQTiuBQIBOAACASQAAgEIAAIAxAACALAAAkEIrAJBJKwCQTisAkCUrgUCAJQAAgE4AAIBJAACAQgAAkEIrAJBJKwCQTisAkBkrAJAlK4FAgE4AAIBJAACAQgAAkEQrAJBJKwCQUCuBQIBQAACASQAAgEQAAIAlAACAGQAAkEQrAJBJKwCQUCsAkBsrAJAnK4FAgFAAAIBJAACARAAAkEYrAJBLKwCQUiuBQIBSAACASwAAgEYAAIAnAACAGwAAkEIrAJBJKwCQTisAkCcrgUCAJwAAkC4rAJAzK4FAgE4AAIBJAACAQgAAkEIrAJBJKwCQTiuBQIBOAACASQAAgEIAAIAzAACALgAAkEIrAJBJKwCQTisAkCcrgUCAJwAAkBsrAJAnK4FAgE4AAIBJAACAQgAAkEIrAJBJKwCQTiuBQIBOAACASQAAgEIAAIAnAACAGwAAkCMrAJAjK4FAkD0rAJBEKwCQSSuBQIBJAACARAAAgD0AAIAjAACAIwAAkEIrAJBJKwCQTisAkCMrgUCAIwAAkCorAJAvK4FAgE4AAIBJAACAQgAAkEIrAJBJKwCQTiuBQIBOAACASQAAgEIAAIAvAACAKgAAkEIrAJBJKwCQTisAkCMrgUCAIwAAkCMrAJAjK4FAgE4AAIBJAACAQgAAkEIrAJBJKwCQTiuBQIBOAACASQAAgEIAAIAjAACAIwAAkB4rAJAqK4FAkD0rAJBEKwCQSSuBQIBJAACARAAAgD0AAIAqAACAHgAAkEIrAJBJKwCQTisAkCorgUCAKgAAkDErAJA2K4FAgE4AAIBJAACAQgAAkEIrAJBJKwCQTiuBQIBOAACASQAAgEIAAIA2AACAMQAAkEIrAJBJKwCQTisAkCorgUCAKgAAkB4rAJAqK4FAgE4AAIBJAACAQgAAkEIrAJBJKwCQTiuBQIBOAACASQAAgEIAAIAqAACAHgAAkBkrAJAlK4FAkD0rAJBEKwCQSSuBQIBJAACA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';
    function b64toAB(b64){const bin=atob(b64);const buf=new ArrayBuffer(bin.length);const arr=new Uint8Array(buf);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return buf;}

    const CIP_TRACKS = [
        { label:"I REALLY WANT TO STAY", sub:"ROSA WALTON // HALSEY", mode:'piano' }
    ];

    const BLACK_SEM  = new Set([1,3,6,8,10]);
    const PIANO_ROOT = 60; // C4 (one octave up)
    const PIANO_KEYS = 28; // 2+ octaves

    function getAudioCtx() {
        if (!cipAudioCtx) cipAudioCtx = new (window.AudioContext||window.webkitAudioContext)();
        if (cipAudioCtx.state==='suspended') cipAudioCtx.resume();
        return cipAudioCtx;
    }
    function midiFreq(n) { return 440*Math.pow(2,(n-69)/12); }

    function playPianoNote(freq, vel, time, dur) {
        const ctx=getAudioCtx(), t=ctx.currentTime+time;
        [1,2,3].forEach((h,i)=>{
            const g=[0.55,0.28,0.12][i]*vel/127*0.4;
            const o=ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(freq*h,t);
            const n=ctx.createGain();
            n.gain.setValueAtTime(g,t);
            n.gain.exponentialRampToValueAtTime(0.001,t+Math.min(dur+1.2,3.0));
            // soft reverb via short delay
            const del=ctx.createDelay(0.08); del.delayTime.value=0.025+i*0.01;
            const dg=ctx.createGain(); dg.gain.value=0.12;
            o.connect(n); n.connect(ctx.destination); n.connect(del); del.connect(dg); dg.connect(ctx.destination);
            o.start(t); o.stop(t+Math.min(dur+1.5,3.5));
            cipScheduled.push(o);
        });
    }

    function stopAllScheduled() {
        cipScheduled.forEach(o=>{try{o.stop();}catch(e){}});
        cipScheduled=[];
    }

    // ── MIDI parser ──────────────────────────────────────────────────────
    function loadMIDIFromB64(b64) {
        try { return parseMIDI(b64toAB(b64)); }
        catch(e) { console.warn('MIDI parse fail'); return null; }
    }

    function parseMIDI(buf) {
        const d=new DataView(buf); let p=0;
        const u32=()=>{const v=d.getUint32(p);p+=4;return v;};
        const u16=()=>{const v=d.getUint16(p);p+=2;return v;};
        const u8 =()=>d.getUint8(p++);
        const vl =()=>{let v=0,b;do{b=u8();v=(v<<7)|(b&0x7F);}while(b&0x80);return v;};

        if(u32()!==0x4D546864) return null;
        u32(); // hdr len
        const fmt=u16(), ntrk=u16(), div=u16();
        const tracks=[];
        for(let t=0;t<ntrk;t++){
            if(p>=buf.byteLength) break;
            if(u32()!==0x4D54726B){break;}
            const end=p+u32();
            const evs=[]; let tick=0,last=0;
            while(p<end){
                tick+=vl();
                let s=u8();
                if(!(s&0x80)){p--;s=last;}else{last=s;}
                const tp=s>>4,ch=s&0xF;
                if(tp===0x9||tp===0x8){
                    const note=u8(),vel=u8();
                    evs.push({tick,type:(tp===0x9&&vel>0)?'on':'off',note,vel,ch});
                } else if(tp===0xA||tp===0xB||tp===0xE){p+=2;}
                else if(tp===0xC||tp===0xD){p+=1;}
                else if(s===0xFF){
                    const mt=u8(),ml=vl();
                    if(mt===0x51&&ml===3){const tmp=(u8()<<16)|(u8()<<8)|u8();evs.push({tick,type:'tempo',mspb:tmp});}
                    else p+=ml;
                } else if(s===0xF0||s===0xF7){p+=vl();}
                else break;
            }
            p=end; tracks.push(evs);
        }
        return {div,tracks};
    }

    function midiToNotes(parsed) {
        if(!parsed) return [];
        const {div,tracks}=parsed;
        const all=tracks.flat().sort((a,b)=>a.tick-b.tick);
        let tempo=500000,curTick=0,curTime=0;
        const timed=[];
        for(const ev of all){
            curTime+=(ev.tick-curTick)/div*(tempo/1e6);
            curTick=ev.tick;
            timed.push({...ev,time:curTime});
            if(ev.type==='tempo') tempo=ev.mspb;
        }
        const notes=[],active={};
        for(const ev of timed){
            const k=`${ev.ch}-${ev.note}`;
            if(ev.type==='on'){active[k]=ev;}
            else if(ev.type==='off'&&active[k]){
                const on=active[k];
                notes.push({note:on.note,vel:on.vel,time:on.time,dur:ev.time-on.time,ch:on.ch});
                delete active[k];
            }
        }
        return notes.filter(n=>n.dur>0.02);
    }

    // ── Build UI ─────────────────────────────────────────────────────────
    function buildCipPanel() {
        if(cipPanel) return;
        cipPanel=document.createElement('div');
        cipPanel.id='chippin-in-player';

        const pianoHTML=Array.from({length:PIANO_KEYS},(_,i)=>{
            const note=PIANO_ROOT+i;
            const sem=note%12;
            return `<div class="pk-key ${BLACK_SEM.has(sem)?'pk-black':'pk-white'}" data-note="${note}"></div>`;
        }).join('');

        cipPanel.innerHTML=`
        <div class="cip-header">
            <div class="cip-title-block">
                <span class="cip-logo">⬡</span>
                <div>
                    <div class="cip-title" id="cip-ttl">${CIP_TRACKS[0].label}</div>
                    <div class="cip-sub"  id="cip-sub">${CIP_TRACKS[0].sub}</div>
                </div>
            </div>
            <button class="cip-min-btn" title="Minimize">—</button>
        </div>
        <div class="cip-tabs">
            <button class="cip-tab active" data-t="0">🎸 CHIPPIN' IN</button>
            <button class="cip-tab"        data-t="1">🎹 I WANT TO STAY</button>
        </div>
        <div class="cip-body" id="cip-guitar">
            <div class="cip-fretboard">${fretLines}
                ${STR_LABELS.map((l,i)=>`
                <div class="cip-str-row" title="key ${i+1}">
                    <span class="cip-slabel">${l}</span>
                    <div class="cip-str" data-s="${i}"><div class="cip-str-inner"></div></div>
                    <span class="cip-key-tag">${i+1}</span>
                </div>`).join('')}
            </div>
            <div class="cip-sub-hint">Click a string or press 1–6</div>
        </div>
        <div class="cip-body cip-body-hidden" id="cip-piano">
            <div class="cip-piano-wrap"><div class="cip-piano">${pianoHTML}</div></div>
            <div class="cip-sub-hint">Keys light up during MIDI playback</div>
        </div>
        <div class="cip-prog-wrap">
            <div class="cip-prog-track"><div class="cip-prog-fill" id="cip-prog"></div></div>
            <span class="cip-time-lbl" id="cip-timelbl">0:00</span>
        </div>
        <div class="cip-ctrl-row">
            <button class="cip-play-btn" id="cip-playbtn">▶ PLAY FROM MIDI</button>
            <button class="cip-stop-btn" id="cip-stopbtn" disabled>■</button>
        </div>`;

        document.body.appendChild(cipPanel);

        // Initial state: tab 0 = CHIPPIN' IN (guitar), MIDI controls hidden
        cipPanel.querySelector('.cip-ctrl-row').style.display = 'none';
        cipPanel.querySelector('#cip-ttl').textContent = "CHIPPIN' IN";
        cipPanel.querySelector('#cip-sub').textContent = 'SAMURAI // JOHNNY SILVERHAND';

        wireCipPanel();
    }

    function buildCipPill() {
        if(cipMinipill) return;
        cipMinipill=document.createElement('button');
        cipMinipill.id='cip-minipill';
        cipMinipill.innerHTML=`<span class="cip-logo">⬡</span>&nbsp;I WANT TO STAY`;
        cipMinipill.addEventListener('click',()=>{
            cipMinipill.classList.remove('pill-visible');
            setTimeout(()=>cipMinipill.style.display='none',300);
            cipPanel.style.display='flex';
            requestAnimationFrame(()=>requestAnimationFrame(()=>cipPanel.classList.add('cip-visible')));
        });
        document.body.appendChild(cipMinipill);
    }

    function wireCipPanel() {
        // Minimize
        cipPanel.querySelector('.cip-min-btn').addEventListener('click',()=>{
            cipPanel.classList.remove('cip-visible');
            setTimeout(()=>{
                cipPanel.style.display='none';
                buildCipPill();
                cipMinipill.style.display='flex';
                requestAnimationFrame(()=>cipMinipill.classList.add('pill-visible'));
            },380);
        });

        // ── Tab switching ──────────────────────────────────────────────────
        cipPanel.querySelectorAll('.cip-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const t = parseInt(btn.dataset.t);
                if (t === cipActiveTrack) return;
                if (cipPlaying) stopCip();
                cipActiveTrack = t;
                cipPanel.querySelectorAll('.cip-tab').forEach(b => b.classList.toggle('active', b === btn));

                const guitar  = cipPanel.querySelector('#cip-guitar');
                const piano   = cipPanel.querySelector('#cip-piano');
                const ctrlRow = cipPanel.querySelector('.cip-ctrl-row');
                const ttl     = cipPanel.querySelector('#cip-ttl');
                const sub     = cipPanel.querySelector('#cip-sub');

                if (t === 0) {
                    // CHIPPIN' IN — interactive guitar fretboard
                    guitar.classList.remove('cip-body-hidden');
                    piano.classList.add('cip-body-hidden');
                    ctrlRow.style.display = 'none';
                    ttl.textContent = "CHIPPIN' IN";
                    sub.textContent = 'SAMURAI // JOHNNY SILVERHAND';
                } else {
                    // I REALLY WANT TO STAY — piano MIDI
                    guitar.classList.add('cip-body-hidden');
                    piano.classList.remove('cip-body-hidden');
                    ctrlRow.style.display = '';
                    ttl.textContent = 'I REALLY WANT TO STAY';
                    sub.textContent = 'ROSA WALTON // HALSEY';
                }
                resetProgBar();
            });
        });

        // Play / Stop
        document.getElementById('cip-playbtn').addEventListener('click',()=>{ if(!cipPlaying) playCip(); });
        document.getElementById('cip-stopbtn').addEventListener('click',stopCip);
    }

    function hiKey(note,on){
        if(!cipPanel) return;
        const k=cipPanel.querySelector(`.pk-key[data-note="${note}"]`);
        if(k) k.classList.toggle('pk-active',on);
    }

    function resetProgBar(){
        const p=document.getElementById('cip-prog'),t=document.getElementById('cip-timelbl');
        if(p)p.style.width='0%'; if(t)t.textContent='0:00';
    }

    // ── Look-ahead scheduler: fires every 100 ms, queues only notes within 350 ms window ──
    function cipSchedulerTick() {
        if (!cipPlaying) return;
        const ctx = getAudioCtx();
        const AHEAD = 0.35; // seconds to schedule ahead
        while (cipNoteIdx < cipNotes.length) {
            const n = cipNotes[cipNoteIdx];
            const absT = cipAudioStart + n.time;          // absolute ctx time for this note
            if (absT > ctx.currentTime + AHEAD) break;    // too far ahead — wait
            const delta = Math.max(0, absT - ctx.currentTime); // relative offset from now
            const shiftedNote = n.note + 12;              // one octave up
            playPianoNote(midiFreq(shiftedNote), n.vel, delta, n.dur);
            const ms = delta * 1000;
            setTimeout(() => hiKey(shiftedNote, true),  ms);
            setTimeout(() => hiKey(shiftedNote, false), ms + Math.min(n.dur, 1.5) * 1000 + 100);
            cipNoteIdx++;
        }
    }

    async function playCip(){
        if(!cipMidiCache[1]){
            const pb=document.getElementById('cip-playbtn');
            pb.textContent='⟳ LOADING...'; pb.disabled=true;
            cipMidiCache[1]=loadMIDIFromB64(IRL_B64);
            if(!cipMidiCache[1]){pb.textContent='▶ PLAY FROM MIDI';pb.disabled=false;return;}
            pb.textContent='▶ PLAY FROM MIDI'; pb.disabled=false;
        }
        const notes=midiToNotes(cipMidiCache[1]);
        if(!notes.length){console.warn('[CIP] No notes parsed from MIDI');return;}
        console.log('[CIP] Notes parsed:',notes.length,'  first:',notes[0],'  last:',notes[notes.length-1]);

        // Ensure AudioContext is running before scheduling anything
        const ctx=getAudioCtx();
        if(ctx.state!=='running') await ctx.resume();

        cipNotes      = notes;
        cipNoteIdx    = 0;
        cipPlaying    = true;
        cipSongDur    = notes[notes.length-1].time + 2;
        cipAudioStart = ctx.currentTime + 0.1;  // 100 ms grace period before first note
        cipPlayStart  = cipAudioStart;

        const pb=document.getElementById('cip-playbtn'),sb=document.getElementById('cip-stopbtn');
        pb.textContent='♪ PLAYING...'; pb.disabled=true; sb.disabled=false;

        // Kick off look-ahead scheduler
        clearInterval(cipSchedTimer);
        cipSchedulerTick();                             // immediate first fill
        cipSchedTimer = setInterval(cipSchedulerTick, 100);

        clearInterval(cipProgTimer);
        cipProgTimer=setInterval(()=>{
            if(!cipPlaying){clearInterval(cipProgTimer);return;}
            const el=Math.max(0, getAudioCtx().currentTime - cipAudioStart);
            const pct=Math.min(el/cipSongDur*100,100);
            const pe=document.getElementById('cip-prog'),te=document.getElementById('cip-timelbl');
            if(pe)pe.style.width=pct+'%';
            if(te){const s=Math.floor(el);te.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
            if(el>=cipSongDur) stopCip();
        },200);
    }

    function stopCip(){
        cipPlaying=false;
        cipNotes=[];
        cipNoteIdx=0;
        stopAllScheduled();
        clearInterval(cipProgTimer);
        clearInterval(cipSchedTimer);
        if(cipPanel) cipPanel.querySelectorAll('.pk-active').forEach(k=>k.classList.remove('pk-active'));
        const pb=document.getElementById('cip-playbtn'),sb=document.getElementById('cip-stopbtn');
        if(pb){pb.textContent='▶ PLAY FROM MIDI';pb.disabled=false;}
        if(sb)sb.disabled=true;
        resetProgBar();
    }

    function cipKeyHandler(e){
        // reserved for future key bindings
    }

    function showChippinIn(visible){
        if(visible){
            buildCipPanel(); buildCipPill();
            cipPanel.style.display='flex';
            if(cipMinipill)cipMinipill.style.display='none';
            // double-rAF: lets browser paint display:flex before CSS transition fires
            requestAnimationFrame(()=>requestAnimationFrame(()=>cipPanel.classList.add('cip-visible')));
            document.addEventListener('keydown',cipKeyHandler);
        } else {
            if(cipPlaying) stopCip();
            if(cipPanel){cipPanel.classList.remove('cip-visible');setTimeout(()=>{if(cipPanel)cipPanel.style.display='none';},380);}
            if(cipMinipill){cipMinipill.classList.remove('pill-visible');setTimeout(()=>{if(cipMinipill)cipMinipill.style.display='none';},300);}
            document.removeEventListener('keydown',cipKeyHandler);
        }
    }

    // ── applyMode ─────────────────────────────────────────────────────────
    function applyMode(mode, announce = false) {
        document.body.classList.remove('mode-cp2077', 'mode-fallout');
        activeMode = mode;
        if (mode === 'cp2077') {
            document.body.classList.add('mode-cp2077');
            applyCyberpunkDOM();
        } else if (mode === 'fallout') {
            document.body.classList.add('mode-fallout');
            resetCyberpunkDOM();
        } else {
            activeMode = 'default';
            resetCyberpunkDOM();
        }
        updateModeBadge();
        if (announce) flashModeToast(mode);
    }

    function updateModeBadge() {
        if (activeMode === 'cp2077') {
            modeBadgeEl.innerHTML = `<span class="mb-dot"></span>&nbsp; CYBERPUNK 2077`;
            modeBadgeEl.className = 'mb-cp2077';
        } else if (activeMode === 'fallout') {
            modeBadgeEl.innerHTML = `<span class="mb-dot"></span>&nbsp; FALLOUT`;
            modeBadgeEl.className = 'mb-fallout';
        } else {
            modeBadgeEl.innerHTML = '';
            modeBadgeEl.className = '';
        }
    }

    function flashModeToast(mode) {
        if (toastTimer) clearTimeout(toastTimer);
        modeToastEl.className = '';
        void modeToastEl.offsetWidth; // reflow to restart transition
        if (mode === 'cp2077') {
            modeToastEl.textContent = '⬡  CYBERPUNK 2077 MODE ACTIVATED';
            modeToastEl.classList.add('toast-cp', 'toast-show');
        } else if (mode === 'fallout') {
            modeToastEl.textContent = '☢  FALLOUT MODE ACTIVATED';
            modeToastEl.classList.add('toast-fo', 'toast-show');
        } else {
            modeToastEl.textContent = '↺  DEFAULT THEME RESTORED';
            modeToastEl.classList.add('toast-rst', 'toast-show');
        }
        toastTimer = setTimeout(() => modeToastEl.classList.remove('toast-show'), 3200);
    }

    // Apply persisted mode on load
    applyMode(activeMode);

    // ══════════════════════════════════════════════════════════════════════

    // --- TERMINAL LOGIC ---
    const terminalToggle = document.getElementById('terminal-toggle');
    const terminalOverlay = document.getElementById('terminal-overlay');
    const closeTerminal = document.getElementById('close-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    const fileSystem = {
        'summary.txt':    'Full-stack developer, researcher, and AI enthusiast.',
        'contact.txt':    'Email: contact@anirud.dev\nLinkedIn: /in/anirudpaul\nGitHub: @anirudpaul',
        'projects.txt':   'Featured projects:\n1. Mental Health Index\n2. Disaster Management System\n3. Smart IoT Research',
        'whoisanirud.txt':"I've killed gods, vanished into crowds, and stared at extinction.\nThen I opened my laptop and fixed bugs.",
        'secrets.txt':    '>> CLASSIFIED  —  ACCESS LEVEL 3 REQUIRED\n>> ...\n>> Anomalous signals detected in the system.\n>> Two hidden environments found.\n>>\n>> HINT #1: "the year is 2077"\n>> HINT #2: "war never changes"\n>>\n>> COMMAND: theme [name]\n>> Try it. You won\'t regret it.'
    };

    function getPrompt() {
        if (activeMode === 'cp2077')
            return `<span class="prompt prompt-cp">[ARASAKA-NET] $</span>`;
        if (activeMode === 'fallout')
            return `<span class="prompt prompt-fo">C:\\VAULT\\USER&gt;</span>`;
        return `<span class="prompt">➜ ~</span>`;
    }

    function addTerminalLine(html, styles = '') {
        if (!terminalOutput) return;
        const el = document.createElement('div');
        el.classList.add('terminal-line');
        if (styles) el.style.cssText = styles;
        el.innerHTML = html;
        terminalOutput.appendChild(el);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function toggleTerminal() {
        if (!terminalOverlay) return;
        terminalOverlay.classList.toggle('hidden');
        if (!terminalOverlay.classList.contains('hidden')) {
            if (terminalInput) terminalInput.focus();
            // First-open welcome message
            if (terminalFirstOpen && terminalOutput && !terminalOutput.hasChildNodes()) {
                terminalFirstOpen = false;
                addTerminalLine(
                    `// Terminal initialized. Type <span style="color:var(--primary-neon)">help</span> to see commands.`,
                    'color:rgba(100,255,218,0.45); font-size:0.75rem;'
                );
                addTerminalLine(
                    `// <span style="color:rgba(255,255,255,0.22)">psst — run </span><span style="color:var(--primary-neon)">cat secrets.txt</span><span style="color:rgba(255,255,255,0.22)"> if you're curious...</span>`,
                    'font-size:0.7rem; margin-top:2px;'
                );
            }
        }
    }

    if (terminalToggle) terminalToggle.addEventListener('click', toggleTerminal);
    if (closeTerminal) closeTerminal.addEventListener('click', toggleTerminal);

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                const args = command.split(' ');

                const cmdLine = document.createElement('div');
                cmdLine.classList.add('terminal-line');
                cmdLine.innerHTML = `${getPrompt()} ${command}`;
                terminalOutput.appendChild(cmdLine);

                let response = '';
                let responseHTML = '';
                switch (args[0]) {
                    case 'help':
                        response = `Available commands:
  help          - show this help
  ls            - list files
  cat [file]    - view file content
  clear         - clear terminal
  whoami        - current user
  date          - current date & time
  playme        - open music player 🎵
  exit          - close terminal
  ──────────────────────────────
  // something else may exist...
  // try: cat secrets.txt`;
                        break;
                    case 'clear':
                        terminalOutput.innerHTML = '';
                        break;
                    case 'ls':
                        response = Object.keys(fileSystem).join('  ');
                        break;
                    case 'cat':
                        if (args[1] && fileSystem[args[1]]) {
                            response = fileSystem[args[1]];
                        } else if (args[1]) {
                            response = `cat: ${args[1]}: No such file or directory`;
                        } else {
                            response = 'Usage: cat [filename]';
                        }
                        break;
                    case 'whoami':
                        response = 'guest_user';
                        break;
                    case 'date':
                        response = new Date().toString();
                        break;
                    case 'exit':
                        toggleTerminal();
                        break;
                    case 'sudo':
                        response = 'User not in the sudoers file. This incident will be reported.';
                        break;
                    case 'playme':
                        if (window.openMusicPlayer) {
                            window.openMusicPlayer();
                            response = '🎵 Opening music player...';
                        } else {
                            response = 'Music player not available';
                        }
                        break;
                    case 'theme': {
                        const t = args[1] ? args[1].toLowerCase() : '';
                        if (t === 'cyberpunk2077' || t === 'cp2077' || t === 'cyberpunk') {
                            applyMode('cp2077', true);
                            responseHTML = `<pre style="color:#FCEE09;line-height:1.45;font-family:'Fira Code',monospace">
 ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 ██  <span style="color:#FF003C">CYBERPUNK</span> <span style="color:#00D4FF">2077</span>  MODE ACTIVE  ██
 ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
 <span style="color:#FF003C">Wake up, Samurai.</span>
 <span style="color:#00D4FF">We have a city to burn.</span>
 ──────────────────────────────────
 <span style="opacity:0.55">Chippin' In player loaded. Play it.</span></pre>`;
                        } else if (t === 'fallout' || t === 'fo' || t === 'vaulttec') {
                            applyMode('fallout', true);
                            responseHTML = `<pre style="color:#3DFF49;line-height:1.45;font-family:'Fira Code',monospace">
 ╔══════════════════════════════════╗
 ║   <span style="color:#FFA500">VAULT-TEC UNIFIED OS  v2.3.7</span>   ║
 ║   <span style="color:#3DFF49">☢  FALLOUT  MODE  ACTIVE  ☢</span>   ║
 ╠══════════════════════════════════╣
 ║  <span style="opacity:0.7">War.  War never changes.</span>        ║
 ╚══════════════════════════════════╝
 <span style="opacity:0.55">Welcome back, Vault Dweller.</span>
 <span style="opacity:0.55">The Wasteland awaits...</span></pre>`;
                        } else if (t === 'reset' || t === 'default' || t === 'off') {
                            applyMode('default', true);
                            responseHTML = `<pre style="color:#64ffda;line-height:1.45;font-family:'Fira Code',monospace">
 ↺  Default theme restored.
 <span style="opacity:0.5">All systems nominal.</span></pre>`;
                        } else {
                            response = `Usage: theme [cyberpunk2077 | fallout | reset]\nCurrent mode: ${activeMode}`;
                        }
                        break;
                    }
                    case '':
                        break;
                    default:
                        response = `zsh: command not found: ${command}`;
                }

                if ((response || responseHTML) && args[0] !== 'clear') {
                    const respLine = document.createElement('div');
                    respLine.classList.add('terminal-line');
                    if (responseHTML) {
                        respLine.innerHTML = responseHTML;
                    } else {
                        respLine.style.color = '#fff';
                        respLine.style.whiteSpace = 'pre-wrap';
                        respLine.textContent = response;
                    }
                    terminalOutput.appendChild(respLine);
                }

                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });
    }

    // ===== MUSIC PLAYER =====
    const musicPlayerOverlay = document.getElementById('music-player-overlay');
    const closePlayerBtn = document.getElementById('close-player');
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const timeCurrent = document.querySelector('.time-current');
    const timeTotal = document.querySelector('.time-total');
    const albumArt = document.querySelector('.album-art');

    // Open music player
    function openMusicPlayer() {
        if (musicPlayerOverlay) {
            musicPlayerOverlay.classList.remove('hidden');
            if (audioPlayer) {
                audioPlayer.volume = volumeSlider.value / 100;
                audioPlayer.play();
                updatePlayPauseIcon();
            }
        }
    }

    // Close music player
    if (closePlayerBtn) {
        closePlayerBtn.addEventListener('click', () => {
            musicPlayerOverlay.classList.add('hidden');
            if (audioPlayer) audioPlayer.pause();
        });
    }

    // Play/Pause toggle
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
            updatePlayPauseIcon();
        });
    }

    // Stop button
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            updatePlayPauseIcon();
        });
    }

    // Update play/pause icon
    function updatePlayPauseIcon() {
        const icon = playPauseBtn.querySelector('i');
        if (audioPlayer.paused) {
            icon.className = 'fas fa-play';
            if (albumArt) albumArt.classList.add('paused');
        } else {
            icon.className = 'fas fa-pause';
            if (albumArt) albumArt.classList.remove('paused');
        }
    }

    // Update progress bar
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', () => {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progress || 0;

            // Update time displays
            if (timeCurrent) timeCurrent.textContent = formatTime(audioPlayer.currentTime);
            if (timeTotal) timeTotal.textContent = formatTime(audioPlayer.duration);
        });

        // Seek functionality
        if (progressBar) {
            progressBar.addEventListener('input', () => {
                const seekTime = (progressBar.value / 100) * audioPlayer.duration;
                audioPlayer.currentTime = seekTime;
            });
        }

        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                audioPlayer.volume = volumeSlider.value / 100;
            });
        }
    }

    // Format time helper
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Make openMusicPlayer available globally for terminal commands
    window.openMusicPlayer = openMusicPlayer;


    // =====================================================
    // WOW FACTOR ENHANCEMENTS
    // =====================================================

    // --- Page Transition Flash ---
    const pageFlash = document.createElement('div');
    pageFlash.id = 'page-flash';
    document.body.appendChild(pageFlash);

    function triggerPageFlash() {
        pageFlash.style.transition = 'none';
        pageFlash.style.opacity = '0.08';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                pageFlash.style.transition = 'opacity 0.4s ease';
                pageFlash.style.opacity = '0';
            });
        });
    }

    // --- Floating Background Orbs ---
    ['bg-orb bg-orb-1', 'bg-orb bg-orb-2', 'bg-orb bg-orb-3'].forEach(cls => {
        const orb = document.createElement('div');
        orb.className = cls;
        document.body.appendChild(orb);
    });

    // --- Spinning Ring Around Profile Pic ---
    const profilePicEl = document.querySelector('.profile-pic');
    if (profilePicEl) {
        const wrapper = document.createElement('div');
        wrapper.className = 'profile-pic-wrapper';
        profilePicEl.parentNode.insertBefore(wrapper, profilePicEl);
        wrapper.appendChild(profilePicEl);
    }

    // --- Scroll Hint on Page 1 ---
    const page1El = document.getElementById('page1');
    if (page1El) {
        const hint = document.createElement('div');
        hint.className = 'scroll-hint';
        hint.innerHTML = '<span>scroll</span><div class="scroll-hint-line"></div>';
        page1El.appendChild(hint);
    }

    // --- Custom Neon Cursor ---
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        const cursorRing = document.createElement('div');
        cursorRing.className = 'cursor-ring';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);

        // Hide until first mousemove so native cursor stays visible until positioned
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';

        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;
        let ringX = cursorX;
        let ringY = cursorY;
        let cursorVisible = false;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top  = cursorY + 'px';
            if (!cursorVisible) {
                cursorVisible = true;
                cursorDot.style.opacity = '';
                cursorRing.style.opacity = '';
            }
        });

        (function animateCursor() {
            ringX += (cursorX - ringX) * 0.12;
            ringY += (cursorY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            requestAnimationFrame(animateCursor);
        })();

        // Hover effect via delegation
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .option, .detail-title, [data-page], .dot, .prev, .next, #terminal-toggle')) {
                cursorDot.classList.add('hovered');
                cursorRing.classList.add('hovered');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .option, .detail-title, [data-page], .dot, .prev, .next, #terminal-toggle')) {
                cursorDot.classList.remove('hovered');
                cursorRing.classList.remove('hovered');
            }
        });
    }

    // --- Mouse Parallax on Page 1 ---
    const page1Bg = document.querySelector('#page1 .left-column .background');
    const greetingEl = document.querySelector('.greeting');

    document.addEventListener('mousemove', (e) => {
        if (currentPage !== 0) return;
        const xShift = (e.clientX / window.innerWidth  - 0.5) * 22;
        const yShift = (e.clientY / window.innerHeight - 0.5) * 14;
        if (page1Bg) {
            page1Bg.style.transform = `translate(${xShift * 0.4}px, ${yShift * 0.4}px) scale(1.06)`;
        }
        if (greetingEl) {
            greetingEl.style.transform = `translate(${-xShift * 0.3}px, ${-yShift * 0.3}px)`;
        }
    });

});
