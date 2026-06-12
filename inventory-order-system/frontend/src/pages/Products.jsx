import { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import Toast from '../components/Toast.jsx';

const emptyForm = { name: '', description: '', sku: '', price: '', stock_quantity: '' };
const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const load = () => api.get('/products').then((res) => setProducts(res.data));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => products.filter((p) =>
    [p.name, p.sku, p.description].join(' ').toLowerCase().includes(query.toLowerCase())
  ), [products, query]);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      setToast({ message: editingId ? 'Product updated successfully' : 'Product added successfully', type: 'success' });
      setForm(emptyForm); setEditingId(null); load();
    } catch (err) { setToast({ message: err.userMessage, type: 'error' }); }
  };

  const edit = (p) => { setEditingId(p.id); setForm({ name: p.name, description: p.description || '', sku: p.sku, price: p.price, stock_quantity: p.stock_quantity }); };
  const remove = async (id) => { if (!confirm('Delete this product?')) return; try { await api.delete(`/products/${id}`); setToast({ message: 'Product deleted', type: 'success' }); load(); } catch (err) { setToast({ message: err.userMessage, type: 'error' }); } };

  return (
    <section className="page-grid">
      <Toast {...toast} onClose={() => setToast({ message: '' })} />
      <div className="panel glass form-panel">
        <p className="eyebrow">Catalog Control</p>
        <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={save} className="smart-form">
          <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Unique SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="two-col">
            <input type="number" min="1" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input type="number" min="0" placeholder="Stock" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} required />
          </div>
          <button>{editingId ? 'Update Product' : 'Create Product'}</button>
          {editingId && <button type="button" className="ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</button>}
        </form>
      </div>

      <div className="panel glass table-panel">
        <div className="panel-head"><div><p className="eyebrow">Warehouse List</p><h2>Products</h2></div><span>{products.length} items</span></div>
        <input className="search" placeholder="Search by product, SKU or description..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {filtered.map((p) => <tr key={p.id}><td><strong>{p.name}</strong><small>{p.description}</small></td><td>{p.sku}</td><td>{money(p.price)}</td><td>{p.stock_quantity}</td><td><span className={p.stock_quantity <= 5 ? 'badge danger' : 'badge ok'}>{p.stock_quantity <= 5 ? 'Low Stock' : 'In Stock'}</span></td><td><button className="mini" onClick={() => edit(p)}>Edit</button><button className="mini danger-btn" onClick={() => remove(p.id)}>Delete</button></td></tr>)}
        </tbody></table></div>
      </div>
    </section>
  );
}
