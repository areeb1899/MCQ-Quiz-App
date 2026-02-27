import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, CheckCircle, Database } from 'lucide-react';

const Home = () => {
    const features = [
        {
            icon: <FileText className="w-6 h-6 text-primary-600" />,
            title: 'Unlimited Questions',
            description: 'Add as many multiple-choice questions as you need for your exams without any limits.',
        },
        {
            icon: <Sparkles className="w-6 h-6 text-primary-600" />,
            title: 'Auto Extraction',
            description: 'Upload images or PDFs to automatically extract questions and options',
        },
        {
            icon: <CheckCircle className="w-6 h-6 text-primary-600" />,
            title: 'Instant Grading',
            description: 'Get immediate feedback and a final score with 1 mark awarded per correct answer.',
        },
        {
            icon: <Database className="w-6 h-6 text-primary-600" />,
            title: 'Smart Learning',
            description: 'Review your correct and incorrect answers to improve your performance.',
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-3xl"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-700 font-medium text-sm mb-6 border border-primary/20">
                    <Sparkles className="w-4 h-4" />
                    <span>The ultimate study companion</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                    Master any subject with <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                        custom MCQ exams
                    </span>
                </h1>

                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Create comprehensive question banks, pull questions from screenshots, and practice in a beautifully designed environment focused on your learning.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link
                        to="/create"
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-black hover:text-white font-semibold rounded-2xl hover:bg-primary-600 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Start Creating Quizzes
                    </Link>
                    <Link
                        to="/quiz"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                    >
                        Take a Practice Test
                    </Link>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 text-left"
                    >
                        <div className="p-3 bg-primary/5 rounded-xl">
                            {feature.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-1">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;
