import { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import StatCard from '../components/StatCard.jsx';

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats').catch(() => ({ data: null })),
      api.get('/orders').catch(() => ({ data: [] })),
      api.get('/products').catch(() => ({ data: [] })),
    ]).then(([statsRes, ordersRes, productsRes]) => {
      setStats(statsRes.data);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const fallback = useMemo(() => ({
    total_products: products.length,
    total_customers: 0,
    total_orders: orders.length,
    total_revenue: orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
    low_stock_count: products.filter((p) => p.stock_quantity <= 5).length,
    inventory_value: products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock_quantity || 0), 0),
    low_stock_products: products.filter((p) => p.stock_quantity <= 5),
  }), [products, orders]);

  const data = stats || fallback;

  return (
    <section className="page-stack">
      <div className="hero-card glass">
        <div>
          <p className="eyebrow">Smart warehouse panel</p>
          <h1>Track stock, customers and orders in real time.</h1>
          <p>Modern UI, transaction-safe backend, stock validation, auto-calculated billing and low-stock alerts.</p>
        </div>
        <div className="hero-orb">₹</div>
      </div>

      <div className="stats-grid">
        <StatCard label="Products" value={loading ? '...' : data.total_products} helper="Active catalog" tone="blue" />
        <StatCard label="Customers" value={loading ? '...' : data.total_customers} helper="Unique emails" tone="green" />
        <StatCard label="Orders" value={loading ? '...' : data.total_orders} helper="Placed orders" tone="purple" />
        <StatCard label="Revenue" value={loading ? '...' : money(data.total_revenue)} helper="Auto calculated" tone="orange" />
      </div>

      <div className="dashboard-grid">
        <div className="panel glass">
          <div className="panel-head"><h3>Inventory Health</h3><span>{data.low_stock_count} alerts</span></div>
          <div className="health-ring">
            <div className="ring"><span>{Math.max(0, data.total_products - data.low_stock_count)}</span><small>Healthy</small></div>
            <div className="health-meta">
              <p><b>{money(data.inventory_value)}</b> inventory value</p>
              <p><b>{data.low_stock_count}</b> products need attention</p>
              <p><b>{data.out_of_stock_count || 0}</b> out of stock</p>
            </div>
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-head"><h3>Low Stock Watchlist</h3><span>≤ 5 units</span></div>
          <div className="watch-list">
            {(data.low_stock_products || []).length === 0 && <p className="empty">No low stock products.</p>}
            {(data.low_stock_products || []).map((p) => (
              <div className="watch-row" key={p.id}>
                <div><strong>{p.name}</strong><small>{p.sku}</small></div>
                <span className={p.stock_quantity === 0 ? 'badge danger' : 'badge warn'}>{p.stock_quantity} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
