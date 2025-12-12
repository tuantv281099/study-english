import { useEffect, useRef } from 'react';

const YouGlishWidget = ({ word }) => {
    const widgetId = 'youglish-widget-container';
    const widgetRef = useRef(null);
    const isAPILoaded = useRef(false);

    useEffect(() => {
        // 1. Load the script if not present
        if (!window.YG) {
            const script = document.createElement('script');
            script.src = 'https://youglish.com/public/emb/widget.js';
            script.async = true;
            script.charset = 'utf-8';

            script.onload = () => {
                isAPILoaded.current = true;
                initializeWidget();
            };

            document.body.appendChild(script);
        } else {
            isAPILoaded.current = true;
            initializeWidget();
        }

        function initializeWidget() {
            if (window.YG && !widgetRef.current) {
                // Create the widget instance
                // Documentation implies: new YG.Widget('element_id', options)
                try {
                    widgetRef.current = new window.YG.Widget(widgetId, {
                        components: 72, // default components
                        autoStart: 0,
                        events: {
                            'onFetchDone': onFetchDone,
                            'onVideoChange': onVideoChange,
                            'onCaptionConsumed': onCaptionConsumed,
                        }
                    });

                    // Initial fetch if word is provided
                    if (word) {
                        widgetRef.current.fetch(word, 'english');
                    }
                } catch (e) {
                    console.error("Error initializing YouGlish widget:", e);
                }
            }
        }

        // Callbacks (placeholders to avoid errors)
        function onFetchDone(event) { }
        function onVideoChange(event) { }
        function onCaptionConsumed(event) { }

        // Cleanup not strictly necessary for single instance, 
        // but if we unmount we might want to let it be.
    }, []);

    // 2. React to word changes
    useEffect(() => {
        if (isAPILoaded.current && widgetRef.current && word) {
            widgetRef.current.fetch(word, 'english');
        } else if (isAPILoaded.current && !widgetRef.current && word) {
            // Retry init if script loaded but widget var lost (rare)
            // initializeWidget(); // Not safe to call directly without checking checks
        }
    }, [word]);

    return (
        <div className="youglish-wrapper" style={{ marginTop: '20px' }}>
            <h3>Pronunciation Practice</h3>
            {/* The widget will be rendered inside this div */}
            <div id={widgetId}></div>
        </div>
    );
};

export default YouGlishWidget;
