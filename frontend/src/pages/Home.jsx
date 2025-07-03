import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus, ClipboardList, Loader, CheckCircle,
  MapPin, Upload, BarChart, MessageCircle, Users, CheckCheck
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { useAuth } from '../context/AuthContext'; // ✅ keep this here

const steps = [
  {
    id: 1,
    title: "Create an Account",
    description: "Sign up as a resident to start reporting issues in your community.",
    icon: <UserPlus className="w-6 h-6 text-blue-600 group-hover:text-white transition duration-300" />,
    link: "/register",
  },
  {
    id: 2,
    title: "Submit a Complaint",
    description: "Report issues with details, location, and supporting photos or videos.",
    icon: <ClipboardList className="w-6 h-6 text-blue-600 group-hover:text-white transition duration-300" />,
    link: "/submit-complaint",
  },
  {
    id: 3,
    title: "Track Progress",
    description: "Follow along as your complaint is processed and addressed by municipal staff.",
    icon: <Loader className="w-6 h-6 text-blue-600 group-hover:text-white transition duration-300" />,
    link: "/track",
  },
  {
    id: 4,
    title: "Verify Resolution",
    description: "Confirm when issues are properly resolved or request further action if needed.",
    icon: <CheckCircle className="w-6 h-6 text-blue-600 group-hover:text-white transition duration-300" />,
    link: "/verify",
  },
];

const features = [
  {
    title: "Location-Based Reporting",
    description: "Easily pinpoint issues on a map or use your device's location to automatically detect where you are.",
    icon: <MapPin className="text-blue-600 w-6 h-6" />,
  },
  {
    title: "Photo & Video Evidence",
    description: "Attach media to your reports to provide clear evidence of issues that need resolution.",
    icon: <Upload className="text-blue-600 w-6 h-6" />,
  },
  {
    title: "Status Tracking",
    description: "Follow the progress of your complaints from submission to resolution with real-time status updates.",
    icon: <BarChart className="text-blue-600 w-6 h-6" />,
  },
  {
    title: "Community Discussion",
    description: "Engage in conversations about reported issues with fellow citizens and municipal staff.",
    icon: <MessageCircle className="text-blue-600 w-6 h-6" />,
  },
  {
    title: "Community Voting",
    description: "Upvote important issues to help municipalities prioritize resources effectively.",
    icon: <Users className="text-blue-600 w-6 h-6" />,
  },
  {
    title: "Resolution Verification",
    description: "Confirm when issues are properly resolved, ensuring accountability and quality of service.",
    icon: <CheckCheck className="text-blue-600 w-6 h-6" />,
  },
];

const Home = () => {
  const { user } = useAuth(); // ✅ call hook inside component
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white font-sans">
      <HeroSection />

      <div className="mt-12 px-6 md:px-10 pb-20">
        {/* Features Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl mt-36 font-bold text-gray-800 mb-3">Powerful Features for Community Action</h2>
          <p className="text-gray-600 text-lg mb-12">
            Our platform provides all the tools you need to report, track, and resolve community issues efficiently.
          </p>

          <div className="grid grid-cols-1 mt-16 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-blue-300 transition duration-300 text-left"
              >
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="text-center mt-28">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">How It Works</h2>
          <p className="text-gray-600 text-lg mb-14">
            A simple four-step process to help improve your community
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {steps.map((step) => (
              <Link to={step.link} key={step.id}>
                <div className="relative group bg-white border border-gray-200 rounded-xl shadow-md p-8 text-left transition-transform duration-300 hover:scale-105 hover:shadow-blue-300">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-110 transition">
                    {step.id}
                  </div>
                  <div className="flex items-start space-x-4 mt-6">
                    <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-600 transition">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{step.title}</h3>
                      <p className="text-gray-600 text-base">{step.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-28 bg-blue-50 text-gray-800 py-20 px-6 text-center rounded-xl shadow-lg mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold mb-4">Ready to improve your community?</h2>
          <p className="text-lg mb-8">
            Join thousands of citizens making a difference in their neighborhoods. Report issues, track progress, and help build a better community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {isAdmin ? (
              <button
                disabled
                title="Admins cannot submit issues"
                className="bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-md cursor-not-allowed"
              >
                Report an Issue
              </button>
            ) : (
              <Link
                to="/submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Report an Issue
              </Link>
            )}
           <Link
  to={user ? "/profile" : "/register"}
  className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 font-semibold py-3 px-6 rounded-md transition duration-300"
>
  {user ? "Go to Profile" : "Join the Community"}
</Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
