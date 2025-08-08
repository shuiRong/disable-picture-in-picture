(function() {
  'use strict';

  function disablePictureInPicture(video) {
    if (video.disablePictureInPicture !== undefined) {
      video.disablePictureInPicture = true;
    }
    
    video.addEventListener('enterpictureinpicture', function(event) {
      event.preventDefault();
      if (document.pictureInPictureElement === video) {
        document.exitPictureInPicture().catch(console.error);
      }
    }, { capture: true });
    
    video.addEventListener('loadedmetadata', function() {
      if (video.disablePictureInPicture !== undefined) {
        video.disablePictureInPicture = true;
      }
    });
  }

  function processExistingVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(disablePictureInPicture);
  }

  function observeNewVideos() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'VIDEO') {
              disablePictureInPicture(node);
            }
            
            const videos = node.querySelectorAll && node.querySelectorAll('video');
            if (videos) {
              videos.forEach(disablePictureInPicture);
            }
          }
        });
      });
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      processExistingVideos();
      observeNewVideos();
    });
  } else {
    processExistingVideos();
    observeNewVideos();
  }
})();