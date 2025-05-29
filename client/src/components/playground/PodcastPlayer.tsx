import React from 'react';

const PodcastPlayer: React.FC = () => {
  return (
    <div className="mb-8 p-4 bg-black/40 border border-pink-400/30 rounded-xl">
      <h2 className="text-xl font-bold text-pink-400 mb-4">Podcast AI</h2>
      <audio controls className="w-full">
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3" />
        Il tuo browser non supporta l'elemento audio.
      </audio>
      <div className="text-gray-300 text-sm mt-2">Ascolta le ultime novità sull'intelligenza artificiale!</div>
    </div>
  );
};

export default PodcastPlayer; 