/**
 * Carousel Module
 * Touch-enabled carousel for commercial works
 */

export class Carousel {
    constructor(options = {}) {
        this.track = document.querySelector(options.trackSelector || '.commercial-track');
        this.slides = document.querySelectorAll(options.slideSelector || '.commercial-slide');
        this.prevBtn = document.getElementById(options.prevBtnId || 'prevBtn');
        this.nextBtn = document.getElementById(options.nextBtnId || 'nextBtn');
        this.dotsContainer = document.getElementById(options.dotsContainerId || 'carouselDots');

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.touchStartX = 0;
        this.touchEndX = 0;

        if (this.track && this.totalSlides > 0) {
            this.init();
        }
    }

    init() {
        this.createDots();
        this.bindEvents();
        this.update();
    }

    createDots() {
        if (!this.dotsContainer) return;

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        }

        this.dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    }

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        // Touch support
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Keyboard navigation when in viewport
        document.addEventListener('keydown', (e) => {
            if (!this.isInViewport()) return;
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    isInViewport() {
        const rect = this.track.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? this.next() : this.prev();
        }
    }

    goTo(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentIndex = index;
            this.update();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.update();
        }
    }

    next() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
            this.update();
        }
    }

    update() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        this.dots?.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });

        if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;
    }
}

export function initCarousel(options) {
    return new Carousel(options);
}

export default Carousel;
