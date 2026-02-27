import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import useQuizStore from '../stores/quizStore';

const TakeQuiz = () => {
    const { questions, userAnswers, setAnswer, calculateScore } = useQuizStore();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-12 h-12 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">No Questions Available</h2>
                <p className="text-slate-600 mb-8 max-w-md">
                    Your question bank is currently empty. Please add some questions first before taking the quiz.
                </p>
                <button
                    onClick={() => navigate('/create')}
                    className="px-6 py-3 bg-primary text-black cursor-pointer hover:text-white rounded-xl font-medium shadow-sm hover:bg-primary-600 transition-all"
                >
                    Go to Add Questions
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;

    const handleOptionSelect = (optionIndex) => {
        setAnswer(currentQuestion.id, optionIndex);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        calculateScore();
        navigate('/result');
    };

    const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(userAnswers).length;

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Quiz Header & Progress */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">
                            MCQ Practice Test
                        </h2>
                    </div>
                    <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-border shadow-sm">
                        {answeredCount} / {questions.length} Answered
                    </div>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        className="h-full bg-primary"
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden"
                >
                    <div className="p-8 md:p-10">
                        <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-8 leading-relaxed">
                            {currentQuestion.text}
                        </h3>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = userAnswers[currentQuestion.id] === index;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(index)}
                                        className={`w-full cursor-pointer text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${isSelected
                                                ? 'border-primary bg-primary/5 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]'
                                                : 'border-border hover:border-primary/40 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${isSelected
                                                        ? 'bg-primary text-black'
                                                        : 'bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary-600'
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <span
                                                className={`text-lg transition-colors ${isSelected ? 'text-primary-900 font-medium' : 'text-slate-700'
                                                    }`}
                                            >
                                                {option}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle className="w-6 h-6 text-primary" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className="bg-slate-50 p-6 border-t border-border flex justify-between items-center">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className={`flex items-center cursor-pointer gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentIndex === 0
                                ? 'text-slate-400 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-white border border-transparent hover:border-border shadow-sm'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Previous
                        </button>

                        {isLastQuestion ? (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-8 py-3 bg-primary text-black cursor-pointer rounded-xl font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                            >
                                Submit Quiz
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="flex cursor-pointer items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-md active:scale-95"
                            >
                                Next
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TakeQuiz;
