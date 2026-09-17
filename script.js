document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. MOBILE MENU TOGGLE & AUTO-CLOSE
     ========================================================= */
  const menuIcon = document.querySelector("#menu-icon");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (menuIcon && navLinks) {
    menuIcon.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuIcon.classList.toggle('fa-xmark');
    });

    // Close mobile menu when clicking a nav link
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuIcon.classList.remove('fa-xmark');
      });
    });
  }


  /* =========================================================
     2. INTERSECTION OBSERVER FOR NAVBAR ACTIVE LINKS
     ========================================================= */
  const sections = document.querySelectorAll('section');
  const navLinksItems = document.querySelectorAll('.nav-links a, footer ul a');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');

        navLinksItems.forEach((link) => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach((section) => navObserver.observe(section));


  /* =========================================================
     3. INTERSECTION OBSERVER FOR ON-SCROLL ANIMATIONS
     ========================================================= */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach((element) => revealObserver.observe(element));


  /* =========================================================
     4. SWIPER SHOWCASE INITIALIZATION
     ========================================================= */
  if (document.querySelector('.projects-swiper')) {
    new Swiper('.projects-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.projects-swiper .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.projects-swiper .swiper-button-next',
        prevEl: '.projects-swiper .swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }


  /* =========================================================
   4.1 DYNAMIC LIGHTBOX GALLERY MODAL LOGIC
   ========================================================= */
const projectCards = document.querySelectorAll('.project-card');
const lightboxModal = document.getElementById('project-lightbox');
const lightboxWrapper = document.getElementById('lightbox-wrapper');
const lightboxCloseBtn = document.getElementById('lightbox-close');
const lightboxOverlay = document.getElementById('lightbox-overlay');

let lightboxSwiper = null;

// Initialize Lightbox Swiper once
if (document.querySelector('.lightbox-swiper')) {
  lightboxSwiper = new Swiper('.lightbox-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: '.lightbox-swiper .swiper-button-next',
      prevEl: '.lightbox-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.lightbox-swiper .swiper-pagination',
      clickable: true,
    },
  });
}

// Function to open Lightbox with specific images
const openLightbox = (imageString) => {
  if (!lightboxModal || !lightboxWrapper) return;

  // 1. Convert comma-separated string from data-images into an array
  const imageSources = imageString.split(',').map((src) => src.trim());

  // 2. Clear existing slides in the lightbox
  lightboxWrapper.innerHTML = '';

  // 3. Inject new slides dynamically for the clicked project
  imageSources.forEach((src) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.innerHTML = `<img src="${src}" alt="Project Image View">`;
    lightboxWrapper.appendChild(slide);
  });

  // 4. Display modal and update Swiper calculations
  lightboxModal.classList.add('active');
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (lightboxSwiper) {
    lightboxSwiper.update();
    lightboxSwiper.slideTo(0, 0); // Start at first image
  }
};

// Function to close Lightbox
const closeLightbox = () => {
  if (lightboxModal) {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

// Event listeners for clicking project cards
projectCards.forEach((card) => {
  card.addEventListener('click', () => {
    const imagesData = card.getAttribute('data-images');
    if (imagesData) {
      openLightbox(imagesData);
    }
  });
});

// Close controls
if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
    closeLightbox();
  }
});


  /* =========================================================
     5. DOWNLOAD CV PRELOADER OVERLAY
     ========================================================= */
  const downloadBtn = document.getElementById('download-cv-btn');
  const cvPreloader = document.getElementById('cv-preloader');

  if (downloadBtn && cvPreloader) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();

      cvPreloader.classList.remove('preloader-hidden');
      cvPreloader.setAttribute('aria-hidden', 'false');

      const fileUrl = downloadBtn.getAttribute('data-file');

      setTimeout(() => {
        cvPreloader.classList.add('preloader-hidden');
        cvPreloader.setAttribute('aria-hidden', 'true');

        const tempLink = document.createElement('a');
        tempLink.href = fileUrl;
        tempLink.download = "erjas.pdf";
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      }, 2000);
    });
  }


  /* =========================================================
     7. SCROLL TO TOP BUTTON
     ========================================================= */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});


/* =========================================================
   6. PAGE INITIAL LOAD PRELOADER
   ========================================================= */
window.addEventListener('load', () => {
  const pagePreloader = document.getElementById('page-preloader');
  
  if (pagePreloader) {
    const preloaderDelay = 2500; 

    setTimeout(() => {
      pagePreloader.classList.add('preloader-hidden');

      setTimeout(() => {
        pagePreloader.style.display = 'none';
      }, 500);
    }, preloaderDelay);
  }
});