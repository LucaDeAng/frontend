import React from 'react';

const VideoTutorial: React.FC = () => {
  return (
    <div className="mb-8 p-4 bg-black/40 border border-blue-400/30 rounded-xl">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Video Tutorial AI</h2>
      <div className="aspect-w-16 aspect-h-9 mb-2">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/2ePf9rue1Ao"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded"
        ></iframe>
      </div>
      <div className="text-gray-300 text-sm">Scopri le basi dell'intelligenza artificiale con questo video introduttivo.</div>
    </div>
  );
};

export default VideoTutorial; 