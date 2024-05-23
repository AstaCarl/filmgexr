import React, { useState, useEffect } from 'react';

export default function Video({ mobileSrc, desktopSrc }) {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth >= 768 ? desktopSrc : mobileSrc);

  useEffect(() => {
    // Update video source based on window width
    const updateVideoSrc = () => {
      if (window.innerWidth >= 768) {
        // 768px is typically considered the start of medium screens
        setVideoSrc(desktopSrc);
      } else {
        setVideoSrc(mobileSrc);
      }
    };

    updateVideoSrc();

    window.addEventListener('resize', updateVideoSrc);

    return () => {
      window.removeEventListener('resize', updateVideoSrc);
    };
  }, [mobileSrc, desktopSrc]);

  return (
    <div>
      <video
        loop
        width="100%"
        height="100%"
        preload="auto"
        muted
        autoPlay
        playsInline
        name="Video Name"
        className="h-screen object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}
