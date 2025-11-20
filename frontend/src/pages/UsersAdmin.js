import React, { useState, useEffect, useCallback } from 'react';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (!token) {
      setError('You must be logged in as admin.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/admin/users', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error fetching users:', data);
        setError(data.error || 'Failed to load users. Server error.');
        setLoading(false);
        return;
      }

      setUsers(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load users. Server error.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const blockUser = async (id) => {
    if (!window.confirm('Are you sure you want to block this user?')) return;

    try {
      const res = await fetch(`http://localhost:5001/api/admin/users/block/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Block error:', data);
        setError(data.error || 'Failed to block user.');
        return;
      }

      setSuccessMsg(data.message || 'User blocked successfully.');
      fetchUsers();
    } catch (err) {
      console.error('Block fetch error:', err);
      setError('Failed to block user. Server error.');
    }
  };

  const unblockUser = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this user?')) return;

    try {
      const res = await fetch(`http://localhost:5001/api/admin/users/unblock/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Unblock error:', data);
        setError(data.error || 'Failed to unblock user.');
        return;
      }

      setSuccessMsg(data.message || 'User unblocked successfully.');
      fetchUsers();
    } catch (err) {
      console.error('Unblock fetch error:', err);
      setError('Failed to unblock user. Server error.');
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Users 👥</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Admin</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>{user.is_admin ? 'Yes' : 'No'}</td>
                <td>{user.is_blocked ? 'Yes' : 'No'}</td>
                <td>
                  {!user.is_blocked ? (
                    <button
                      onClick={() => blockUser(user.id)}
                      style={{ color: 'red', marginRight: '10px' }}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => unblockUser(user.id)}
                      style={{ color: 'green', marginRight: '10px' }}
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersAdmin;
