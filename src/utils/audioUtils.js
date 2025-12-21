export const playPronunciation = (text) => {
    if (!text) return;

    // Use Web Speech API
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Set language to English
        window.speechSynthesis.cancel(); // Cancel any current speaking
        window.speechSynthesis.speak(utterance);
    } else {
        // Fallback or error handling
        console.warn("Text-to-speech not supported in this browser.");
    }
};
