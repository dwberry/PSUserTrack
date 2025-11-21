(function () {
    const SCRIPT_ID = 'ps-user-tracker';
    // Get the script element to read configuration
    const script = document.getElementById(SCRIPT_ID);
    const host = script ? new URL(script.src).origin : '';
    const ENDPOINT = `${host}/api/track`;


    function track() {
        const script = document.getElementById(SCRIPT_ID);
        const userId = script ? script.getAttribute('data-user-id') : 'anonymous';

        const data = {
            userId: userId,
            path: window.location.pathname,
            query: window.location.search,
            timestamp: Date.now()
        };

        fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(err => console.error('Tracking error:', err));
    }

    // Track on load
    if (document.readyState === 'complete') {
        track();
    } else {
        window.addEventListener('load', track);
    }

    // Optional: Track on history change (for SPAs)
    const pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(history, arguments);
        track();
    };
})();
