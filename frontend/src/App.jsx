// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintList from "./pages/ComplaintList";
import HeatmapView from "./pages/HeatmapView";
import VolunteerPage from "./pages/VolunteerPage";
import LogIn from "./auth/LogIn";
import Register from "./auth/Register";
import ProfilePage from "./pages/ProfilePage";
import AdminLogin from "./auth/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import UserVerificationPage from "./pages/UserVerificationPage";

const App = () => {
  const location = useLocation();
  const { loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900 flex flex-col">
      {/* Header (except on admin-login page) */}
      {location.pathname !== "/admin-login" && <Header />}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* User Protected Routes */}
            <Route path="/submit" element={<ProtectedRoute><ComplaintForm /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute><ComplaintList /></ProtectedRoute>} />
            <Route path="/my-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/verify-complaints" element={<ProtectedRoute><UserVerificationPage /></ProtectedRoute>} />
            <Route path="/heatmap" element={<ProtectedRoute><HeatmapView /></ProtectedRoute>} />
            <Route path="/volunteer" element={<ProtectedRoute><VolunteerPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Admin-only */}
            <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/complaints" element={<AdminRoute><ComplaintList /></AdminRoute>} />
            <Route path="/admin/submit" element={<AdminRoute><ComplaintForm /></AdminRoute>} />
            <Route path="/admin/volunteer" element={<AdminRoute><VolunteerPage /></AdminRoute>} />
            <Route path="/admin/heatmap" element={<AdminRoute><HeatmapView /></AdminRoute>} />
          </Routes>
        </div>
      </main>

      {location.pathname === "/" && <Footer />}
    </div>
  );
};

export default App;
