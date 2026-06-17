import React, { useEffect, useState } from "react";
import "./ModuleMaintenance.css";

const getUserIdFromToken = () => {
    // Dummy decoder for demo
    return 2;
};

function ModuleMaintenance() {
    const [statuses, setStatuses] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState("");
    const [maintenanceMessage, setMaintenanceMessage] = useState("Under maintenance");

    useEffect(() => {
        fetchData();
        fetchPermissions();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:5005/api/modulestatuses");
            const data = await res.json();
            setStatuses(data);
        } catch (err) {
            console.error("Error fetching statuses:", err);
        }
    };

    const fetchPermissions = async () => {
        try {
            const userId = getUserIdFromToken();
            const res = await fetch(`http://localhost:5005/api/access/userpermissions/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setPermissions(data);
            }
        } catch (err) {
            console.error("Failed to fetch permissions:", err);
        }
    };

    const canToggleModule = (targetModuleName) => {
        // A user can toggle a module if they have a permission under "ModuleMaintenance" 
        // with the action equal to the target module's name (e.g. "HelpdeskModule"), or "*"
        return permissions.some(p => {
            const matchesModule = p.moduleName.toLowerCase() === "modulemaintenance" || p.moduleName === "*";
            const matchesAction = p.action.toLowerCase() === targetModuleName.toLowerCase() || p.action === "*";
            return matchesModule && matchesAction;
        });
    };

    const handleToggleClick = (status) => {
        if (!canToggleModule(status.moduleName)) return;

        if (status.isEnabled) {
            // Turning OFF -> needs a message
            setSelectedModule(status.moduleName);
            setMaintenanceMessage(status.maintenanceMessage || "Under maintenance");
            setIsMessageModalOpen(true);
        } else {
            // Turning ON -> clear message
            updateStatus(status.moduleName, true, "");
        }
    };

    const handleConfirmMaintenance = (e) => {
        e.preventDefault();
        updateStatus(selectedModule, false, maintenanceMessage);
        setIsMessageModalOpen(false);
    };

    const updateStatus = async (moduleName, isEnabled, msg) => {
        try {
            // Optimistic update
            setStatuses(prev => prev.map(s => 
                s.moduleName === moduleName ? { ...s, isEnabled, maintenanceMessage: msg } : s
            ));

            await fetch(`http://localhost:5005/api/modulestatuses/${moduleName}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isEnabled, maintenanceMessage: msg })
            });
        } catch (err) {
            console.error(err);
            fetchData(); // Revert on failure
        }
    };

    return (
        <div className="mm-container">
            <div className="mm-header">
                <h2>Module Maintenance</h2>
                <p>Admin Interface to enable/disable modules across the system.</p>
            </div>
            
            <div className="mm-table-container">
                <table className="mm-table">
                    <thead>
                        <tr>
                            <th>Module Name</th>
                            <th>Status</th>
                            <th>Maintenance Message</th>
                            <th>Toggle Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>No modules discovered yet.</td>
                            </tr>
                        ) : statuses.map(status => {
                            const hasAccess = canToggleModule(status.moduleName);
                            return (
                                <tr key={status.id}>
                                    <td>{status.moduleName}</td>
                                    <td>
                                        <span className={`status-badge ${status.isEnabled ? 'active' : 'maintenance'}`}>
                                            {status.isEnabled ? "Active" : "Maintenance"}
                                        </span>
                                    </td>
                                    <td style={{ color: '#64748b', fontStyle: status.isEnabled ? 'italic' : 'normal' }}>
                                        {status.isEnabled ? "None" : status.maintenanceMessage}
                                    </td>
                                    <td>
                                        <label className={`switch ${!hasAccess ? 'disabled' : ''}`} title={!hasAccess ? "You do not have permission to toggle this module" : ""}>
                                            <input 
                                                type="checkbox" 
                                                checked={status.isEnabled}
                                                onChange={() => handleToggleClick(status)}
                                                disabled={!hasAccess}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Maintenance Message Modal */}
            {isMessageModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Disable {selectedModule}</h3>
                            <button className="close-btn" type="button" onClick={() => setIsMessageModalOpen(false)}>✕</button>
                        </div>
                        
                        <form onSubmit={handleConfirmMaintenance}>
                            <div className="form-group">
                                <label>Maintenance Message to display to users:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={maintenanceMessage}
                                    onChange={e => setMaintenanceMessage(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="btn-primary">Confirm Maintenance</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModuleMaintenance;
