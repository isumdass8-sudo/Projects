import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import About from './pages/About';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';
import Calculator from './pages/Calculator';
import OurLands from './pages/OurLands';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import PostDetail from './pages/PostDetail';
import Contact from './pages/Contact';
import Verify from './pages/Verify';

import AdminOverview from './pages/admin/AdminOverview';
import AdminContributions from './pages/admin/AdminContributions';
import AdminMessages from './pages/admin/AdminMessages';
import AdminUsers from './pages/admin/AdminUsers';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/:code" element={<PlanDetail />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/our-lands" element={<OurLands />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:id" element={<Verify />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin', 'staff']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="contributions" element={<AdminContributions />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<PostDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<div className="max-w-4xl mx-auto px-5 py-24 text-center">Page not found.</div>} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
