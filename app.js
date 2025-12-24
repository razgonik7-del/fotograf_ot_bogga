
















// ===== ШАПКА - ВАРИАНТ 1 =====

// Инициализация шапки
function initHeader() {
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id^="section"]');
    
    if (!header) return;
    
    // Создаем мобильную навигацию
    createMobileNav();
    
    // Обработчик для кнопки мобильного меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Плавная прокрутка к секциям
    setupSmoothScrolling();
    
    // Подсветка активного пункта меню при прокрутке
    window.addEventListener('scroll', () => {
        // Эффект тени при прокрутке
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Подсветка активной секции
        highlightActiveSection();
    });
    
    // Закрытие мобильного меню при клике вне его
    document.addEventListener('click', (e) => {
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav && mobileNav.classList.contains('active') && 
            !e.target.closest('.mobile-nav') && 
            !e.target.closest('.mobile-menu-toggle')) {
            closeMobileMenu();
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Инициализируем активную секцию
    highlightActiveSection();
}

// Создание мобильной навигации
function createMobileNav() {
    const nav = document.querySelector('.header-nav');
    if (!nav) return;
    
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    const navList = nav.querySelector('.nav-list').cloneNode(true);
    navList.className = 'mobile-nav-list';
    
    // Меняем классы ссылок для мобильной версии
    navList.querySelectorAll('.nav-link').forEach(link => {
        link.className = 'mobile-nav-link';
    });
    
    mobileNav.appendChild(navList);
    document.querySelector('.header').appendChild(mobileNav);
}

// Переключение мобильного меню
function toggleMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!toggleBtn || !mobileNav) return;
    
    const isActive = mobileNav.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!toggleBtn || !mobileNav) return;
    
    toggleBtn.classList.add('active');
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!toggleBtn || !mobileNav) return;
    
    toggleBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Плавная прокрутка
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Закрываем мобильное меню если открыто
                closeMobileMenu();
                
                // Плавная прокрутка с учетом высоты шапки
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, href);
            }
        });
    });
}

// Подсветка активной секции
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id^="section"]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSectionId = section.id;
        }
    });
    
    // Убираем активный класс у всех ссылок
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Добавляем активный класс к текущей ссылке
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Если мы в самом верху страницы, подсвечиваем первую секцию
    if (window.scrollY < 100 && navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    
    // Добавляем обработчик для смены URL при загрузке страницы с якорем
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Подсвечиваем активную ссылку
                highlightActiveSection();
            }
        }, 100);
    }
});

// Обработка изменения размера окна
window.addEventListener('resize', function() {
    // Закрываем мобильное меню при увеличении ширины окна
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Пересчитываем высоту шапки для прокрутки
    setTimeout(highlightActiveSection, 100);
});



const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const slides = Array.from(slider.querySelectorAll('.slide'));
const slideCount = slides.length;
let slideIndex = 0;
let autoSlideInterval; // Переменная для хранения интервала

// Создаем индикаторы
function createIndicators() {
    const indicatorsContainer = document.querySelector('.slider-indicators');
    
    for (let i = 0; i < slideCount; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'slider-indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            slideIndex = i;
            updateSlider();
            resetAutoSlide(); // Сбрасываем авто-пролистывание при клике на индикатор
        });
        indicatorsContainer.appendChild(indicator);
    }
}

// Обновляем индикаторы
function updateIndicators() {
    const indicators = document.querySelectorAll('.slider-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
}

// Функция для показа предыдущего слайда
function showPreviousSlide() {
    slideIndex = (slideIndex - 1 + slideCount) % slideCount;
    updateSlider();
    resetAutoSlide(); // Сбрасываем авто-пролистывание при ручном переключении
}

// Функция для показа следующего слайда
function showNextSlide() {
    slideIndex = (slideIndex + 1) % slideCount;
    updateSlider();
    resetAutoSlide(); // Сбрасываем авто-пролистывание при ручном переключении
}

// Функция для автоматического пролистывания
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        slideIndex = (slideIndex + 1) % slideCount;
        updateSlider();
    }, 5000); // 5000 миллисекунд = 5 секунд
}

// Функция для сброса авто-пролистывания
function resetAutoSlide() {
    clearInterval(autoSlideInterval); // Очищаем текущий интервал
    startAutoSlide(); // Запускаем новый интервал
}

// Функция для остановки авто-пролистывания (при наведении на слайдер)
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Функция для обновления отображения слайдера
function updateSlider() {
    const transformValue = -slideIndex * 100; // 100% на слайд
    slider.style.transform = `translateX(${transformValue}%)`;
    updateIndicators();
}

// Функция для открытия изображения на полный экран
function openFullscreenImage(element) {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    const fullscreenImage = document.getElementById('fullscreen-image');
    
    fullscreenImage.src = element.src;
    fullscreenContainer.style.display = 'flex';
}

function closeFullscreenImage() {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    fullscreenContainer.style.display = 'none';
}

// Инициализация слайдера при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    createIndicators();
    updateSlider();
    
    // Обработчики событий для кнопок
    prevButton.addEventListener('click', showPreviousSlide);
    nextButton.addEventListener('click', showNextSlide);
    
    // Запускаем автоматическое пролистывание
    startAutoSlide();
    
    // Останавливаем авто-пролистывание при наведении на слайдер
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Останавливаем авто-пролистывание при наведении на кнопки
    prevButton.addEventListener('mouseenter', stopAutoSlide);
    nextButton.addEventListener('mouseenter', stopAutoSlide);
    prevButton.addEventListener('mouseleave', startAutoSlide);
    nextButton.addEventListener('mouseleave', startAutoSlide);
});












































































// Когда пользователь прокручивает страницу вниз 20px от верха, показать кнопку
window.onscroll = function() {
  scrollFunction();
};


function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById('scrollToTopButton').style.display = 'block';
  } else {
      document.getElementById('scrollToTopButton').style.display = 'none';
  }
}


// Плавный скроллинг при клике на кнопку "Наверх"
document.getElementById('scrollToTopButton').addEventListener('click', function() {
  scrollToTop();
});


function scrollToTop() {
  const scrollStep = -window.scrollY / 15;
  const scrollInterval = setInterval(function() {
      if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
      } else {
          clearInterval(scrollInterval);
      }
  }, 15);
}




















































