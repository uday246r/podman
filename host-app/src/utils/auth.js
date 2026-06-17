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
