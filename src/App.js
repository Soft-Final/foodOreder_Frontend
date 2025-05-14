// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MenuManagement from './components/MenuManagement';
import Sidebar from './components/Sidebar';
import Feedback from './components/Feedback'; // Rename or correct Feedback component import

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/menu" element={<MenuManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
