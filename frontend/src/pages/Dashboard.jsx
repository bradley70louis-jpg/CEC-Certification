import { useAuth } from '../components/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard() {
  const { user } = useAuth();

  // Certificates state
  const [certificates, setCertificates] = useState([]);
  const [isCreatingCert, setIsCreatingCert] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [editingCertId, setEditingCertId] = useState(null);
  const [editingCertTitle, setEditingCertTitle] = useState('');

  // Templates state
  const [templates, setTemplates] = useState([]);
  const [isCreatingTpl, setIsCreatingTpl] = useState(false);
  const [newTplName, setNewTplName] = useState('');
  const [editingTplId, setEditingTplId] = useState(null);
  const [editingTplName, setEditingTplName] = useState('');

  // 📨 Fetch data on load
  useEffect(() => {
    async function fetchData() {
      try {
        const certRes = await api.get('/certificates');
        const tplRes = await api.get('/templates');
        setCertificates(certRes.data || []);
        setTemplates(tplRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    }
    fetchData();
  }, []);

  // ➕ Create Certificate
  const handleCreateCertificate = async () => {
    if (!newCertTitle.trim()) return;
    const newCert = { title: newCertTitle };
    const res = await api.post('/certificates', newCert);
    setCertificates((prev) => [res.data, ...prev]);
    setNewCertTitle('');
    setIsCreatingCert(false);
  };

  // 🗑 Delete Certificate
  const handleDeleteCertificate = async (id) => {
    await api.delete(`/certificates/${id}`);
    setCertificates((prev) => prev.filter((cert) => cert.id !== id));
  };

  // ✏️ Start editing Certificate
  const startEditCertificate = (id, currentTitle) => {
    setEditingCertId(id);
    setEditingCertTitle(currentTitle);
  };

  // 💾 Save Certificate edit
  const handleSaveEditCertificate = async (id) => {
    if (!editingCertTitle.trim()) return;
    const res = await api.patch(`/certificates/${id}`, { title: editingCertTitle });
    setCertificates((prev) =>
      prev.map((cert) => (cert.id === id ? res.data : cert))
    );
    setEditingCertId(null);
    setEditingCertTitle('');
  };

  // ❌ Cancel editing Certificate
  const cancelEditCertificate = () => {
    setEditingCertId(null);
    setEditingCertTitle('');
  };

  // ➕ Create Template
  const handleCreateTemplate = async () => {
    if (!newTplName.trim()) return;
    const newTpl = { name: newTplName };
    const res = await api.post('/templates', newTpl);
    setTemplates((prev) => [res.data, ...prev]);
    setNewTplName('');
    setIsCreatingTpl(false);
  };

  // 🗑 Delete Template
  const handleDeleteTemplate = async (id) => {
    await api.delete(`/templates/${id}`);
    setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
  };

  // ✏️ Start editing Template
  const startEditTemplate = (id, currentName) => {
    setEditingTplId(id);
    setEditingTplName(currentName);
  };

  // 💾 Save Template edit
  const handleSaveEditTemplate = async (id) => {
    if (!editingTplName.trim()) return;
    const res = await api.patch(`/templates/${id}`, { name: editingTplName });
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.id === id ? res.data : tpl))
    );
    setEditingTplId(null);
    setEditingTplName('');
  };

  // ❌ Cancel editing Template
  const cancelEditTemplate = () => {
    setEditingTplId(null);
    setEditingTplName('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.email}</strong></p>

      {/* 📝 Certificates Section */}
      <section style={{ marginTop: '40px' }}>
        <h2>My Certificates</h2>

        {/* Create Certificate Form */}
        {!isCreatingCert ? (
          <button
            onClick={() => setIsCreatingCert(true)}
            style={buttonStyle.primary}
          >
            ➕ Create New Certificate
          </button>
        ) : (
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Enter certificate title"
              value={newCertTitle}
              onChange={(e) => setNewCertTitle(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleCreateCertificate} style={buttonStyle.save}>
              Save
            </button>
            <button
              onClick={() => { setIsCreatingCert(false); setNewCertTitle(''); }}
              style={buttonStyle.cancel}
            >
              Cancel
            </button>
          </div>
        )}

        {certificates.length > 0 ? (
          <ul style={listStyle}>
            {certificates.map((cert) => (
              <li key={cert.id} style={listItemStyle}>
                {editingCertId === cert.id ? (
                  <>
                    <input
                      type="text"
                      value={editingCertTitle}
                      onChange={(e) => setEditingCertTitle(e.target.value)}
                      style={inputStyle}
                    />
                    <button
                      onClick={() => handleSaveEditCertificate(cert.id)}
                      style={buttonStyle.save}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditCertificate}
                      style={buttonStyle.cancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>{cert.title}</strong>
                    </div>
                    <div>
                      <button
                        onClick={() => startEditCertificate(cert.id, cert.title)}
                        style={buttonStyle.edit}
                      >
                        ✏️ Rename
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(cert.id)}
                        style={buttonStyle.delete}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no saved certificates yet.</p>
        )}
      </section>

      {/* 🧰 Templates Section */}
      <section style={{ marginTop: '40px' }}>
        <h2>My Templates</h2>

        {!isCreatingTpl ? (
          <button
            onClick={() => setIsCreatingTpl(true)}
            style={buttonStyle.primary}
          >
            ➕ Create New Template
          </button>
        ) : (
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Enter template name"
              value={newTplName}
              onChange={(e) => setNewTplName(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleCreateTemplate} style={buttonStyle.save}>
              Save
            </button>
            <button
              onClick={() => { setIsCreatingTpl(false); setNewTplName(''); }}
              style={buttonStyle.cancel}
            >
              Cancel
            </button>
          </div>
        )}

        {templates.length > 0 ? (
          <ul style={listStyle}>
            {templates.map((tpl) => (
              <li key={tpl.id} style={listItemStyle}>
                {editingTplId === tpl.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTplName}
                      onChange={(e) => setEditingTplName(e.target.value)}
                      style={inputStyle}
                    />
                    <button
                      onClick={() => handleSaveEditTemplate(tpl.id)}
                      style={buttonStyle.save}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditTemplate}
                      style={buttonStyle.cancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>{tpl.name}</strong>
                    </div>
                    <div>
                      <button
                        onClick={() => startEditTemplate(tpl.id, tpl.name)}
                        style={buttonStyle.edit}
                      >
                        ✏️ Rename
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        style={buttonStyle.delete}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no templates yet.</p>
        )}
      </section>
    </div>
  );
}

// 💅 Shared styles
const inputStyle = {
  padding: '6px',
  fontSize: '14px',
  marginRight: '10px',
  flexGrow: 1,
};

const listStyle = {
  listStyle: 'none',
  paddingLeft: 0,
  marginTop: '15px'
};

const listItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
  background: '#f5f5f5',
  padding: '10px',
  borderRadius: '5px'
};

const buttonStyle = {
  primary: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px'
  },
  save: {
    padding: '6px 10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer'
  },
  cancel: {
    padding: '6px 10px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  edit: {
    padding: '6px 10px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer'
  },
  delete: {
    padding: '6px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
