import React, { useEffect, useState } from "react";
import "./PermissionManagement.css";

function PermissionManagement() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    
    // Manage Features Modal State
    const [isManageFeaturesOpen, setIsManageFeaturesOpen] = useState(false);
    const [newAction, setNewAction] = useState("");
    
    // Add Module Modal State
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
    const [newModuleName, setNewModuleName] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const rolesRes = await fetch("http://localhost:5005/api/roles");
            const rolesData = await rolesRes.json();
            setRoles(rolesData);

            const permsRes = await fetch("http://localhost:5005/api/permissions");
            const permsData = await permsRes.json();
            setPermissions(permsData);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const handleModuleSelect = (moduleName) => {
        setSelectedModule(moduleName);
    };

    const handleAddModule = async (e) => {
        e.preventDefault();
        if (!newModuleName) return;
        
        try {
            // A module requires at least one feature/action to exist. Default to "View".
            const res = await fetch("http://localhost:5005/api/permissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ moduleName: newModuleName, action: "View" })
            });
            if (res.ok) {
                setNewModuleName("");
                setIsAddModuleOpen(false);
                fetchData();
                setSelectedModule(newModuleName);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePermissionToggle = async (roleId, permissionId, currentIsAssigned) => {
        const isAssigned = !currentIsAssigned;
        
        // Optimistic UI update
        setRoles(prevRoles => prevRoles.map(role => {
            if (role.id === roleId) {
                let newPerms = [...(role.rolePermissions || [])];
                if (isAssigned) {
                    newPerms.push({ permissionId });
                } else {
                    newPerms = newPerms.filter(rp => rp.permissionId !== permissionId);
                }
                return { ...role, rolePermissions: newPerms };
            }
            return role;
        }));

        try {
            await fetch("http://localhost:5005/api/permissions/Toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roleId, permissionId, isAssigned })
            });
        } catch (err) {
            console.error(err);
            // Revert on failure
            fetchData();
        }
    };

    // Derived data
    const moduleNames = Array.from(new Set(permissions.map(p => p.moduleName)));
    const selectedModulePermissions = permissions.filter(p => p.moduleName === selectedModule);
    const actions = Array.from(new Set(selectedModulePermissions.map(p => p.action)));

    const getPermissionForCell = (action) => {
        return selectedModulePermissions.find(p => p.action === action);
    };

    const isPermissionAssigned = (role, permId) => {
        if (!role || !role.rolePermissions) return false;
        return role.rolePermissions.some(rp => rp.permissionId === permId);
    };

    // Feature Management
    const handleAddFeature = async (e) => {
        e.preventDefault();
        if (!selectedModule || !newAction) return;

        try {
            const res = await fetch("http://localhost:5005/api/permissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ moduleName: selectedModule, action: newAction })
            });
            if (res.ok) {
                setNewAction("");
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteFeature = async (permId) => {
        if (!window.confirm("Delete this feature? It will be removed from all roles.")) return;
        try {
            const res = await fetch(`http://localhost:5005/api/permissions/${permId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="pm-container">
            {/* Sidebar */}
            <div className="pm-sidebar">
                <div className="pm-sidebar-header">
                    <h3>Modules</h3>
                    <button className="add-role-btn" onClick={() => setIsAddModuleOpen(true)}>+ Add Module</button>
                </div>
                <ul className="role-list">
                    {moduleNames.map(mod => (
                        <li 
                            key={mod} 
                            className={`role-item ${selectedModule === mod ? 'active' : ''}`}
                            onClick={() => handleModuleSelect(mod)}
                        >
                            <span>{mod}</span>
                        </li>
                    ))}
                    {moduleNames.length === 0 && (
                        <li style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                            No modules found.
                        </li>
                    )}
                </ul>
            </div>

            {/* Main Area */}
            <div className="pm-main">
                {!selectedModule ? (
                    <div className="pm-empty-state">
                        Select a module from the sidebar to manage its role permissions.
                    </div>
                ) : (
                    <>
                        <div className="pm-matrix-header">
                            <div>
                                <h2>{selectedModule} - Features & Permissions</h2>
                                <p>Instantly toggle permissions for specific roles on this module.</p>
                            </div>
                            <div className="matrix-actions">
                                <button className="manage-features-btn" onClick={() => setIsManageFeaturesOpen(true)}>
                                    Manage Features
                                </button>
                            </div>
                        </div>

                        <div className="pm-table-container">
                            <table className="pm-table">
                                <thead>
                                    <tr>
                                        <th>Role</th>
                                        {actions.map(action => (
                                            <th key={action}>{action}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.length === 0 && (
                                        <tr>
                                            <td colSpan={actions.length + 1} style={{ textAlign: 'center' }}>
                                                No roles defined in the system.
                                            </td>
                                        </tr>
                                    )}
                                    {roles.map(role => (
                                        <tr key={role.id}>
                                            <td>{role.name}</td>
                                            {actions.map(action => {
                                                const perm = getPermissionForCell(action);
                                                if (!perm) return <td key={action}>-</td>;
                                                const assigned = isPermissionAssigned(role, perm.id);
                                                return (
                                                    <td key={action}>
                                                        <label className="switch">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={assigned}
                                                                onChange={() => handlePermissionToggle(role.id, perm.id, assigned)}
                                                            />
                                                            <span className="slider"></span>
                                                        </label>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Manage Features Modal */}
            {isManageFeaturesOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Manage Features for {selectedModule}</h3>
                            <button className="close-btn" onClick={() => setIsManageFeaturesOpen(false)}>✕</button>
                        </div>
                        
                        <form onSubmit={handleAddFeature}>
                            <div className="form-group">
                                <label>New Action / Feature Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="e.g. Delete, Export, Approve" 
                                    value={newAction}
                                    onChange={e => setNewAction(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add Feature</button>
                        </form>

                        <div className="permission-list">
                            <h4 style={{ margin: '16px 0 8px 0', fontSize: '14px', color: '#64748b' }}>Existing Features</h4>
                            {selectedModulePermissions.length === 0 ? (
                                <p style={{ fontSize: '14px', color: '#94a3b8' }}>No features defined.</p>
                            ) : (
                                selectedModulePermissions.map(p => (
                                    <div key={p.id} className="permission-list-item">
                                        <span>{p.action}</span>
                                        <button className="btn-danger-sm" onClick={() => handleDeleteFeature(p.id)}>Delete</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Module Modal */}
            {isAddModuleOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '400px' }}>
                        <div className="modal-header">
                            <h3>Add New Module</h3>
                            <button className="close-btn" onClick={() => setIsAddModuleOpen(false)}>✕</button>
                        </div>
                        
                        <form onSubmit={handleAddModule}>
                            <div className="form-group">
                                <label>Module Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="e.g. reporting_mf, custom_form" 
                                    value={newModuleName}
                                    onChange={e => setNewModuleName(e.target.value)}
                                    required
                                />
                                <small style={{ color: '#64748b', display: 'block', marginTop: '6px' }}>
                                    This will create the module with a default 'View' feature.
                                </small>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Module</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PermissionManagement;
