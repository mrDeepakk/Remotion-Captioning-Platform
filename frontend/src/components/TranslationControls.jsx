import React, { useState, useEffect } from 'react';
import { translateCaptions, getLanguages } from '../api/captionsApi';
import Loader from './Loader';

/**
 * Translation Controls Component
 * Handles caption translation
 */
export default function TranslationControls({ captions, setCaptions }) {
  const [languages, setLanguages] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available languages
    getLanguages()
      .then((langs) => setLanguages(langs))
      .catch((err) => console.error('Failed to load languages:', err));
  }, []);

  const handleTranslate = async () => {
    if (!captions || captions.length === 0) {
      setError('No captions to translate');
      return;
    }

    setTranslating(true);
    setError('');

    try {
      const translated = await translateCaptions(captions, selectedLanguage);
      console.log('Translation complete');
      setCaptions(translated);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message || 'Failed to translate captions');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-primary">Translation</h2>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-300">
          Target Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="input"
          disabled={translating}
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        disabled={!captions || captions.length === 0 || translating}
        className={`w-full btn ${
          !captions || captions.length === 0 || translating
            ? 'btn-disabled'
            : 'btn-primary'
        }`}
      >
        {translating ? 'Translating...' : '🌐 Translate Captions'}
      </button>

      {/* Loading State */}
      {translating && (
        <div className="mt-4">
          <Loader message="Translating captions..." />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
