import React, { useState, useEffect } from 'react';
import { Shield, Plus, X, Edit2 } from 'lucide-react';
import { Card } from './Card';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', permissions: [] });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const availablePermissions = ['read', 'write', 'delete'];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });
      if (response.ok) {
        fetchRoles();
        setNewRole({ name: '', permissions: [] });
      }
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleUpdateRole = async (id) => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });
      if (response.ok) {
        fetchRoles();
        setEditId(null);
        setNewRole({ name: '', permissions: [] });
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchRoles();
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  return (
    <section className="mb-8">
      <Card title="Role Management" icon={Shield}>
        <div className="space-y-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Role Name"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="flex-1 bg-gray-800/40 border border-gray-700/50 rounded-lg p-2"
            />
            <button
              onClick={() => editId ? handleUpdateRole(editId) : handleAddRole()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {editId ? 'Update Role' : 'Add Role'}
            </button>
          </div>

          <div className="flex gap-4">
            {availablePermissions.map((permission) => (
              <label key={permission} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newRole.permissions.includes(permission)}
                  onChange={(e) => {
                    const updatedPermissions = e.target.checked
                      ? [...newRole.permissions, permission]
                      : newRole.permissions.filter(p => p !== permission);
                    setNewRole({ ...newRole, permissions: updatedPermissions });
                  }}
                  className="form-checkbox text-blue-500"
                />
                <span className="text-gray-300 capitalize">{permission}</span>
              </label>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-3">Role Name</th>
                  <th className="p-3">Permissions</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-gray-700/50">
                    <td className="p-3">{role.name}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {role.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-sm">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditId(role.id);
                            setNewRole({ name: role.name, permissions: role.permissions });
                          }}
                          className="p-2 hover:bg-gray-700/50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-2 hover:bg-gray-700/50 rounded-lg"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
};
