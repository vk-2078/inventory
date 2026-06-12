import { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import Toast from '../components/Toast.jsx';

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const load = () => Promise.all([api.get('/orders'), api.get('/products'), api.get('/customers')]).then(([o, p, c]) => { setOrders(o.data); setProducts(p.data); setCustomers(c.data); });
  useEffect(() => { load(); }, []);

  const productMap = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const customerMap = useMemo(() => Object.fromEntries(customers.map((c) => [c.id, c])), [customers]);
  const total = items.reduce((sum, item) => sum + Number(productMap[item.product_id]?.price || 0) * Number(item.quantity || 0), 0);
  const hasStockIssue = items.some((item) => item.product_id && Number(item.quantity) > Number(productMap[item.product_id]?.stock_quantity || 0));

  const addItem = () => setItems([...items, { product_id: '', quantity: 1 }]);
  const updateItem = (i, patch) => setItems(items.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (hasStockIssue) return setToast({ message: 'Stock is insufficient for selected quantity.', type: 'error' });
    try {
      await api.post('/orders', { customer_id: Number(customerId), items: items.map((i) => ({ product_id: Number(i.product_id), quantity: Number(i.quantity) })) });
      setToast({ message: 'Order placed and stock reduced automatically', type: 'success' });
      setCustomerId(''); setItems([{ product_id: '', quantity: 1 }]); load();
    } catch (err) { setToast({ message: err.userMessage, type: 'error' }); }
  };

  return (
    <section className="page-grid orders-page">
      <Toast {...toast} onClose={() => setToast({ message: '' })} />
      <div className="panel glass form-panel wide-form">
        <p className="eyebrow">Transaction Engine</p>
        <h2>Create Order</h2>
        <form onSubmit={placeOrder} className="smart-form">
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
            <option value="">Select customer</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
          </select>
          {items.map((item, index) => {
            const p = productMap[item.product_id];
            const stockIssue = p && Number(item.quantity) > p.stock_quantity;
            return <div className="order-item" key={index}>
              <select value={item.product_id} onChange={(e) => updateItem(index, { product_id: e.target.value })} required>
                <option value="">Select product</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name} | Stock {p.stock_quantity} | {money(p.price)}</option>)}
              </select>
              <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, { quantity: e.target.value })} required />
              <button type="button" className="mini danger-btn" onClick={() => removeItem(index)} disabled={items.length === 1}>Remove</button>
              {p && <small className={stockIssue ? 'stock-error' : 'stock-ok'}>{stockIssue ? `Only ${p.stock_quantity} units available` : `Subtotal: ${money(Number(p.price) * Number(item.quantity || 0))}`}</small>}
            </div>;
          })}
          <button type="button" className="ghost" onClick={addItem}>+ Add Another Product</button>
          <div className="total-box"><span>Total Amount</span><strong>{money(total)}</strong></div>
          <button disabled={!customerId || hasStockIssue}>Place Order</button>
        </form>
      </div>

      <div className="panel glass table-panel">
        <div className="panel-head"><div><p className="eyebrow">Order History</p><h2>Recent Orders</h2></div><span>{orders.length} orders</span></div>
        <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>
          {orders.map((o) => <tr key={o.id}><td>#{o.id}</td><td>{customerMap[o.customer_id]?.name || `Customer ${o.customer_id}`}</td><td>{o.order_items?.length || 0}</td><td>{money(o.total_amount)}</td><td><span className="badge ok">{o.status}</span></td></tr>)}
        </tbody></table></div>
      </div>
    </section>
  );
}
