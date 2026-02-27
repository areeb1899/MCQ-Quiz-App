import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import Result from './pages/Result';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/quiz" element={<TakeQuiz />} />
          <Route path="/result" element={<Result />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
