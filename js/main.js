/**
 * Main Entry Point
 * Ciro Mendoza — Personal Website
 */

import { initNavigation } from './modules/navigation.js';
import { initAnimations } from './modules/animations.js';
import { initCarousel } from './modules/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();

    initCarousel({
        trackSelector: '.commercial-track',
        slideSelector: '.commercial-slide',
        prevBtnId: 'prevBtn',
        nextBtnId: 'nextBtn',
        dotsContainerId: 'carouselDots'
    });
});
