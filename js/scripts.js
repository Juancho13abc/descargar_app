// AOS Initialization with Mobile Optimization
AOS.init({
    duration: 600,
    offset: window.innerWidth < 768 ? 0 : 120, // Zero offset for mobile to prevent "empty space" feel
    easing: 'ease-out-quint',
    once: false,
    mirror: true,
    anchorPlacement: 'top-bottom',
    disable: false
});

// Hybrid Reveal Observer (Para asegurar animación al subir)
const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active'); // Opcional: permite que se re-anime al volver a entrar
        }
    });
}, revealOptions);

// Aplicar a secciones principales
document.querySelectorAll('section, .reveal-on-scroll').forEach(el => observer.observe(el));

// Botones Magnéticos
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px) scale(1)`;
    });
});

// Efecto Parallax y Barra de Progreso
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / scrollHeight) * 100;

    const scrollProgressBar = document.getElementById('scroll-progress');
    if (scrollProgressBar) {
        scrollProgressBar.style.width = progress + '%';
    }

    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.15;
        blob.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
    });

    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (scrolled > 50) {
            navbar.classList.add('py-2', 'shadow-2xl', 'bg-white/90', 'dark:bg-slate-900/90');
            navbar.classList.remove('py-4', 'bg-white/70', 'dark:bg-slate-900/70');
        } else {
            navbar.classList.remove('py-2', 'shadow-2xl', 'bg-white/90', 'dark:bg-slate-900/90');
            navbar.classList.add('py-4', 'bg-white/70', 'dark:bg-slate-900/70');
        }
    }
});

// Gestión Refactorizada del Tema (Modo Calor/Color)
const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];
const themeIcons = [document.getElementById('theme-icon'), document.getElementById('theme-icon-mobile')];
const htmlElement = document.documentElement;

function updateThemeUI(isDark) {
    themeIcons.forEach(icon => {
        if (icon) {
            if (isDark) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        }
    });
}

function toggleTheme() {
    const isDark = htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);

    // Efecto visual extra al cambiar
    document.body.style.pointerEvents = 'none';
    setTimeout(() => document.body.style.pointerEvents = 'auto', 400);
}

// Inicializar iconos al cargar
updateThemeUI(htmlElement.classList.contains('dark'));

themeToggles.forEach(btn => {
    if (btn) btn.addEventListener('click', toggleTheme);
});

// Menú móvil
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
    mobileMenu.querySelectorAll('a').forEach(link => { link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); }); });
}

// Navbar shadow scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 20) { navbar.classList.add('shadow-md'); } else { navbar.classList.remove('shadow-md'); }
    }
});

// Lógica del Modal de Descarga
const downloadBtns = document.querySelectorAll('.download-btn');
const modal = document.getElementById('download-modal');
const backdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const statusText = document.getElementById('status-text');
const closeModalBtn = document.getElementById('close-modal');
const spinner = document.getElementById('spinner');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');

let isDownloading = false;

downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isDownloading) return;

        const url = btn.getAttribute('href') || 'app-debug.apk';

        if (modal && backdrop && modalContent && progressBar && progressText && statusText && spinner && modalTitle && modalDescription && closeModalBtn) {
            modal.classList.remove('hidden');
            void modal.offsetWidth;

            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');

            closeModalBtn.classList.add('hidden');
            progressBar.style.width = '0%';
            progressText.innerText = '0%';
            statusText.innerText = 'Conectando Servidor...';
            spinner.classList.remove('hidden');
            modalTitle.innerText = 'Preparando GoFood';
            modalDescription.innerText = 'Descargando sistema base. Roles de Mesa, Cocina, Caja y Admin listos para usarse tras el inicio de sesión.';
            progressBar.className = 'h-full rounded-full w-0 transition-all duration-300 relative bg-gradient-to-r from-brand-600 to-accent-500';

            isDownloading = true;
            let progress = 0;

            const interval = setInterval(() => {
                progress += Math.random() * 12 + 3;
                if (progress > 100) progress = 100;

                progressBar.style.width = `${progress}%`;
                progressText.innerText = `${Math.floor(progress)}%`;

                if (progress > 15 && progress < 40) statusText.innerText = 'Empaquetando APK...';
                if (progress >= 40 && progress < 70) statusText.innerText = 'Enlazando Base de Datos...';
                if (progress >= 70 && progress < 95) statusText.innerText = 'Validando Seguridad...';
                if (progress >= 95 && progress < 100) statusText.innerText = 'Generando Enlace...';

                if (progress === 100) {
                    clearInterval(interval);
                    statusText.innerText = '¡Proceso Terminado!';
                    spinner.classList.add('hidden');
                    modalTitle.innerText = '¡Descarga Exitosa!';
                    progressBar.classList.remove('from-brand-600', 'to-accent-500');
                    progressBar.classList.add('bg-green-500');

                    setTimeout(() => {
                        isDownloading = false;
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'app-debug.apk';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        closeModalBtn.classList.remove('hidden');
                    }, 800);
                }
            }, 500);
        }
    });
});

const closeModal = () => {
    if (isDownloading) return;
    if (modalContent && backdrop && modal) {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
};

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (backdrop) backdrop.addEventListener('click', closeModal);

// Burger Rain Particle System con Emojis (100% confiable)
function createBurgerRain() {
    const emojis = ['🍔', '🍕', '🌭', '🥤', '🍺', '🍟'];
    const count = window.innerWidth < 768 ? 12 : 21;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.className = 'burger-particle';

        const startX = Math.random() * 100;        // posición horizontal %
        const duration = Math.random() * 8 + 10;     // 10–18 segundos (más lento = más premium)
        const delay = -(Math.random() * duration); // delay negativo = ya cayendo al cargar
        const size = Math.random() * 1.6 + 1.0;  // 1.0–2.6 rem

        particle.style.left = `${startX}vw`;
        particle.style.fontSize = `${size}rem`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        document.body.appendChild(particle);
    }
}

// Mouse Parallax para Blobs (Toque Premium)
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    document.querySelectorAll('.blob').forEach((blob, index) => {
        const depth = (index + 1) * 1.5;
        blob.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
    });
});

// Iniciar lluvia al cargar el DOM
document.addEventListener('DOMContentLoaded', createBurgerRain);
