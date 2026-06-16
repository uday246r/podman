import React, { useEffect, useState } from "react";

function ModuleMaintenance() {
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5005/api/modulestatuses")
            .then(res => res.json())
            .then(data => setStatuses(data))
            .catch(err => console.error(err));
    }, []);

    const toggleStatus = async (moduleName, currentStatus, currentMsg) => {
        const newStatus = !currentStatus;
        const msg = newStatus ? "" : prompt("Enter maintenance message:", currentMsg) || "Under maintenance";

        await fetch(`http://localhost:5005/api/modulestatuses/${moduleName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isEnabled: newStatus, maintenanceMessage: msg })
        });
        
        // Refresh statuses
        const res = await fetch("http://localhost:5005/api/modulestatuses");
        setStatuses(await res.json());
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Module Maintenance</h2>
            <p>Admin Interface to enable/disable modules across the system.</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Module Name</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Status</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Message</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {statuses.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>No module statuses configured yet.</td>
                        </tr>
                    ) : statuses.map(status => (
                        <tr key={status.id}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{status.moduleName}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                <span style={{ color: status.isEnabled ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {status.isEnabled ? "Active" : "Maintenance"}
                                </span>
                            </td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{status.maintenanceMessage}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                <button onClick={() => toggleStatus(status.moduleName, status.isEnabled, status.maintenanceMessage)}>
                                    {status.isEnabled ? "Disable" : "Enable"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ModuleMaintenance;
