import { getAuthToken } from './api';

const AUTH_API = import.meta.env.VITE_AUTH_API || '/api';
console.log(AUTH_API);

export const getCurrentUser = async () => {
    const token = await getAuthToken();
    if (!token) return null;
    
    try {
        const response = await fetch(`${AUTH_API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const getUserPermissions = async (userId) => {
    try {
        const response = await fetch(`${AUTH_API}/access/userpermissions/${userId}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const verifyBackendPermission = async (userId, moduleName, action) => {
    try {
        const response = await fetch(`${AUTH_API}/access/CheckPermission?userId=${userId}&moduleName=${moduleName}&action=${action}`);
        if (!response.ok) return false;
        const data = await response.json();
        return data.hasPermission;
    } catch (error) {
        console.error("Permission check failed:", error);
        return false;
    }
};
