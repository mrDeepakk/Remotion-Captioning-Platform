import React from 'react';

/**
 * Caption Style Selector Component
 * Allows selection of caption style presets
 */
export default function CaptionStyleSelector({ stylePreset, setStylePreset }) {
  const styles = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Bottom-centered, classic style',
      icon: '📝'
    },
    {
      id: 'topBar',
      name: 'Top Bar',
      description: 'Full-width news-style bar',
      icon: '📰'
    },
    {
      id: 'karaoke',
      name: 'Karaoke',
      description: 'Highlighted with glow effect',
      icon: '🎤'
    }
  ];

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-primary">Caption Style</h2>
      
      <div className="space-y-3">
        {styles.map((style) => (
          <div
            key={style.id}
            onClick={() => setStylePreset(style.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              stylePreset === style.id
                ? 'border-primary bg-primary bg-opacity-10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{style.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{style.name}</h3>
                <p className="text-sm text-gray-400">{style.description}</p>
              </div>
              {stylePreset === style.id && (
                <span className="text-primary text-xl">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
