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


    // Page 4: Carousel
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;

    function showSlide(slideIndex) {
        slides.forEach((slide, index) => {
            if (index === slideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        updateDots(slideIndex);
    }

    function updateDots(slideIndex) {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
            dotsContainer.appendChild(dot);
        });
    }

    if (dotsContainer && slides.length > 0) {
        createDots();
        showSlide(currentSlide);
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }

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

    // --- Page 3: REDESIGNED RESEARCH SECTION (Split View) ---
    const researchOptions = document.querySelectorAll('.research-options .option');
    const researchTitle = document.getElementById('research-title');
    const researchDescription = document.getElementById('research-description');
    const researchSubOptions = document.getElementById('research-sub-options');
    const researchDetails = document.getElementById('research-details');

    const researchData = {
        research: {
            title: 'Research and Publications',
            description: 'My work spans Cybersecurity, Artificial Intelligence, Digital Forensics, Cryptography, and Intelligent System Design. Below are my research contributions organized by stage.',
            subOptions: {
                accepted: 'Accepted',
                review: 'Under Review',
                preparation: 'In Preparation'
            },
            details: {
                accepted: {
                    title: '[1] The Mental Health Index (MHI): A Personalized Multi-Task Deep Learning Framework for Real-Time and Explainable Mental Well-Being Assessment',
                    description: 'Traditional approaches to mental health assessment rely on episodic self-reports and clinical interviews, which are inherently subjective and fail to capture the dynamic nature of psychological well-being. In this work, we propose the Mental Health Index (MHI), a personalized and explainable framework for real-time mental health monitoring. The system integrates multimodal physiological signals—Heart Rate Variability (HRV), Galvanic Skin Response (GSR), and Respiration Rate (RR)—with behavioral data such as sleep and physical activity. At its core, the MHI employs a multi-task Gated Recurrent Unit (GRU) network, pre-trained on synthetic data and fine-tuned on an individual’s 2–4-week calibration period. Personalization is achieved using Isolation Forest–based baseline calibration, ensuring robustness against anomalies. To enhance trust and interpretability, the framework generates a composite MHI score by combining the model’s predictions with transparent, rule-based sub-scores. Our evaluation on a 90-day synthetic dataset demonstrates that the proposed MHI-GRU achieves strong performance (RMSE = 14.49, MAE = 8.06; mood classification accuracy = 93.9%), while maintaining computational efficiency suitable for real-time deployment. Evaluation across five random seeds and k-fold cross-validation confirmed stable convergence (variance < ±1%) and reproducibility, demonstrating the robustness of the proposed MHI-GRU under diverse initialization conditions. The MHI framework represents a step towards continuous, individualized, and explainable mental health monitoring, with potential applications in personal wellness tracking and high-stress occupational settings.\n\nLink: <a href="https://ieeexplore.ieee.org/document/11269758" target="_blank">Click to view</a>'
                },
                review: `
                    <div class="detail-title" data-target="review-1">[1] A Resilient Edge–Fog Collaborative Framework for Explainable AI in IoT Systems: Disaster Detection and Beyond</div>
                    <div id="review-1" class="detail-description" style="display: none;">
                        <strong>Journal:</strong> Results in Engineering<br>
                        <strong></strong> The exponential growth of the Internet of Things (IoT) in safety-critical domains has intensified the need for frameworks that combine resilience, transparency, and trustworthy intelligence under uncertain conditions. This paper presents a resilient Edge–Fog collaborative framework that integrates confidence-aware explainable artificial intelligence (XAI) with deterministic rule-based failover to ensure uninterrupted IoT operation during network disruptions or uncertain inference states. At the Fog layer, a Random Forest classifier enhanced with probability calibration, input validation, and feature importance analysis provides interpretable and reliable predictions, while the Edge layer executes lightweight rule-based logic as a self-healing fallback to maintain autonomy during disconnections. A synthetic dataset of 120,000 samples, augmented with noise, drift, and class balancing, was used to model disaster scenarios including fire, flood, earthquake, gas leak, and power failure. Comparative evaluation demonstrated that while Fog-only systems achieved over 99% accuracy but failed under disconnection, and Edge-only systems sustained 100% continuity but only ~44% accuracy, the proposed hybrid approach achieved approximately 91% accuracy with seamless failover continuity. Validated through a real-world Arduino UNO R4 WIFI prototype integrated with heterogeneous sensors and a live web dashboard, the framework demonstrated enhanced resilience, interpretability, and robustness compared to AI-only or rule-only baselines. Although evaluated for disaster detection, the framework generalizes to multiple domains such as smart agriculture, industrial safety, and environmental monitoring, establishing a scalable foundation for next-generation confidence-aware and explainable IoT ecosystems.<br>
                        <strong>Link:</strong> [Link Placeholder]
                    </div>
                    <div class="detail-title" data-target="review-2">[2] Forensic-Aware AI-Driven IoT Intrusion Detection System with Merkle-Based Evidence Verification</div>
                    <div id="review-2" class="detail-description" style="display: none;">
                        <strong>Journal:</strong> (maybe) IEEE Access<br>
                        <strong></strong> The proliferation of Internet of Things (IoT) networks has heightened the need for intelligent and verifiable intrusion detection systems that can operate on constrained edge devices. This paper presents a Forensic-Aware AI-Driven Intrusion Detection System (FA-AIIDS) that integrates real-time anomaly detection with cryptographically verifiable forensic evidence management. The proposed system employs a lightweight Gated Recurrent Unit (GRU)–based deep learning model optimized for low-latency inference on embedded hardware, achieving 0.013 ms per-sample inference time on GPU. A secure evidence chain is implemented using SHA-256 hash linking, Merkle tree aggregation, and RSA-3072 digital signatures to ensure integrity and non-repudiation of event logs. Comparative benchmarking against traditional and deep learning baselines (MLP, CNN, Random Forest, and XGBoost) validates the model’s efficiency and accuracy. Additionally, a Flask-based forensic dashboard and cloud-synchronized evidence repository provide transparent auditability and secure remote verification. The proposed FA-AIIDS framework demonstrates a practical fusion of AI-driven intrusion detection and verifiable digital forensics for trustworthy IoT environments.<br>
                        <strong>Link:</strong> [Link Placeholder]
                    </div>
                    <div class="detail-title" data-target="review-3">[3] A Game-Theoretic Approach to Intrusion Detection using Multi-Agent Adversarial Reinforcement Learning</div>
                    <div id="review-3" class="detail-description" style="display: none;">
                        <strong>Journal:</strong> IEEE Access<br>
                        <strong></strong> Modern network intrusion detection systems (IDS) based on machine learning are vulnerable to adversarial attacks that can cause misclassifications. Static models, once trained, cannot adapt to these evolving threats. To address this, we present Cyber-MARL, a multi-agent reinforcement learning framework designed to train robust IDS policies through adversarial co-evolution. The system is modeled as a general-sum Stackelberg game between a team of three defender agents (Feature Selector, Classifier, Risk Assessor) and an adversarial Attacker agent. The defenders learn a cooperative policy to detect intrusions from the CICIDS2017 dataset, while the attacker learns to generate subtle mutations to evade detection. We detail the system architecture, the agent learning algorithms (Policy Gradient for defenders, DDPG for the attacker), and the curriculum-based training strategy designed to ensure stable convergence. This work provides a stable and theoretically sound platform for research into adaptive and robust cybersecurity defenses.<br>
                        <strong>Link:</strong> [Link Placeholder]
                    </div>
                    <div class="detail-title" data-target="review-4">[4] Logic-Adversarial Graph Heterogeneous Network (LAG-HN): Robust Zero-Day Threat Detection through Logic-Adversarial Neuro-Symbolic Alignment</div>
                    <div id="review-4" class="detail-description" style="display: none;">
                        <strong>Journal:</strong> Cyber Security and Digital Forensics<br>
                        <strong></strong> The detection of novel, zero-day cyber threats remains a critical challenge for existing intrusion detection systems, which often struggle to generalize beyond their training data. Conventional deep learning models act as black boxes, limiting their interpretability and adaptability, while purely symbolic systems are often too rigid to handle the complexity of real-world network traffic. To address these limitations, we introduce the Logic-Adversarial Graph Heterogeneous Network (LAG-HN), a novel neuro-symbolic architecture designed for robust, interpretable, and generalizable threat detection. Our approach establishes a bi-directional alignment between a graph neural network (GNN) and a symbolic logic engine. Unlike prior work that uses logic as a mere regularizer, we ground our symbolic predicates in the data itself, informed by expert knowledge from frameworks like MITRE ATT&CK. The model is optimized through a unique combination of a semantic consistency loss, which forces the neural and symbolic components to converge on a shared semantic space, and a logic-adversarial loss, which trains the GNN to produce abstract representations that are robust enough to fool a symbolic discriminator. This adversarial process enhances the model's ability to generalize to unseen attack patterns. By design, the LAG-HN architecture enables true zero-shot inference, allowing new threats to be defined via new logical rules without retraining the neural component. We validate our approach using the CIC-IDS2017 dataset for training, while evaluating out-of-distribution generalization and zero-shot performance on the UNSW-NB15 and ToN-IoT datasets, respectively, demonstrating a significant step towards building truly adaptive and reliable security systems.<br>
                        <strong>Link:</strong> [Link Placeholder]
                    </div>
                `,
                preparation: `
                    <div class="detail-title" data-target="prep-1">[1] High Non-Performing Assets (NPAs) in Indian Banks: A Quantitative Study</div>
                    <div id="prep-1" class="detail-description" style="display: none;">
                        Non-Performing Assets (NPAs) continue to pose a significant challenge to the stability and profitability of Indian banks. This paper quantitatively examines the determinants of NPAs by integrating financial and macroeconomic indicators over 2018–2025. Using data from the annual reports of major Indian banks, HDFC Bank, Punjab National Bank, and State Bank of India, alongside macroeconomic variables such as GDP growth, inflation, and repo rate, a composite Macro Risk Index (MRI) was developed. The study applies Ordinary Least Squares (OLS) regression to assess the impact of Return on Assets (ROA), Capital Adequacy Ratio (CAR), and MRI on Gross NPA (GNPA). Results indicate a significant negative relationship between ROA and GNPA (β = −1.82, p < 0.05), while MRI shows a strong positive association (β = +12.90, p < 0.01), confirming that macroeconomic stress amplifies asset deterioration. CAR was statistically insignificant. The model explains 53.6% of GNPA variation (R² = 0.536), suggesting moderate explanatory strength. The findings highlight that sustained profitability and macroeconomic stability are crucial to mitigating systemic credit risk in Indian banking.
                    </div>
                `
            }
        },
        patents: {
            title: 'Patents & Intellectual Property',
            description: 'Patent Under Preparation (Inventor Documentation Submitted)\nThe patent is currently undergoing novelty and patentability analysis with the agency. My complete technical documentation has been submitted and drafting is in progress.',
            subOptions: {
                evaluation: 'Filed - Patentability Examination in Progress',
                drafting: 'Patent Drafting in Progress',
                filing: 'Patent Filing (Upcoming)'
            },
            details: {
                evaluation: `
                    <div class="detail-title" data-target="patent-1">[1] Energy Theft Detection System Using Real-Time AI and Pole-to-Pole Analysis</div>
                    <div id="patent-1" class="detail-description" style="display: none;">
                        Low-cost IoT-based system for real-time detection and localization of electricity theft using differential current analysis across utility poles combined with vibration-based tamper detection and AI-driven confidence scoring. Focuses on robustness, explainability, and autonomous response in real-world deployments.<br><br>
                        <strong>Status:</strong> Filed, patentability examination in progress
                    </div>
                    <div class="detail-title" data-target="patent-2">[2] Forensic-Aware AI-Driven IoT Intrusion Detection System (FA-AIIDS) with Merkle-Based Evidence Verification</div>
                    <div id="patent-2" class="detail-description" style="display: none;">
                        Lightweight IoT intrusion detection framework combining GRU-based temporal anomaly detection with Merkle-tree cryptographic evidence chaining to ensure tamper-resilient forensic logging on edge devices. Enables legally defensible intrusion logging through hash chaining and digital signatures.<br><br>
                        <strong>Status:</strong> Filed, patentability examination in progress
                    </div>
                    <div class="detail-title" data-target="patent-3">[3] Smart Disaster Resilience and Management System with AI-Driven Analysis and Offline Failsafe Capabilities</div>
                    <div id="patent-3" class="detail-description" style="display: none;">
                        Multi-sensor Edge–Fog IoT system for proactive disaster detection that integrates AI-driven prediction with autonomous rule-based offline operation to ensure safety during power or network failures. Supports fail-safe decision-making under uncertain sensor and network conditions.<br><br>
                        <strong>Status:</strong> Filed, patentability examination in progress
                    </div>
                    <div class="detail-title" data-target="patent-4">[4] A Personalized AI-Powered Mental Health Monitoring Smartwatch Using Multimodal Physiological and Behavioral Data Fusion</div>
                    <div id="patent-4" class="detail-description" style="display: none;">
                        AI-enabled wearable system that fuses multimodal physiological and behavioral signals using a personalized multi-task deep learning framework to compute an explainable real-time Mental Health Index. Introduces anomaly-resistant personalization and interpretable composite scoring for continuous monitoring.<br><br>
                        <strong>Status:</strong> Filed, patentability examination in progress
                    </div>
                `,
                drafting: 'No Patent in process',
                filing: 'No Patent in process'
            }
        }
    };

    // --- Unified Research Stream Logic ---
    const researchStream = document.getElementById('research-stream');

    function updateResearchContent(contentKey) {
        const content = researchData[contentKey];
        researchTitle.textContent = content.title;
        researchDescription.textContent = content.description;

        researchStream.innerHTML = '';
        researchStream.style.opacity = 0;

        // Iterate through all sub-categories and append them to the stream
        for (const key in content.subOptions) {
            // Create a section header (e.g., "Accepted Papers")
            const sessionHeader = document.createElement('h3');
            sessionHeader.classList.add('stream-category-header');
            sessionHeader.textContent = content.subOptions[key];
            researchStream.appendChild(sessionHeader);

            // Append the HTML content (list of papers)
            const contentWrapper = document.createElement('div');
            contentWrapper.classList.add('stream-content-group');

            const detailContent = content.details[key];

            // Check if the content is an object (single item with title/description) or HTML string (list)
            if (typeof detailContent === 'object' && detailContent.title) {
                // Create a single card for object format
                contentWrapper.innerHTML = `
                    <div class="detail-title" data-target="${key}-detail">${detailContent.title}</div>
                    <div id="${key}-detail" class="detail-description" style="display: none;">${detailContent.description}</div>
                `;
            } else {
                // Insert HTML string directly for list format
                contentWrapper.innerHTML = detailContent;
            }

            researchStream.appendChild(contentWrapper);
        }

        // Re-attach Toggle Listeners for Accordion Behavior
        const detailTitles = researchStream.querySelectorAll('.detail-title');
        detailTitles.forEach(title => {
            title.addEventListener('click', () => {
                // Toggle active state for visual feedback
                title.classList.toggle('active');

                // Find the next sibling which is the description
                const description = title.nextElementSibling;
                if (description && description.classList.contains('detail-description')) {
                    if (description.style.display === 'block') {
                        description.style.display = 'none';
                    } else {
                        description.style.display = 'block';
                    }
                }
            });
        });

        // Fade in animation
        setTimeout(() => {
            researchStream.style.transition = 'opacity 0.5s ease';
            researchStream.style.opacity = 1;
        }, 50);
    }

    if (researchOptions.length > 0) {
        researchOptions.forEach(option => {
            option.addEventListener('click', () => {
                researchOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                const contentKey = option.dataset.content;
                updateResearchContent(contentKey);
            });
        });

        // Initialize with first option
        const initialOption = document.querySelector('.research-options .option[data-content="research"]');
        if (initialOption) {
            initialOption.classList.add('active');
            updateResearchContent('research');
        }
    }


    // --- TERMINAL LOGIC ---
    const terminalToggle = document.getElementById('terminal-toggle');
    const terminalOverlay = document.getElementById('terminal-overlay');
    const closeTerminal = document.getElementById('close-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    const fileSystem = {
        'summary.txt': 'Full-stack developer, researcher, and AI enthusiast.',
        'contact.txt': 'Email: contact@anirud.dev\nLinkedIn: /in/anirudpaul\nGitHub: @anirudpaul',
        'projects.txt': 'Featured projects:\n1. Mental Health Index\n2. Disaster Management System\n3. Smart IoT Research',
        'whoisanirud.txt': "I've killed gods, vanished into crowds, and stared at extinction.\nThen I opened my laptop and fixed bugs."
    };

    function toggleTerminal() {
        if (!terminalOverlay) return;
        terminalOverlay.classList.toggle('hidden');
        if (!terminalOverlay.classList.contains('hidden')) {
            if (terminalInput) terminalInput.focus();
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
                cmdLine.innerHTML = `<span class="prompt">➜ ~</span> ${command}`;
                terminalOutput.appendChild(cmdLine);

                let response = '';
                switch (command) {
                    case 'help':
                        response = `Available commands:
  help       - display this help message
  ls         - list files
  cat [file] - view file content
  clear      - clear terminal
  whoami     - display current user
  date       - show current date and time
  playme     - open music player 🎵
  exit       - close terminal`;
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
                    case '':
                        break;
                    default:
                        response = `zsh: command not found: ${command}`;
                }

                if (response && args[0] !== 'clear') {
                    const respLine = document.createElement('div');
                    respLine.classList.add('terminal-line');
                    respLine.style.color = '#fff';
                    respLine.style.whiteSpace = "pre-wrap";
                    respLine.textContent = response;
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

});
