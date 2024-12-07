// Modal functionality
window.modalUtils = {}; // Create a namespace for modal utilities

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('joinMovementModal');
    const openButton = document.getElementById('joinMovementBtn');
    const closeButton = document.querySelector('.close');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const businessTypeSelect = document.getElementById('businessType');
    const otherBusinessType = document.getElementById('otherBusinessType');

    // Store original scroll position
    let scrollPosition = 0;

    // Open modal
    openButton.addEventListener('click', (e) => {
        e.preventDefault();
        scrollPosition = window.pageYOffset;
        modal.style.display = 'block';
        // Only prevent scrolling on the background when modal is open
        if (window.innerWidth > 768) { // Don't lock scroll on mobile
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
        }
    });

    // Close modal - expose this function globally
    window.modalUtils.closeModal = () => {
        modal.style.display = 'none';
        // Restore scrolling and position
        if (window.innerWidth > 768) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollPosition);
        }
    };

    closeButton.addEventListener('click', window.modalUtils.closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            window.modalUtils.closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            window.modalUtils.closeModal();
        }
    });

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Business type other field toggle
    if (businessTypeSelect) {
        businessTypeSelect.addEventListener('change', () => {
            otherBusinessType.style.display = 
                businessTypeSelect.value === 'others' ? 'block' : 'none';
        });
    }

    // Character counter for other business type
    const otherBusinessTypeText = document.querySelector('[name="otherBusinessTypeText"]');
    const charCount = document.querySelector('.char-count');
    
    if (otherBusinessTypeText && charCount) {
        otherBusinessTypeText.addEventListener('input', () => {
            const remaining = 200 - otherBusinessTypeText.value.length;
            charCount.textContent = `${otherBusinessTypeText.value.length}/200`;
            
            // Visual feedback
            if (remaining < 0) {
                charCount.style.color = '#ff0000';
            } else {
                charCount.style.color = '#666';
            }
        });
    }
}); 