// src/pages/CompleteGoogleRegistration.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../api/axios';
import toast from 'react-hot-toast';

const CompleteGoogleRegistration = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const idToken = localStorage.getItem('google-id-token');
        if (!idToken) {
            toast.error('Missing Google token. Please log in again.');
            navigate('/login');
            return;
        }

        // Decode token or verify via Firebase Auth to get email
        import('firebase/auth').then(({ getAuth }) => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                setEmail(user.email);
            } else {
                toast.error('Unable to retrieve email. Please log in again.');
                navigate('/login');
            }
        });
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const idToken = localStorage.getItem('google-id-token');

        try {
            const response = await API.post('/auth/register', {
                email,
                role
            }, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            });

            const { success, result } = response.data;
            if (success) {
                toast.success("Registration complete!");
                localStorage.removeItem('google-id-token');
                navigate('/dashboard');
            } else {
                toast.error(result || 'Failed to register');
            }
        } catch (err) {
            toast.error('Error completing registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white p-8 shadow-md rounded">
                <h2 className="text-2xl font-bold text-center text-gray-800">Complete Registration</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    >
                        <option value="">Select Role</option>
                        <option value="Student">Student</option>
                        <option value="Professor">Professor</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                >
                    {loading ? 'Registering...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default CompleteGoogleRegistration;
