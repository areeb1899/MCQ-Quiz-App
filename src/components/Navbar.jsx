import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, PenTool, PlayCircle, LogIn, LogOut, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isTeacher, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully!');
    };

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navItems = [
        { label: 'Home', path: '/', icon: <BrainCircuit className="w-5 h-5" />, visible: true },
        { label: 'Add Questions', path: '/create', icon: <PenTool className="w-5 h-5" />, visible: isTeacher },
        { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" />, visible: isTeacher },
        { label: 'Take Quiz', path: '/quiz', icon: <PlayCircle className="w-5 h-5" />, visible: true },
    ];

    return (
        <header className="sticky top-0 z-50 w-full flex flex-col shadow-sm">
            <nav className="w-full backdrop-blur-md bg-white/70 border-b border-border relative">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:bg-primary-600 transition-colors">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                            MCQ Master
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.filter(item => item.visible).map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === item.path
                                    ? 'bg-primary/10 text-primary-700 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-slate-200 mx-2"></div>

                        {isTeacher ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-destructive transition-all cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Teacher Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                <LogIn className="w-4 h-4" />
                                Teacher Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-slate-100 bg-white shadow-lg overflow-hidden"
                        >
                            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                                {navItems.filter(item => item.visible).map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path
                                            ? 'bg-primary/10 text-primary-700'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="text-base">{item.label}</span>
                                    </Link>
                                ))}

                                <div className="w-full h-px bg-slate-100 my-2"></div>

                                {isTeacher ? (
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-destructive transition-all cursor-pointer w-full text-left"
                                    >
                                        <LogOut className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-base">Teacher Logout</span>
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                                    >
                                        <LogIn className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-base">Teacher Login</span>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Navbar;
