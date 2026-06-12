import { NavLink } from 'react-router-dom';

const nav = [
  { to: '/', label: 'Dashboard', icon: '⌘' },
  { to: '/products', label: 'Products', icon: '□' },
  { to: '/customers', label: 'Customers', icon: '◇' },
  { to: '/orders', label: 'Orders', icon: '◉' },
];

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar glass">
        <div className="brand">
          <div className="brand-mark">IO</div>
          <div>
            <h1>StockPilot</h1>
            <p>Inventory Command Center</p>
          </div>
        </div>
        <nav>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-card">
          <strong>Assessment Ready</strong>
          <p>FastAPI • React • PostgreSQL • Docker</p>
        </div>
      </aside>
      <main className="main-panel">
        <header className="topbar glass">
          <div>
            <p className="eyebrow">Live Operations</p>
            <h2>Inventory & Order Management</h2>
          </div>
          <div className="admin-pill"><span></span> Admin</div>
        </header>
        {children}
      </main>
    </div>
  );
}
