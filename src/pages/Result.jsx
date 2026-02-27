import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Trophy,
    RotateCcw,
    Home,
    CheckCircle2,
    XCircle,
    MinusCircle,
    Share2
} from 'lucide-react';
import useQuizStore from '../stores/quizStore';
import { toBlob } from 'html-to-image';
import toast from 'react-hot-toast';

const Result = () => {
    const { questions, userAnswers, currentScore, resetQuiz, calculateScore } = useQuizStore();
    const navigate = useNavigate();
    const scoreCardRef = useRef(null);
    const [isSharing, setIsSharing] = useState(false);

    // Ensure score is up-to-date
    useEffect(() => {
        calculateScore();
    }, [calculateScore, userAnswers]);

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">No Quiz Data</h2>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    Return Home
                </button>
            </div>
        );
    }

    const handleRetake = () => {
        resetQuiz();
        navigate('/quiz');
    };

    const percentage = Math.round((currentScore / questions.length) * 100);

    let resultMessage = "Good Effort!";
    let resultColor = "text-primary-600";
    let bgGradient = "from-primary-500 to-primary-600";

    if (percentage >= 80) {
        resultMessage = "Excellent Work!";
        resultColor = "text-success-600";
        bgGradient = "from-success-500 to-success-600";
    } else if (percentage < 50) {
        resultMessage = "Keep Practicing!";
        resultColor = "text-orange-600";
        bgGradient = "from-orange-500 to-orange-600";
    }

    const handleShareImage = async () => {
        if (!scoreCardRef.current || isSharing) return;

        const toastId = toast.loading("Generating your score card...");
        setIsSharing(true);

        try {
            const blob = await toBlob(scoreCardRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 2, // better quality
                filter: (node) => {
                    // prevent data-html2canvas-ignore elements from being generated
                    if (node?.hasAttribute && node.hasAttribute('data-html2canvas-ignore')) {
                        return false;
                    }
                    return true;
                }
            });

            if (!blob) throw new Error("Could not generate image blob");

            const file = new File([blob], 'quiz-score.png', { type: 'image/png' });
            toast.dismiss(toastId);

            // Check if Web Share API with files is supported
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'My Quiz Result',
                        files: [file]
                    });
                } catch (shareErr) {
                    console.error("Native share failed:", shareErr);
                    if (shareErr.name !== 'AbortError') {
                        // Fallback to download
                        downloadBlob(blob);
                    }
                }
            } else {
                console.warn("Web Share API not supported on this device/browser for files. Falling back to download.");
                downloadBlob(blob);
            }
        } catch (err) {
            console.error('Error in handleShareImage:', err);
            toast.dismiss(toastId);
            toast.error(err.message || "Failed to share or download the image");
        } finally {
            setIsSharing(false);
        }
    };

    const downloadBlob = (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quiz-score.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Score card downloaded!");
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Score Header */}
            <motion.div
                ref={scoreCardRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden mb-8"
            >
                <div className={`h-32 bg-gradient-to-r ${bgGradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
                </div>

                <div className="px-8 pb-10 pt-4 relative -mt-16 text-center">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full p-2 shadow-lg mb-6">
                        <div className={`w-full h-full rounded-full border-4 flex flex-col items-center justify-center ${resultColor.replace('text', 'border')}`}>
                            <span className={`text-4xl font-extrabold ${resultColor}`}>
                                {currentScore}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                                Score
                            </span>
                        </div>
                    </div>

                    <h1 className={`text-3xl font-extrabold mb-2 ${resultColor}`}>
                        {resultMessage}
                    </h1>
                    <p className="text-slate-600 text-lg mb-8">
                        You scored <strong className="text-slate-900">{currentScore} marks</strong> out of a possible {questions.length}.
                    </p>

                    <div className="flex items-center justify-center gap-4" data-html2canvas-ignore>
                        <button
                            onClick={handleRetake}
                            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Retake Quiz
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <Home className="w-5 h-5" />
                            Home Page
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-200/60" data-html2canvas-ignore>
                        <p className={`text-sm font-semibold uppercase tracking-wider ${resultColor}`}>Share your result</p>
                        <button
                            onClick={handleShareImage}
                            disabled={isSharing}
                            className={`flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl transition-all active:scale-95 ${isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50 hover:text-primary-600'}`}
                        >
                            <Share2 className="w-4 h-4" />
                            {isSharing ? 'Generating...' : 'Share Score Image'}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Review Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 ml-2">Review Answers</h2>

                {questions.map((q, idx) => {
                    const userAnswer = userAnswers[q.id];
                    const isCorrect = userAnswer === q.correctOption;
                    const isUnanswered = userAnswer === undefined;

                    return (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="mt-1 flex-shrink-0">
                                    {isCorrect ? (
                                        <CheckCircle2 className="w-7 h-7 text-success-500" />
                                    ) : isUnanswered ? (
                                        <MinusCircle className="w-7 h-7 text-slate-400" />
                                    ) : (
                                        <XCircle className="w-7 h-7 text-destructive" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                                            Question {idx + 1}
                                        </span>
                                        {!isCorrect && !isUnanswered && (
                                            <span className="px-2 py-0.5 bg-destructive/10 text-destructive-700 text-xs font-bold rounded">
                                                Incorrect
                                            </span>
                                        )}
                                        {isUnanswered && (
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">
                                                Skipped
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">
                                        {q.text}
                                    </h3>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 pl-11">
                                {q.options.map((opt, optIdx) => {
                                    const isThisCorrect = q.correctOption === optIdx;
                                    const isThisSelected = userAnswer === optIdx;

                                    let optStyles = "bg-slate-50 border-slate-200 text-slate-600";
                                    let icon = null;

                                    if (isThisCorrect) {
                                        optStyles = "bg-success/10 border-success/30 text-success-900 font-medium ring-1 ring-success/50";
                                        icon = <CheckCircle2 className="w-5 h-5 text-success-600 ml-auto" />;
                                    } else if (isThisSelected && !isThisCorrect) {
                                        optStyles = "bg-destructive/10 border-destructive/30 text-destructive-900 font-medium";
                                        icon = <XCircle className="w-5 h-5 text-destructive-500 ml-auto" />;
                                    }

                                    return (
                                        <div
                                            key={optIdx}
                                            className={`px-4 py-3 rounded-xl border flex items-center ${optStyles}`}
                                        >
                                            <span className="font-semibold opacity-70 w-6">
                                                {String.fromCharCode(65 + optIdx)}
                                            </span>
                                            <span>{opt}</span>
                                            {icon}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Result;
