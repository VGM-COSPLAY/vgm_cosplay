
// =========================
// MENU BURGER MOBILE
// =========================
const burger = document.querySelector('.burger'); // le bouton burger
const nav = document.querySelector('nav');         // ton menu nav

// Ouvre / ferme le menu au clic sur le burger
burger.addEventListener('click', () => {
    nav.classList.toggle('open'); // ajoute ou enlève la classe 'open'
});

// Ferme automatiquement le menu au clic sur un lien
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open'); // retire la classe 'open'
    });
});



/* =========================
   DÉTAILS CLIQUABLES SUR LES CARTES
========================= */
document.querySelectorAll('.card-box').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });
});

/* =========================
   ANIMATION AU SCROLL
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
});

/* =========================
   TILT 3D ET LUMIÈRE SUR LES CARTES
========================= */
document.querySelectorAll(".card-box").forEach(card => {
    const maxTilt = 12;
    let isPressed = false;

    const updateTransform = (x = null, y = null) => {
        const rect = card.getBoundingClientRect();
        if (x === null) x = rect.width / 2;
        if (y === null) y = rect.height / 2;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);

        const translateY = isPressed ? -2 : -6;
        const scale = isPressed ? 0.95 : 1;

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

/* =========================
   SON AU HOVER DES CARTES
========================= */
const hoverSound = new Audio('hover-sound.mp3');
hoverSound.volume = 0.3;

document.querySelectorAll('.card-box').forEach(card => {
    card.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play();
    });
});

/* =========================
   VIDÉO AU HOVER SUR LES CARTES
========================= */
document.querySelectorAll(".card-box").forEach(card => {
    const video = card.querySelector(".card-video");
    if (!video) return;

    // Empêche le pointer-events sur la vidéo pour que le clic passe toujours
    video.style.pointerEvents = "none";

    card.addEventListener("mouseenter", () => {
        video.style.display = "block";
        video.currentTime = 0;
        video.play();
    });

    card.addEventListener("mouseleave", () => {
        video.pause();
        video.style.display = "none";
    });
});

/* =========================
   COMPTEUR DE VISITEURS
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const counterEl = document.getElementById("visitor-number");
    let count = localStorage.getItem("vgm_visits");

    if (count === null) {
        count = Math.floor(900 + Math.random() * 400); // départ crédible
    } else {
        count = parseInt(count, 10);
    }

    count += 1;
    localStorage.setItem("vgm_visits", count);
    if(counterEl) counterEl.textContent = count;
});