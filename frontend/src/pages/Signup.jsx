import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    country: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("DEBUG: Form submission started. Form data:", formData);

    try {
      await axios
        .post("https://task-tracker-backend-jur5.onrender.com/api/auth/signup", formData)
        .then((response) => {
          console.log("DEBUG: Data received from server:", response.data);

          if (response.data.message === "Sign Up Successfully") {
            alert("Sign Up Successfully, please login");
            navigate("/login");
          } else {
            console.log(
              "DEBUG: Unexpected response message:",
              response.data.message
            );
            alert("Unexpected response from server. Please try again.");
          }
        });
    } catch (error) {
      console.error("DEBUG: Error during signup:", error);

      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("DEBUG: Server error response:", error.response.data);
        alert(
          `Signup failed: ${
            error.response.data.error || "Unknown server error"
          }`
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error(
          "DEBUG: No response received from server. Request details:",
          error.request
        );
        alert(
          "Signup failed: No response from server. Please check your connection."
        );
      } else {
        // Something else caused the error
        console.error("DEBUG: Error setting up the request:", error.message);
        alert(`Signup failed: ${error.message}`);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 mb-8">
            Join us and start managing your projects
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              placeholder="Enter your country"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200"
            >
              Create Account
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500 transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
