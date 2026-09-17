/**
 * Main Entry Point
 * Ciro Mendoza — Personal Website
 */

import { initNavigation } from './modules/navigation.js';
import { initAnimations } from './modules/animations.js';
import { initCarousel } from './modules/carousel.js';
import { initAccordions } from './modules/accordion.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    initAccordions();

    // Only init carousel if elements exist (index.html)
    if (document.querySelector('.commercial-track')) {
        initCarousel({
            trackSelector: '.commercial-track',
            slideSelector: '.commercial-slide',
            prevBtnId: 'prevBtn',
            nextBtnId: 'nextBtn',
            dotsContainerId: 'carouselDots'
        });
    }
});
