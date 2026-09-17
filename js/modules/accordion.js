/**
 * Accordion Module
 * Handles collapsible sections for discography
 */

export function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        const trigger = accordion.querySelector('.accordion-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const isOpen = accordion.getAttribute('aria-expanded') === 'true';

            // Close all other accordions
            accordions.forEach(other => {
                if (other !== accordion) {
                    other.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            accordion.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        });
    });
}

export default initAccordions;
