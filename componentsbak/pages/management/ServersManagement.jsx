import React, { useState, useEffect } from 'react';
import { Network, Plus, X, Edit2, Save, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Card = ({ children, title, icon: Icon }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-6">
        {(title || Icon) && (
          <div className="flex items-center gap-3 mb-6">
            {Icon && <Icon className="w-5 h-5 text-gray-400" />}
            {title && <h2 className="text-xl font-semibold text-gray-200">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

const Dialog = ({ isOpen, onClose, title, description, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
      {type === 'success' && <CheckCircle className="w-4 h-4" />}
      {type === 'error' && <XCircle className="w-4 h-4" />}
      {type === 'warning' && <AlertTriangle className="w-4 h-4" />}
      {message}
    </div>
  );
};

const ITEMS_PER_PAGE = 5;

const ServersManagement = () => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [newIp, setNewIp] = useState({ ip_address: '', label: '' });
  const [editingServer, setEditingServer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const [connectionStatus, setConnectionStatus] = useState({});
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   fetchIpAddresses();
  //   // Initialize WebSocket connection for real-time status updates
  //   const ws = new WebSocket('ws://your-backend-url/ws');
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setConnectionStatus(prevStatus => ({
  //       ...prevStatus,
  //       [data.ip_address]: data.status
  //     }));
  //   };
  //   return () => ws.close();
  // }, []);

  // const showToast = (message, type = 'success') => {
  //   setToast({ message, type });
  // };

  const validateIp = (ip) => {
    const ipRegex = /^(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
    if (!ipRegex.test(ip)) {
      return 'Invalid IP address format';
    }
    return null;
  };

  const validateLabel = (label) => {
    const labelRegex = /^[a-zA-Z0-9-_]{1,100}$/;
    if (!labelRegex.test(label)) {
      return 'Label can only contain letters, numbers, hyphens, and underscores (max 100 characters)';
    }
    return null;
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.ip_address) {
      newErrors.ip_address = 'IP address is required';
    } else {
      const ipError = validateIp(data.ip_address);
      if (ipError) newErrors.ip_address = ipError;
    }
    if (!data.label) {
      newErrors.label = 'Label is required';
    } else {
      const labelError = validateLabel(data.label);
      if (labelError) newErrors.label = labelError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchIpAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:12834/settings/server_management');
      if (!response.ok) throw new Error('Failed to fetch IP addresses');
      const result = await response.json();
      if (result.status === 'success') {
        setIpAddresses(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch IP addresses');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIp = async () => {
    if (!validateForm(newIp)) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('ip_address', newIp.ip_address);
      formData.append('label', newIp.label);

      const response = await fetch('http://localhost:12834/settings/server_management/add', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        await fetchIpAddresses();
        setNewIp({ ip_address: '', label: '' });
        showToast(result.message);
      } else {
        throw new Error(result.message || 'Failed to add IP address');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (server) => {
    setEditingServer({ ...server });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingServer(null);
    setErrors({});
  };

  const handleSaveEdit = async () => {
    if (!validateForm(editingServer)) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('id', editingServer.id);
      formData.append('ip_address', editingServer.ip_address);
      formData.append('label', editingServer.label);

      const response = await fetch('http://localhost:12834/settings/server_management/edit', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        await fetchIpAddresses();
        setEditingServer(null);
        showToast('Server updated successfully');
      } else {
        throw new Error(result.message || 'Failed to update server');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAddresses = ipAddresses.filter(item =>
    item.ip_address.toLowerCase().includes(search.toLowerCase()) ||
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAddresses.length / ITEMS_PER_PAGE);
  const paginatedAddresses = filteredAddresses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <section className="mb-8">
      <Card title="IP Address Management" icon={Network}>
        <div className="space-y-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="IP Address"
                value={newIp.ip_address}
                onChange={(e) => setNewIp({ ...newIp, ip_address: e.target.value })}
                className={`w-full bg-gray-800/40 border ${errors.ip_address ? 'border-red-500' : 'border-gray-700/50'} rounded-lg p-2`}
              />
              {errors.ip_address && <p className="text-red-500 text-sm mt-1">{errors.ip_address}</p>}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Label"
                value={newIp.label}
                onChange={(e) => setNewIp({ ...newIp, label: e.target.value })}
                className={`w-full bg-gray-800/40 border ${errors.label ? 'border-red-500' : 'border-gray-700/50'} rounded-lg p-2`}
              />
              {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label}</p>}
            </div>
            <button
              onClick={handleAddIp}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search IP addresses or labels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg p-2 pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && !paginatedAddresses.length ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedAddresses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      No IP addresses found
                    </td>
                  </tr>
                ) : (
                  paginatedAddresses.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700/50">
                      <td className="p-3">{item.id}</td>
                      <td className="p-3">
                        {editingServer?.id === item.id ? (
                          <input
                            type="text"
                            value={editingServer.ip_address}
                            onChange={(e) => setEditingServer({ ...editingServer, ip_address: e.target.value })}
                            className={`w-full bg-gray-800/40 border ${errors.ip_address ? 'border-red-500' : 'border-gray-700/50'} rounded-lg p-2`}
                          />
                        ) : (
                          item.ip_address
                        )}
                      </td>
                      <td className="p-3">
                        {editingServer?.id === item.id ? (
                          <input
                            type="text"
                            value={editingServer.label}
                            onChange={(e) => setEditingServer({ ...editingServer, label: e.target.value })}
                            className={`w-full bg-gray-800/40 border ${errors.label ? 'border-red-500' : 'border-gray-700/50'} rounded-lg p-2`}
                          />
                        ) : (
                          item.label
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {editingServer?.id === item.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                disabled={loading}
                                className="p-2 hover:bg-gray-700/50 rounded-lg"
                              >
                                <Save className="w-4 h-4 text-green-400" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={loading}
                                className="p-2 hover:bg-gray-700/50 rounded-lg"
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-2 hover:bg-gray-700/50 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4 text-yellow-400" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(item)}
                                className="p-2 hover:bg-gray-700/50 rounded-lg"
                              >
                                <X className="w-4 h-4 text-red-400" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              Previous
            </button>
            <span className="text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {deleteConfirm && (
        <Dialog
          isOpen={Boolean(deleteConfirm)}
          title="Delete Server"
          description={`Are you sure you want to delete the server with IP address ${deleteConfirm.ip_address}?`}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={async () => {
            try {
              setLoading(true);
              const formData = new FormData();
              formData.append('id', deleteConfirm.id);
              formData.append('ip_address', deleteConfirm.ip_address);
              const response = await fetch(`http://localhost:12834/settings/server_management/delete`, {
                method: 'DELETE',
                body: formData
              });
              const result = await response.json();
              if (result.status === 'success') {
                await fetchIpAddresses();
                showToast(result.message);
              } else {
                throw new Error(result.message || 'Failed to delete server');
              }
            } catch (error) {
              showToast(error.message, 'error');
            } finally {
              setLoading(false);
              setDeleteConfirm(null);
            }
          }}
        />
      )}
    </section>
  );
};

export default ServersManagement;
