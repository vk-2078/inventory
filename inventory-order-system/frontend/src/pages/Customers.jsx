import { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import Toast from '../components/Toast.jsx';

const emptyForm = { name: '', email: '', phone: '', address: '' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const load = () => api.get('/customers').then((res) => setCustomers(res.data));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => customers.filter((c) =>
    [c.name, c.email, c.phone, c.address].join(' ').toLowerCase().includes(query.toLowerCase())
  ), [customers, query]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/customers/${editingId}`, form);
      else await api.post('/customers', form);
      setToast({ message: editingId ? 'Customer updated successfully' : 'Customer added successfully', type: 'success' });
      setForm(emptyForm); setEditingId(null); load();
    } catch (err) { setToast({ message: err.userMessage, type: 'error' }); }
  };

  const edit = (c) => { setEditingId(c.id); setForm({ name: c.name, email: c.email, phone: c.phone || '', address: c.address || '' }); };
  const remove = async (id) => { if (!confirm('Delete this customer? Related orders can also be affected.')) return; try { await api.delete(`/customers/${id}`); setToast({ message: 'Customer deleted', type: 'success' }); load(); } catch (err) { setToast({ message: err.userMessage, type: 'error' }); } };

  return (
    <section className="page-grid">
      <Toast {...toast} onClose={() => setToast({ message: '' })} />
      <div className="panel glass form-panel">
        <p className="eyebrow">CRM Desk</p>
        <h2>{editingId ? 'Edit Customer' : 'Add Customer'}</h2>
        <form onSubmit={save} className="smart-form">
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Unique email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button>{editingId ? 'Update Customer' : 'Create Customer'}</button>
          {editingId && <button type="button" className="ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</button>}
        </form>
      </div>

      <div className="panel glass table-panel">
        <div className="panel-head"><div><p className="eyebrow">Customer Records</p><h2>Customers</h2></div><span>{customers.length} profiles</span></div>
        <input className="search" placeholder="Search customer name, email, phone..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead><tbody>
          {filtered.map((c) => <tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.email}</td><td>{c.phone || '-'}</td><td>{c.address || '-'}</td><td><button className="mini" onClick={() => edit(c)}>Edit</button><button className="mini danger-btn" onClick={() => remove(c.id)}>Delete</button></td></tr>)}
        </tbody></table></div>
      </div>
    </section>
  );
}
