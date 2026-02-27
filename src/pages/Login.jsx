import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const Login = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Reset Mode State
    const [isResetMode, setIsResetMode] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { login, adminResetPassword } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/create';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password.trim()) {
            setError('Please enter a password.');
            return;
        }

        const isSuccess = login(password);
        if (isSuccess) {
            toast.success('Logged in successfully!');
            navigate(from, { replace: true });
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!secretCode.trim() || !newPassword.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        if (newPassword.length < 4) {
            setError('New passcode must be at least 4 characters long.');
            return;
        }

        const resetSuccess = adminResetPassword(secretCode, newPassword);

        if (resetSuccess) {
            toast.success('Passcode successfully reset! You can now login.');
            setSuccess('Passcode successfully reset! You can now login.');
            setSecretCode('');
            setNewPassword('');
            setTimeout(() => {
                setIsResetMode(false);
                setSuccess('');
            }, 3000);
        } else {
            setError('Invalid Secret Admin Code.');
            setSecretCode('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-border w-full max-w-md relative overflow-hidden group"
            >
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl transition-colors" />

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary-100 mx-auto">
                        <Lock className="w-8 h-8 text-primary-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
                        {isResetMode ? 'Admin Reset' : 'Teacher Access'}
                    </h1>
                    <p className="text-slate-500 text-center mb-8 text-sm">
                        {isResetMode
                            ? 'Enter the secret admin code to reset the teacher passcode.'
                            : 'Please enter the teacher passcode to manage the question bank.'}
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm border border-red-100"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-3 bg-success/10 text-success-700 rounded-xl flex items-center gap-2 text-sm border border-success/20"
                        >
                            <Lock className="w-5 h-5 flex-shrink-0" />
                            <span>{success}</span>
                        </motion.div>
                    )}

                    {!isResetMode ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Passcode
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password..."
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-primary hover:bg-primary-600 text-black hover:text-white font-semibold rounded-xl transition-all shadow-sm shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                            >
                                <LogIn className="w-5 h-5" />
                                Login
                            </button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => { setIsResetMode(true); setError(''); setSuccess(''); setPassword(''); }}
                                    className="text-sm text-primary hover:text-primary-700 font-medium cursor-pointer"
                                >
                                    Forgot Passcode?
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleResetSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Secret Admin Code
                                </label>
                                <input
                                    type="password"
                                    value={secretCode}
                                    onChange={(e) => setSecretCode(e.target.value)}
                                    placeholder="Enter admin code..."
                                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all mb-4"
                                    autoFocus
                                />

                                <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">
                                    New Passcode
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new passcode..."
                                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"

                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                            >
                                <Lock className="w-5 h-5" />
                                Reset Passcode
                            </button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => { setIsResetMode(false); setError(''); setSuccess(''); setSecretCode(''); setNewPassword(''); }}
                                    className="text-sm text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
