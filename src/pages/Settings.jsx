import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const Settings = () => {
    const { password: currentPassword, changePassword, logout } = useAuthStore();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (oldPassword !== currentPassword) {
            setError('Current password is incorrect.');
            return;
        }

        if (newPassword.length < 4) {
            setError('New password must be at least 4 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        changePassword(newPassword);
        logout();
        toast.success('Passcode updated successfully! Please log in again.');
        setSuccess(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Teacher Settings</h1>
                <p className="text-slate-600">Manage your access credentials</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
            >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <KeyRound className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Change Passcode</h2>
                        <p className="text-sm text-slate-500">Update the passcode used to access the question bank</p>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="p-4 bg-success/10 text-success-700 border border-success/20 rounded-xl flex items-center gap-3"
                        >
                            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">Passcode updated successfully!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Current Passcode
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Enter current passcode"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            New Passcode
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Enter new passcode"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirm New Passcode
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Confirm new passcode"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="py-3 px-6 bg-primary text-secondary hover:text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors cursor-pointer shadow-sm shadow-primary/20 w-auto"
                        >
                            Update Passcode
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Settings;
