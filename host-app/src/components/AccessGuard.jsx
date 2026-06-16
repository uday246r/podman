import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// A dummy decoder for demonstration (since actual JWT decoding needs a library like jwt-decode)
const getUserIdFromToken = () => {
    // In a real app, parse the JWT token from localStorage.
    // Here we'll just hardcode userId = 1 for the admin.
    return 2;
};

function AccessGuard({ moduleName, children }) {
    const [loading, setLoading] = useState(true);
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [maintenanceMsg, setMaintenanceMsg] = useState("");
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {

        const checkAccess = async () => {
            try {
                // 1. Check Module Status
                const statusRes = await fetch("http://localhost:5005/api/ModuleStatuses");
                if (statusRes.ok) {
                    const statuses = await statusRes.json();
                    const modStatus = statuses.find(m => m.moduleName.toLowerCase() === moduleName.toLowerCase());

                    if (modStatus && !modStatus.isEnabled) {
                        setIsMaintenance(true);
                        setMaintenanceMsg(modStatus.maintenanceMessage || "This module is currently under maintenance. Please try again later.");
                        setLoading(false);
                        return;
                    }
                }


                // 2. Check Permissions
                const userId = getUserIdFromToken();
                const permRes = await fetch(`http://localhost:5005/api/access/userpermissions/${userId}`);
                if (permRes.ok) {
                    const permissions = await permRes.json();
                    // Admin might have a specific moduleName = '*' or explicit permissions
                    const hasPerm = permissions.some(p => 
                        p.moduleName.toLowerCase() === moduleName.toLowerCase() || p.moduleName === "*"
                    );
                    setHasAccess(hasPerm);
                } else {
                    setHasAccess(false);
                }
            } catch (err) {
                console.error("Access Check Failed:", err);
                // On error, fail safe to deny access
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [moduleName]);

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading access rights...</div>;
    }

    if (isMaintenance) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                <h2>Module Under Maintenance</h2>
                <p>{maintenanceMsg}</p>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
                <h2>Access Denied</h2>
                <p>You do not have permission to access the <strong>{moduleName}</strong> module.</p>
            </div>
        );
    }

    return children;
}

export default AccessGuard;
