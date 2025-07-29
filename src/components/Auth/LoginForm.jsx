import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DoctorCharacter from './DoctorCharacter';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') setIsTypingPassword(e.target.value.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, result } = await login(form.email, form.password);
      if (success) {
        toast.success("Login Successfully");
        navigate('/dashboard');
      } else {
        setError(result);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { success, message } = await loginWithGoogle();

    if (success) {
      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } else {
      toast.error(message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <BackgroundCircles />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <DoctorCharacter isPasswordVisible={showPassword} isTypingPassword={isTypingPassword} />
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">ENTNT</h2>
          <p className="text-lg text-gray-600 font-medium">Dental Center</p>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <InputField
            id="email"
            type="email"
            icon={<Mail />}
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
          />

          <PasswordField
            id="password"
            value={form.password}
            onChange={handleChange}
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />

          {error && (
            <div className="rounded-md bg-red-50 p-4 animate-shake">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google icon" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable components

const InputField = ({ id, type = 'text', icon, ...props }) => (
  <div className="relative !mb-4">
    <label htmlFor={id} className="sr-only">{id}</label>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
    <input
      id={id}
      name={id}
      type={type}
      required
      autoComplete={id}
      {...props}
      className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-400"
    />
  </div>
);

const PasswordField = ({ id, value, show, onToggle, onChange }) => (
  <div className="relative !mb-4">
    <label htmlFor={id} className="sr-only">Password</label>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-gray-400" />
    </div>
    <input
      id={id}
      name={id}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required
      autoComplete="current-password"
      placeholder="Password"
      className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:border-blue-400"
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-md transition-colors duration-200"
    >
      {show ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
    </button>
  </div>
);

const BackgroundCircles = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse animation-delay-2000" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-200 rounded-full opacity-10 animate-spin animation-duration-20000" />
  </div>
);

export default LoginForm;
