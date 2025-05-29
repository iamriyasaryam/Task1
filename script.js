document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.video-gallery-container');
    const gallery = document.querySelector('.video-gallery');
    const items = Array.from(gallery.querySelectorAll('.video-item'));
    let activeIndex = 0;
    let autoScrollInterval;
    const SCROLL_DELAY = 300000000; // Auto-scroll every 3 seconds
    let isMouseOverGallery = false;

    function setActiveItem(indexToActivate, isAutoScroll = false) {
        if (indexToActivate < 0 || indexToActivate >= items.length) {
            // If looping from end to start or vice-versa for auto-scroll
            if (isAutoScroll && indexToActivate >= items.length) indexToActivate = 0;
            else if (isAutoScroll && indexToActivate < 0) indexToActivate = items.length - 1;
            else {
                console.warn("Index out of bounds:", indexToActivate);
                return;
            }
        }

        items.forEach(item => item.classList.remove('active'));
        items[indexToActivate].classList.add('active');
        activeIndex = indexToActivate;

        items[indexToActivate].scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest' // 'nearest' is good to prevent unnecessary vertical scroll
        });

        updateIcons();

        // If user manually clicked, reset the auto-scroll timer
        if (!isAutoScroll) {
            stopAutoScroll();
            // Restart auto-scroll after a brief pause if mouse isn't over
            setTimeout(() => {
                if (!isMouseOverGallery) {
                    startAutoScroll();
                }
            }, SCROLL_DELAY * 1.5); // Give a bit more time after manual interaction
        }
    }

    function updateIcons() {
        items.forEach((item, index) => {
            const iconDiv = item.querySelector('.icon');
            if (!iconDiv) return;

            iconDiv.className = 'icon'; // Reset icon classes

            if (index === activeIndex) {
                iconDiv.classList.add('play');
            } else if (index < activeIndex) {
                iconDiv.classList.add('prev'); // Left arrow for items to the left
            } else { // index > activeIndex
                iconDiv.classList.add('next'); // Right arrow for items to the right
            }
        });
    }

    function nextItem() {
        let nextIndex = activeIndex + 1;
        // No need to explicitly check for items.length here,
        // setActiveItem will handle looping if indexToActivate >= items.length and isAutoScroll is true
        setActiveItem(nextIndex, true); // Pass true for isAutoScroll
    }

    function startAutoScroll() {
        if (items.length <= 1) return; // Don't auto-scroll if only one or no items
        stopAutoScroll(); // Clear any existing interval
        autoScrollInterval = setInterval(() => {
            if (!isMouseOverGallery) { // Only scroll if mouse is not over the gallery
                nextItem();
            }
        }, SCROLL_DELAY);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index === activeIndex) {
                // If clicking the already active item, simulate "playing" the video
                console.log(`Simulate playing video ID: ${item.dataset.videoId}`);
                // You might want to stop auto-scroll if you open a modal for video playback
                // stopAutoScroll(); 
            } else {
                setActiveItem(index, false); // Pass false for isAutoScroll as it's a manual click
            }
        });
    });

    // Pause auto-scroll on hover
    galleryContainer.addEventListener('mouseenter', () => {
        isMouseOverGallery = true;
        stopAutoScroll();
    });

    // Resume auto-scroll on mouse leave
    galleryContainer.addEventListener('mouseleave', () => {
        isMouseOverGallery = false;
        // Restart auto-scroll. If it was stopped by a click,
        // setActiveItem's timeout will handle restarting it.
        // This ensures it restarts if mouse simply leaves after a pause.
        startAutoScroll();
    });

    // Initial setup
    if (items.length > 0) {
        let initialActiveIndex = 0;
        // Try to make the second item active if available, like the example image
        if (items.length >= 3) {
            initialActiveIndex = 1;
        } else if (items.length > 0) {
            initialActiveIndex = 0;
        }
        
        setActiveItem(initialActiveIndex); // Set initial active item
        startAutoScroll(); // Start auto-scrolling
    }
});