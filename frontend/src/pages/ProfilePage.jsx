import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return <p className="text-center text-lg mt-20">Login to see details</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center">
        👤 Profile Overview
      </h2>

      <div className="space-y-4">
        <ProfileItem label="Name" value={user.name || "N/A"} />
        <ProfileItem label="Email" value={user.email || "N/A"} />
        <ProfileItem label="Role" value={user.role || "Citizen"} />
        <ProfileItem label="Joined At" value={new Date(user.createdAt).toLocaleDateString()} />
      </div>

      <div className="text-center">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
    <span className="text-gray-900 dark:text-white">{value}</span>
  </div>
);

export default Profile;
