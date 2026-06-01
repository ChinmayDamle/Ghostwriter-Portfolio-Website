/**
 * CHINMAY. - PREMIUM PORTFOLIO INTERACTION ENGINE
 * -------------------------------------------------------------
 * Fully production-ready, custom interactive script.
 * Zero external frameworks, fully optimized, easy to edit.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. CONSTANTS & STICKY HEADER ACTIONS
  // ==========================================
  const navbar = document.querySelector('.navbar-container');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });

  // ==========================================
  // 2. ACTIVE NAVIGATION HIGHLIGHTS ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px', // Focuses active intersection triggers around center screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // ==========================================
  // 3. MOBILE HAMBURGER MENU DRAWER
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a');
  
  function toggleMobileMenu() {
    const isOpen = navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // ==========================================
  // 4. SMOOTH SCROLL FOR EMBEDDED BUTTONS
  // ==========================================
  const scrollButtons = document.querySelectorAll('[data-scroll-to]');
  
  scrollButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-scroll-to');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const navbarHeight = 85; 
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 5. PREMIUM MODAL SYSTEM
  // ==========================================
  const modals = document.querySelectorAll('.modal-overlay');
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalCloseButtons = document.querySelectorAll('.modal-close-btn');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      
      // Reset all expanded post-cards inside this modal
      const expandedCards = modal.querySelectorAll('.post-card.expanded');
      expandedCards.forEach(card => {
        card.classList.remove('expanded');
        const expandBtn = card.querySelector('.post-expand-btn');
        if (expandBtn) {
          expandBtn.innerHTML = `Read More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        }
      });
    }
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = trigger.getAttribute('data-open-modal');
      openModal(targetModalId);
    });
  });

  modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalElement = document.querySelector('.modal-overlay.open');
      if (openModalElement) {
        closeModal(openModalElement);
      }
    }
  });

  // ==========================================
  // 6. ACCORDION / EXPANDABLE POST ACTIONS
  // ==========================================
  const postCards = document.querySelectorAll('.post-card');

  postCards.forEach(card => {
    const expandBtn = card.querySelector('.post-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        const isExpanded = card.classList.toggle('expanded');
        
        if (isExpanded) {
          expandBtn.innerHTML = `Read Less <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
        } else {
          expandBtn.innerHTML = `Read More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        }
      });
    }
  });

  // ==========================================
  // 7. IMAGE CAROUSEL ENGINE
  // ==========================================
  function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const slides = carousel.querySelectorAll('.carousel-slide');
      const prevBtn = carousel.querySelector('.carousel-btn-prev');
      const nextBtn = carousel.querySelector('.carousel-btn-next');
      const dotsContainer = carousel.querySelector('.carousel-dots');
      
      if (!track || slides.length === 0) return;
      
      let currentIndex = 0;
      
      // Generate dot indicators
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
      
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      
      function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          goToSlide(currentIndex > 0 ? currentIndex - 1 : slides.length - 1);
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          goToSlide(currentIndex < slides.length - 1 ? currentIndex + 1 : 0);
        });
      }
      
      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentIndex < slides.length - 1) {
            goToSlide(currentIndex + 1);
          } else if (diff < 0 && currentIndex > 0) {
            goToSlide(currentIndex - 1);
          }
        }
      }, { passive: true });
    });
  }
  
  // Initialize carousels on page load
  initCarousels();

  // ==========================================
  // 8. SCROLL REVEAL OBSERVER (RUNS ONCE)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px', // Triggers when element is slightly inside viewport
    threshold: 0.05
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing immediately so animation runs exactly ONCE
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
});
