const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

// Retry configuration for handling Render cold starts
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

// Helper function to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make fetch with retry logic
async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = MAX_RETRIES
): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            // 30 second timeout for cold starts
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error: any) {
            lastError = error;

            // Check if it's a network error (typical for cold starts)
            const isNetworkError =
                error.name === 'TypeError' ||
                error.name === 'AbortError' ||
                error.message?.includes('Load failed') ||
                error.message?.includes('Failed to fetch') ||
                error.message?.includes('Network request failed');

            if (isNetworkError && attempt < retries) {
                // Wait with exponential backoff before retrying
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
                console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
                await sleep(delay);
                continue;
            }

            break;
        }
    }

    // If all retries failed, throw a user-friendly error
    throw new Error(
        'Unable to connect to the server. The server may be starting up - please wait a moment and try again.'
    );
}

export const api = {
    async post(endpoint: string, data: any) {
        const response = await fetchWithRetry(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            try {
                const error = await response.json();
                throw new Error(error.message || 'Something went wrong');
            } catch {
                throw new Error('Something went wrong');
            }
        }
        return response.json();
    },

    async get(endpoint: string) {
        const response = await fetchWithRetry(`${API_URL}${endpoint}`, {
            method: 'GET',
        });
        if (!response.ok) {
            try {
                const error = await response.json();
                throw new Error(error.message || 'Something went wrong');
            } catch {
                throw new Error('Something went wrong');
            }
        }
        return response.json();
    },

    async patch(endpoint: string, data: any) {
        const response = await fetchWithRetry(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            try {
                const error = await response.json();
                throw new Error(error.message || 'Something went wrong');
            } catch {
                throw new Error('Something went wrong');
            }
        }
        return response.json();
    },

    async upload(endpoint: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetchWithRetry(`${API_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            try {
                const error = await response.json();
                throw new Error(error.message || 'Something went wrong');
            } catch {
                throw new Error('Something went wrong');
            }
        }
        return response.json();
    }
};
