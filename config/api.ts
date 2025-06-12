import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.6:9090';

const fetchData = (endpoint: string) => {
    return tryRequest(endpoint, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
};

const postData = (endpoint: string, body: unknown) => {
    return tryRequest(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
};

const deleteData = (endpoint: string) => {
    return tryRequest(endpoint, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
};

const updateData = (endpoint: string, body: unknown) => {
    return tryRequest(endpoint, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
};



let refreshingPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
    if (refreshingPromise) return refreshingPromise; 

    refreshingPromise = (async () => {
        const refreshToken = await AsyncStorage.getItem('@refreshToken');
        if (!refreshToken) {
            refreshingPromise = null;
            return null;
        }
        try {
            const response = await fetch(`${BASE_URL}/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                refreshingPromise = null;
                throw new Error('Refresh token failed');
            }

            const data = await response.json();
            const newAccessToken = data.token;
            await AsyncStorage.setItem('@token', newAccessToken);
            refreshingPromise = null;
            return newAccessToken;
        } catch (err) {
            refreshingPromise = null;
            console.error('Error refreshing access token:', err);
            // Optionally: clear tokens and redirect to login here
            await AsyncStorage.removeItem('@token');
            await AsyncStorage.removeItem('@refreshToken');
            return null;
        }
    })();

    return refreshingPromise;
};

const tryRequest = async (endpoint: string, options: RequestInit): Promise<any> => {
    let jwtToken = await AsyncStorage.getItem('@token');
    options.headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${jwtToken}`,
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            const headers = options.headers as Record<string, string>;
            headers['Authorization'] = `Bearer ${newToken}`;
            options.headers = headers;

            response = await fetch(`${BASE_URL}${endpoint}`, options);
        } else {
            // Optionally: handle logout here
            throw new Error('Session expired. Please log in again.');
        }
    }

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export default {
    fetchData,
    postData,
    deleteData,
    updateData,
};