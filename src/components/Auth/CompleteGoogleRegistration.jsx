import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';
import DoctorCharacter from './DoctorCharacter';
import { API } from '../../api/axios';

const CompleteGoogleRegistration = () => {
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idToken = localStorage.getItem('google-id-token');

        if (!idToken) {
            toast.error("Session expired. Please sign in again.");
            return navigate("/login");
        }

        if (!role) {
            setError("Please select a role.");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/auth/complete-google-registration", {
                idToken,
                role,
            });

            if (res.data.success) {
                toast.success("Registration complete!");
                localStorage.removeItem('google-id-token');
                navigate("/login");
            } else {
                toast.error(res.data.result);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to complete registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Circles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-200 rounded-full opacity-10 animate-spin animation-duration-20000" />
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <DoctorCharacter />
                    <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">ENTNT</h2>
                    <p className="text-lg text-gray-600 font-medium">Dental Center</p>
                    <p className="mt-2 text-sm text-gray-500">Complete your registration</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative !mb-3">
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
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
                                Submitting...
                            </div>
                        ) : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteGoogleRegistration;
