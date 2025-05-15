// src/Layout.jsx
import { useState } from 'react';
import Sidebar from './components/admin/Sidebar';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`transition-all duration-300 p-6 w-full ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
