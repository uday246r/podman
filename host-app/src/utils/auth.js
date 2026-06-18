import API_CONFIG from "../config/api";

export const setToken = (token) => {
    document.cookie = `token=${token}; path=/; max-age=86400`; // 1 day
};

export const getToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

export const removeToken = () => {
    document.cookie = 'token=; path=/; max-age=0';
};

export const getCurrentUser = async () => {
    const token = getToken();
    if (!token) return null;
    
    try {
        const response = await fetch(`${API_CONFIG.AUTH_API}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch current user", error);
        return null;
    }
};
