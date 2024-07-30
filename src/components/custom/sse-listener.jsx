import { useCallback, useEffect, useState } from 'react';

export default function UserCard() {
    // SSE connection reference
    const [sseConnection, setSSEConnection] = useState(null);

    const listenToSSEUpdates = useCallback(() => {
        console.log('listenToSSEUpdates func');
        const eventSource = new EventSource('/api/sse');
        eventSource.onopen = () => {
            console.log('SSE connection opened.');
            // Save the SSE connection reference in the state
        };
        eventSource.onmessage = (event) => {
            const data = event.data;
            console.log('Received SSE Update:', data);
            // Update your UI or do other processing with the received data
        };
        eventSource.onerror = (event) => {
            console.error('SSE Error:', event);
            // Handle the SSE error here
        };
        setSSEConnection(eventSource);
        return eventSource;
    }, []);
    useEffect(() => {
        listenToSSEUpdates();
        return () => {
            if (sseConnection) {
                sseConnection.close();
            }
        };
    }, [listenToSSEUpdates]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            console.dir(sseConnection);
            if (sseConnection) {
                console.info('Closing SSE connection before unloading the page.');
                sseConnection.close();
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [sseConnection]);

    return false;
}
