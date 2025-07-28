import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from "../../api/axios";
import toast from 'react-hot-toast';

const CompleteGoogleRegistration = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idToken = localStorage.getItem('google-id-token');

        if (!idToken) {
            toast.error("Session expired. Please sign in again.");
            return navigate("/login");
        }

        try {
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
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Complete Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">Select Role</option>
                    <option value="Student">Student</option>
                    <option value="Professor">Professor</option>
                </select>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CompleteGoogleRegistration;
