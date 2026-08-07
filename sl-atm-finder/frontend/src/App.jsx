import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MapPage from './pages/MapPage';
import ATMDetails from './pages/ATMDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Emergency from './pages/Emergency';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/atm/:id" element={<ATMDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="bg-harbor text-paper/50 text-center text-xs py-4">
        SL-ATM Finder — a Sri Lanka banking service locator
      </footer>
    </div>
  );
}
