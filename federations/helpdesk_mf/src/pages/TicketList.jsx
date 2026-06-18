import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { getCurrentUser, getUserPermissions, verifyBackendPermission } from '../services/authService';
import { Eye, Edit2, Trash2, Plus, Search } from 'lucide-react';

export const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [canCreate, setCanCreate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canViewTicket, setCanViewTicket] = useState(false);

  const fetchTickets = () => {
    setLoading(true);
    api.getTickets({
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      assignedTo: assignedFilter || undefined
    })
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch tickets');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPermissions().then(canView => {
      if (canView) {
        fetchTickets();
      } else {
        setLoading(false);
        setError("You do not have permission to view tickets (Missing view_ticket permission).");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, priorityFilter, assignedFilter]);

  const loadPermissions = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return false;
      
      const permissions = await getUserPermissions(user.id);
      const helpdeskPerms = permissions.filter(p => p.moduleName.toLowerCase() === "helpdeskmodule" || p.moduleName === "*");
      const hasWildcard = helpdeskPerms.some(p => p.action === "*");
      
      setCanCreate(hasWildcard || helpdeskPerms.some(p => p.action.toLowerCase() === "create_ticket"));
      setCanEdit(hasWildcard || helpdeskPerms.some(p => p.action.toLowerCase() === "edit_ticket"));
      setCanDelete(hasWildcard || helpdeskPerms.some(p => p.action.toLowerCase() === "delete_ticket"));

      const canView = hasWildcard || helpdeskPerms.some(p => p.action.toLowerCase() === "view_ticket");
      setCanViewTicket(canView);
      return canView;
    } catch (error) {
      console.error("Failed to load permissions:", error);
      return false;
    }
  };

  const handleDelete = async (guid) => {
    if (window.confirm(`Are you sure you want to delete ticket #${guid}?`)) {
      try {
        const user = await getCurrentUser();
        if (!user) {
          alert("Authentication required.");
          return;
        }
        
        const hasPermission = await verifyBackendPermission(user.id, "HelpdeskModule", "delete_ticket");
        if (!hasPermission) {
          alert("Backend Verification Failed: You do not have permission to delete tickets.");
          return;
        }

        await api.deleteTicket(guid);
        setTickets(tickets.filter(t => t.guid !== guid));
      } catch (err) {
        alert(err.message || 'Failed to delete ticket.');
      }
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Support Tickets</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage, filter, and audit helpdesk requests.</p>
        </div>
        {canCreate && (
          <Link to="../create" className="btn btn-primary">
            <Plus size={18} /> Create Ticket
          </Link>
        )}
      </div>

      {/* Filters Area */}
      <div className="glass-card" style={{ marginBottom: '32px', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={14} /> Search Title / Description
            </label>
            <input
              type="text"
              placeholder="Search..."
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="form-label">Priority</label>
            <select
              className="form-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="form-label">Assigned User</label>
            <input
              type="text"
              placeholder="e.g. agent_smith"
              className="form-control"
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading tickets list...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
        ) : filteredTickets.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No tickets found matching filters.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--table-header-bg)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>ID</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Ticket Details</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Status</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Priority</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Assigned To</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Created By</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(t => (
                  <tr key={t.guid} style={{ borderBottom: '1px solid var(--border-light)', transition: 'var(--transition-fast)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--text-muted)' }}>#{t.guid}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{t.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Category: {t.category}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge badge-${t.priority.toLowerCase()}`} style={{ background: 'var(--badge-priority-bg)' }}>{t.priority}</span>
                    </td>
                    <td style={{ padding: '16px 24px', color: t.assignedTo ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {t.assignedTo || 'Unassigned'}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>{t.createdBy}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link to={`../ticket/${t.guid}`} className="btn btn-secondary" style={{ padding: '8px 12px' }} title="View details">
                          <Eye size={16} />
                        </Link>
                        
                        {canEdit && (
                          <Link to={`../update/${t.guid}`} className="btn btn-secondary" style={{ padding: '8px 12px', borderColor: 'var(--border-glow)' }} title="Edit ticket">
                            <Edit2 size={16} style={{ color: 'var(--primary)' }} />
                          </Link>
                        )}

                        {canDelete && (
                          <button onClick={() => handleDelete(t.guid)} className="btn btn-secondary" style={{ padding: '8px 12px' }} title="Delete ticket">
                            <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
