// src/components/Auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import DoctorCharacter from './DoctorCharacter';
import { useAuth } from '../../contexts/AuthContext';

const isPasswordValid = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);

const RegisterForm = () => {
    const navigate = useNavigate();
    const { register, registerWithGoogle } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    const [visibility, setVisibility] = useState({
        showPassword: false,
        showConfirmPassword: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const togglePassword = (field) =>
        setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));

    const handleGoogleSignup = async () => {
        const { success, alreadyExists, message } = await registerWithGoogle();

        if (!success) {
            toast.error(message || "Google sign-up failed");
            return;
        }

        if (alreadyExists) {
            toast("You already have an account. Please login.");
            navigate("/login");
        } else {
            toast("Complete your profile to finish registration");
            navigate("/complete-registration");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { name, email, password, confirmPassword, role } = formData;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isPasswordValid(password)) {
            setError('Password must include uppercase, lowercase, number, symbol and be at least 8 characters');
            return;
        }

        try {
            setLoading(true);
            const response = await register(name, email, password, role);
            const { success, result } = response.data;

            if (success) {
                toast.success("Successfully registered");
                setTimeout(() => navigate('/login'), 1000);
            } else {
                setError(result);
            }
        } catch (err) {
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const { name, email, password, confirmPassword, role } = formData;
    const { showPassword, showConfirmPassword } = visibility;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Circles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-200 rounded-full opacity-10 animate-spin animation-duration-20000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <DoctorCharacter isPasswordVisible={showPassword} isTypingPassword={!!password} />
                    <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">ENTNT</h2>
                    <p className="text-lg text-gray-600 font-medium">Dental Center</p>
                    <p className="mt-2 text-sm text-gray-500">Create your account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Input Fields */}
                    <InputField
                        id="name"
                        icon={<User />}
                        value={name}
                        onChange={handleChange}
                        placeholder="Full name"
                    />
                    <InputField
                        id="email"
                        type="email"
                        icon={<Mail />}
                        value={email}
                        onChange={handleChange}
                        placeholder="Email address"
                    />
                    <PasswordField
                        id="password"
                        value={password}
                        show={showPassword}
                        onToggle={() => togglePassword('showPassword')}
                        onChange={handleChange}
                    />
                    <PasswordField
                        id="confirmPassword"
                        value={confirmPassword}
                        show={showConfirmPassword}
                        onToggle={() => togglePassword('showConfirmPassword')}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                    />

                    {/* Role Selection */}
                    <div className="relative !mb-3">
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={handleChange}
                            required
                            className="appearance-none bg-white block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 sm:text-sm transition duration-300 hover:border-blue-400"
                        >
                            <option value="">Select Role</option>
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 animate-shake">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                                <p className="ml-3 text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Google Signup */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google icon" className="w-5 h-5 mr-2" />
                        Sign up with Google
                    </button>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating account...
                            </div>
                        ) : 'Register'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Reusable input components
const InputField = ({ id, type = 'text', icon, ...props }) => (
    <div className="relative !mb-3">
        <label htmlFor={id} className="sr-only">{id}</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
        <input
            id={id}
            name={id}
            type={type}
            autoComplete={id}
            required
            {...props}
            className="appearance-none bg-white block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 sm:text-sm transition duration-300 hover:border-blue-400"
        />
    </div>
);

const PasswordField = ({ id, value, show, onToggle, onChange, placeholder = 'Password' }) => (
    <div className="relative !mb-3">
        <label htmlFor={id} className="sr-only">{placeholder}</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
            id={id}
            name={id}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="new-password"
            required
            className="appearance-none bg-white block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 sm:text-sm transition duration-300 hover:border-blue-400"
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

export default RegisterForm;