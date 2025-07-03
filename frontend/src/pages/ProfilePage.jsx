import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, UserCircle2, Mail, ShieldCheck, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Please log in to view your profile.
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white dark:bg-white rounded-2xl shadow-xl border border-white dark:border-white space-y-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="p-4 bg-blue-600 rounded-full text-white shadow-md">
          <UserCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-900">Your Profile</h2>
        <p className="text-sm text-gray-900 dark:text-gray-900">Welcome back, {user.name}</p>
      </div>

      <div className="space-y-4 ">
        <ProfileItem label="Full Name" value={user.name || "N/A"} icon={<UserCircle2 size={18} />} />
        <ProfileItem label="Email" value={user.email || "N/A"} icon={<Mail size={18} />} />
        <ProfileItem label="Role" value={user.role || "Citizen"} icon={<ShieldCheck size={18} />} />
        <ProfileItem
          label="Member Since"
          value={new Date(user.createdAt).toLocaleDateString()}
          icon={<CalendarDays size={18} />}
        />
      </div>

      <div className="pt-4 text-center">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition duration-200 shadow-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value, icon }) => (
  <div className="flex items-center justify-between bg-gray-50 dark:bg-white p-4 rounded-lg shadow-sm border border-white dark:border-white">
    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-900">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <div className="text-gray-900 dark:text-gray-900 font-semibold">{value}</div>
  </div>
);

export default Profile;
