import React, { useState } from "react";
import { X, Check, ArrowLeft } from "lucide-react";

const languages = [
  { code: "zh-CN", name: "简体中文", englishName: "Simplified Chinese" },
  { code: "en", name: "English", englishName: "English" },
  { code: "es", name: "Español", englishName: "Spanish" },
  { code: "de", name: "Deutsch", englishName: "German" },
  { code: "it", name: "Italiano", englishName: "Italian" },
  { code: "pt", name: "Português", englishName: "Portuguese" },
  { code: "zh-TW", name: "繁體中文", englishName: "Traditional Chinese" },
  { code: "ko", name: "한국어", englishName: "Korean" },
  { code: "uk", name: "Українська Мова", englishName: "Ukrainian" },
  { code: "pl", name: "Polski", englishName: "Polish" },
  { code: "th", name: "แบบไทย", englishName: "Thai" },
  { code: "local", name: "Local", englishName: "Local" },
];

export function LanguageChangeModal({ isOpen, onClose, currentLanguage = "en", onLanguageChange }) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  if (!isOpen) return null;

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  const handleConfirm = () => {
    if (onLanguageChange) {
      onLanguageChange(selectedLanguage);
    }
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-white dark:bg-gray-900">
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary pt-8 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white text-lg font-medium">Language</h2>
          <button 
            onClick={handleConfirm}
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Confirm
          </button>
        </div>

        {/* Language List */}
        <div className="flex-1 overflow-y-auto">
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`px-4 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between ${
                selectedLanguage === language.code ? 'bg-gray-50 dark:bg-gray-800' : ''
              }`}
            >
              <div className="flex flex-col">
                <span className="text-gray-900 dark:text-white text-base font-medium">
                  {language.name}
                </span>
                {language.name !== language.englishName && (
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {language.englishName}
                  </span>
                )}
              </div>
              {selectedLanguage === language.code && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
