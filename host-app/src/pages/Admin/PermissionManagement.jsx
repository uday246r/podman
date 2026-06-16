import React, { useEffect, useState } from "react";

function PermissionManagement() {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5005/api/roles")
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Permission Management</h2>
            <p>Admin Interface to configure Roles, Modules, and Actions.</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Role Name</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Description</th>
                        <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Permissions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ padding: '10px', textAlign: 'center' }}>No roles configured.</td>
                        </tr>
                    ) : roles.map(role => (
                        <tr key={role.id}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{role.name}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{role.description}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                {role.rolePermissions?.map(rp => (
                                    <span key={rp.permissionId} style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: '12px', marginRight: '5px', fontSize: '0.8em' }}>
                                        {rp.permission?.moduleName}: {rp.permission?.action}
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PermissionManagement;
