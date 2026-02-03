document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // MENU BURGER MOBILE
    // =========================
    const burger = document.querySelector('.burger');
    const nav = document.getElementById('menu');

    if (burger && nav) {
        burger.addEventListener('click', () => nav.classList.toggle('open'));

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', e => {
                nav.classList.remove('open');
                const target = document.querySelector(link.getAttribute('href'));
                if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // =========================
    // CARTES AVEC IMAGES, VIDÉOS, TILT ET DÉTAILS
    // =========================
    const hoverSound = new Audio('hover-sound.mp3');
    hoverSound.volume = 0.3;

    document.querySelectorAll('.card-box').forEach(card => {
        const img = card.querySelector('img');
        const video = card.querySelector('video');
        let isPressed = false;
        const maxTilt = 12;

        // Styles par défaut
        if(img) img.style.display = "block";
        if(video){
            video.style.position = "absolute";
            video.style.top = 0;
            video.style.left = 0;
            video.style.width = "100%";
            video.style.height = "100%";
            video.style.objectFit = "cover";
            video.style.pointerEvents = "none";
            video.style.opacity = 0;
            video.pause();
        }

        // Hover pour jouer la vidéo
        card.addEventListener("mouseenter", () => {
            if(video){
                video.style.opacity = 1;
                video.currentTime = 0;
                video.play();
            }
            hoverSound.currentTime = 0;
            hoverSound.play();
        });

        card.addEventListener("mouseleave", () => {
            if(video){
                video.pause();
                video.style.opacity = 0;
            }
        });

        // Détails clic
        card.addEventListener("click", () => card.classList.toggle("active"));

        // TILT 3D
        const updateTransform = (x=null, y=null) => {
            const rect = card.getBoundingClientRect();
            if(x===null) x=rect.width/2;
            if(y===null) y=rect.height/2;
            const centerX = rect.width/2;
            const centerY = rect.height/2;
            const rotateX = ((y-centerY)/centerY)*maxTilt;
            const rotateY = ((x-centerX)/centerX)*maxTilt;
            const translateY = isPressed ? -2 : -6;
            const scale = isPressed ? 0.95 : 1;
            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);
            card.style.transform = `
                translateY(${translateY}px)
                scale(${scale})
                rotateX(${-rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        };

        card.addEventListener("mousemove", e => {
            updateTransform(e.clientX - card.getBoundingClientRect().left,
                            e.clientY - card.getBoundingClientRect().top);
        });

        card.addEventListener("mousedown", e => { 
            isPressed = true; 
            updateTransform(e.clientX - card.getBoundingClientRect().left,
                            e.clientY - card.getBoundingClientRect().top); 
        });

        card.addEventListener("mouseup", e => { 
            isPressed = false; 
            updateTransform(e.clientX - card.getBoundingClientRect().left,
                            e.clientY - card.getBoundingClientRect().top); 
        });

        card.addEventListener("mouseleave", () => {
            isPressed = false;
            card.style.transform = "translateY(0) rotateX(0) rotateY(0) scale(1)";
            card.style.removeProperty("--x");
            card.style.removeProperty("--y");
        });
    });

    // =========================
    // ANIMATION AU SCROLL
    // =========================
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));

    // =========================
    // COMPTEUR DE VISITEURS
    // =========================
    const counterEl = document.getElementById("visitor-number");
    let count = localStorage.getItem("vgm_visits");
    if(count===null) count = Math.floor(900 + Math.random()*400);
    else count = parseInt(count,10);
    count += 1;
    localStorage.setItem("vgm_visits", count);
    if(counterEl) counterEl.textContent = count;

    // =========================
    // VIDEO HERO
    // =========================
    const heroVideo = document.getElementById("heroVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const volumeSlider = document.getElementById("volumeRange");

    if(heroVideo){
        const updateBtn = () => {
            if(!playPauseBtn) return;
            playPauseBtn.textContent = heroVideo.paused ? "▶️" : "⏸️";
        };
        updateBtn();
        heroVideo.addEventListener("play", updateBtn);
        heroVideo.addEventListener("pause", updateBtn);

        if(playPauseBtn){
            playPauseBtn.addEventListener("click", () => {
                if(heroVideo.paused) heroVideo.play();
                else heroVideo.pause();
            });
        }

        if(volumeSlider){
            heroVideo.volume = volumeSlider.value;
            volumeSlider.addEventListener("input", () => heroVideo.volume = volumeSlider.value);
        }

        const unlockSound = () => {
            heroVideo.muted = false;
            document.removeEventListener("click", unlockSound);
            document.removeEventListener("touchstart", unlockSound);
        };
        document.addEventListener("click", unlockSound);
        document.addEventListener("touchstart", unlockSound);
    }

    // =========================
    // BOUTONS CONTACT MOBILE
    // =========================
    const contactToggle = document.querySelector('.contact-toggle');
    const contactMaster = document.querySelector('.contact-master');
    if(contactToggle && contactMaster){
        contactToggle.addEventListener('click', e => {
            e.stopPropagation();
            contactMaster.classList.toggle('open');
        });
        document.addEventListener('click', e => {
            if(!contactMaster.contains(e.target)){
                contactMaster.classList.remove('open');
            }
        });
    }

    // =========================
    // FOOTER OBSERVER (masque boutons)
    // =========================
    const footer = document.querySelector("footer");
    if(footer){
        const observerFooter = new IntersectionObserver(([entry]) => {
            document.body.classList.toggle("footer-visible", entry.isIntersecting);
        }, { threshold: 0.15 });
        observerFooter.observe(footer);
    }

});
