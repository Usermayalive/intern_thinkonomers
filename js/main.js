<script>
        // ===== LOADING OVERLAY =====
        const loadingOverlay = document.querySelector('.loading-overlay');
        
        // Hide loading overlay when everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                gsap.to(loadingOverlay, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loadingOverlay.style.display = 'none';
                    }
                });
            }, 1000);
        });

        // ===== 3D PLATE SHOWCASE =====
        const plateShowcase = document.getElementById('plateShowcase');
        let scene, camera, renderer, plates = [], rings = [];

        function initPlateShowcase() {
            // Check if WebGL is supported
            if (!Detector.webgl) {
                plateShowcase.style.display = 'none';
                return;
            }

            // Scene setup
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ 
                alpha: true,
                antialias: true 
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
            plateShowcase.appendChild(renderer.domElement);

            // Create multiple rolling plates with enhanced details
            for (let i = 0; i < 12; i++) {
                // Create plate with more geometry detail
                const plateGeometry = new THREE.TorusGeometry(
                    0.4 + Math.random() * 0.6, // radius
                    0.06 + Math.random() * 0.08, // tube radius
                    32, // radial segments
                    100 // tubular segments
                );
                
                const plateMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xE31937,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.25,
                    wireframeLinewidth: 2
                });
                
                const plate = new THREE.Mesh(plateGeometry, plateMaterial);
                
                // Random position with more spread
                plate.position.x = (Math.random() - 0.5) * 15;
                plate.position.y = (Math.random() - 0.5) * 15;
                plate.position.z = (Math.random() - 0.5) * 10;
                
                // Random rotation
                plate.rotation.x = Math.random() * Math.PI;
                plate.rotation.y = Math.random() * Math.PI;
                
                scene.add(plate);
                plates.push(plate);

                // Create decorative rings around plates
                const ringGeometry = new THREE.TorusGeometry(
                    0.7 + Math.random() * 0.5,
                    0.02,
                    32,
                    100
                );
                
                const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0x000000,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.15
                });
                
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.copy(plate.position);
                scene.add(ring);
                rings.push(ring);
            }

            // Add some floating particles
            const particlesGeometry = new THREE.BufferGeometry();
            const particleCount = 200;
            
            const posArray = new Float32Array(particleCount * 3);
            for(let i = 0; i < particleCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 20;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.02,
                color: 0xE31937,
                transparent: true,
                opacity: 0.5
            });
            
            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);

            // Enhanced animation loop
            function animate() {
                requestAnimationFrame(animate);
                
                plates.forEach((plate, i) => {
                    // Smooth rotation
                    plate.rotation.x += 0.003;
                    plate.rotation.y += 0.005;
                    plate.rotation.z += 0.001;
                    
                    // Organic floating movement
                    plate.position.y += Math.sin(Date.now() * 0.001 + i * 10) * 0.002;
                    plate.position.x += Math.cos(Date.now() * 0.001 + i * 5) * 0.001;
                    
                    // Match ring positions with slight variation
                    rings[i].position.copy(plate.position);
                    rings[i].position.y += Math.sin(Date.now() * 0.001 + i * 7) * 0.1;
                    rings[i].rotation.x = plate.rotation.x * 0.8;
                    rings[i].rotation.y = plate.rotation.y * 0.8;
                });
                
                // Rotate particles for more dynamism
                particlesMesh.rotation.x += 0.0005;
                particlesMesh.rotation.y += 0.0005;
                
                renderer.render(scene, camera);
            }
            
            animate();
            
            // Enhanced window resize handler
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }

        // ===== CUSTOM CURSOR =====
        const cursor = document.querySelector('.custom-cursor');
        const cursorTrail = document.querySelector('.cursor-trail');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Smoother trail with easing
            gsap.to(cursorTrail, {
                left: e.clientX,
                top: e.clientY,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        // Enhanced cursor hover effects
        document.querySelectorAll('button, .service-card, .portfolio-item, .nav-item, a').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '50px';
                cursor.style.height = '50px';
                cursor.style.opacity = '0.7';
                
                // Pulse effect
                gsap.to(cursor, {
                    scale: 1.2,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.opacity = '1';
            });
        });

        // ===== TEXT ANIMATIONS =====
        // Animate the "rolling" text in hero
        const rollingText = document.querySelector('.rolling-text');
        const words = ['ROLL', 'INSPIRE', 'CAPTIVATE', 'INNOVATE'];
        let currentWord = 0;

        function rotateWord() {
            const newWord = words[(currentWord + 1) % words.length];
            const tempElement = document.createElement('span');
            tempElement.textContent = newWord;
            tempElement.style.position = 'absolute';
            tempElement.style.opacity = '0';
            rollingText.parentNode.appendChild(tempElement);
            
            gsap.to(rollingText, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                onComplete: () => {
                    rollingText.textContent = newWord;
                    tempElement.remove();
                    currentWord = (currentWord + 1) % words.length;
                    
                    gsap.fromTo(rollingText, 
                        { opacity: 0, y: -20 },
                        { opacity: 1, y: 0, duration: 0.3 }
                    );
                }
            });
        }

        // Start word rotation every 2 seconds
        setInterval(rotateWord, 2000);

        // ===== SCROLL ANIMATIONS =====
        // Initialize GSAP scroll animations
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Animate elements on scroll
        gsap.utils.toArray('.service-card, .portfolio-item, .footer-column').forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.1
            });
        });

        // Smooth scrolling for navigation
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        gsap.to(window, {
                            duration: 1,
                            scrollTo: targetElement,
                            ease: "power2.inOut"
                        });
                    }
                }
            });
        });

        // Header scroll effect
        const mainHeader = document.querySelector('.main-header');
        const cinematicNav = document.querySelector('.cinematic-nav');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                mainHeader.classList.add('scrolled');
                cinematicNav.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
                cinematicNav.classList.remove('scrolled');
            }
        });

        // Schbang-style name reveal animation
        gsap.to(".company-name", {
            scrollTrigger: {
                trigger: ".final-reveal",
                start: "top center",
                toggleActions: "play none none none",
                scrub: 1
            },
            opacity: 1,
            scale: 1,
            ease: "power3.out",
            duration: 1.5
        });

        // Hero animations on load
        gsap.from('.hero h2', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.3
        });
        
        gsap.from('.hero p', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.6
        });
        
        gsap.from('.cta-button', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.9
        });

        // Initialize everything
        window.addEventListener('load', () => {
            try {
                initPlateShowcase();
            } catch (error) {
                console.error("Error initializing 3D scene:", error);
                plateShowcase.style.display = 'none';
            }
        });

        // WebGL detection
        const Detector = {
            webgl: (function() {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(
                        window.WebGLRenderingContext && 
                        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
                    );
                } catch (e) {
                    return false;
                }
            })()
        };
    </script>