import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, CheckCircle2, AlertCircle, FileText, UploadCloud, Edit2, XCircle } from 'lucide-react';
import useQuizStore from '../stores/quizStore';
import QuestionUploader from '../components/QuestionUploader';
import { parseExtractedText } from '../utils/textParser';

const CreateQuiz = () => {
    const { questions, addQuestion, removeQuestion, updateQuestion } = useQuizStore();

    // Form State
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctOption, setCorrectOption] = useState(0);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [editingId, setEditingId] = useState(null);

    // UI State
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'upload'

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleExtracted = (rawText) => {
        const parsed = parseExtractedText(rawText);

        if (parsed?.error) {
            setError(parsed.error);
            // Fallback: put everything in question text so they can manually cut/paste
            setQuestionText(parsed.rawText);
        } else if (parsed) {
            setQuestionText(parsed.questionText);
            setOptions(parsed.options);
            setCorrectOption(0);
            setError('');
            setSuccessMsg('Text extracted! Please review, select the correct option, and save.');
            setActiveTab('manual'); // Switch to manual tab to let them review
        }
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        setSuccessMsg(''); // Clear success when trying to save

        if (!questionText.trim()) {
            setError('Please enter a question.');
            return;
        }
        if (options.some((opt) => !opt.trim())) {
            setError('Please fill in all 4 options.');
            return;
        }

        if (editingId) {
            updateQuestion(editingId, {
                text: questionText,
                options: [...options],
                correctOption,
            });
            setSuccessMsg('Question updated successfully!');
        } else {
            addQuestion({
                text: questionText,
                options: [...options],
                correctOption,
            });
            setSuccessMsg('Question saved successfully!');
        }

        // Reset form
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectOption(0);
        setEditingId(null);
        setError('');

        // Clear success msg after 3s
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleEditQuestion = (question) => {
        setEditingId(question.id);
        setQuestionText(question.text);
        setOptions([...question.options]);
        setCorrectOption(question.correctOption);
        setActiveTab('manual');
        setError('');
        setSuccessMsg('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectOption(0);
        setError('');
        setSuccessMsg('');
    };

    return (
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            {/* Input Section (Left) */}
            <div className="flex flex-col gap-6">

                {/* Mode Selector Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => { setActiveTab('manual'); setError(''); setSuccessMsg(''); }}
                        className={`flex-1 flex items-center justify-center cursor-pointer gap-2 py-3 rounded-lg font-medium transition-all ${activeTab === 'manual'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Manual Entry
                    </button>
                    <button
                        onClick={() => { setActiveTab('upload'); setError(''); setSuccessMsg(''); }}
                        className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-3 rounded-lg font-medium transition-all ${activeTab === 'upload'
                            ? 'bg-white text-primary-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        <UploadCloud className="w-4 h-4 " />
                        Extract from Image / PDF
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'upload' ? (
                        <motion.div
                            key="upload-tab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <QuestionUploader onExtracted={handleExtracted} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="manual-tab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-sm border border-border p-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                {editingId ? (
                                    <>
                                        <Edit2 className="text-primary-600" />
                                        Edit Details
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="text-primary-600" />
                                        Add Details
                                    </>
                                )}
                            </h2>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-3 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>{error}</div>
                                </div>
                            )}

                            {successMsg && (
                                <div className="mb-6 p-4 bg-success/10 border border-success/20 text-success-800 rounded-xl flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 className="w-5 h-5" />
                                    {successMsg}
                                </div>
                            )}

                            <form onSubmit={handleAddQuestion} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Question Text
                                    </label>
                                    <textarea
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        placeholder="Type or paste the question here..."
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-32"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-700 flex justify-between items-center">
                                        <span>Options</span>
                                        <span className="text-xs text-slate-400 font-normal">Select the circle for the correct answer</span>
                                    </label>

                                    <div className="grid gap-3">
                                        {options.map((option, index) => (
                                            <div key={index} className="flex items-center gap-3 group">
                                                <button
                                                    type="button"
                                                    onClick={() => setCorrectOption(index)}
                                                    className={`flex-shrink-0 w-8 h-8 rounded-full cursor-pointer border-2 flex items-center justify-center transition-all ${correctOption === index
                                                        ? 'border-success bg-success text-black scale-110 shadow-sm'
                                                        : 'border-slate-300 hover:border-success/50 group-hover:bg-slate-50'
                                                        }`}
                                                    title="Mark as correct option"
                                                >
                                                    {correctOption === index && <CheckCircle2 className="w-5 h-5" />}
                                                </button>
                                                <div className="relative w-full">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                                                        {String.fromCharCode(65 + index)}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                                        placeholder={`Option ${index + 1}`}
                                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${correctOption === index
                                                            ? 'border-success/50 bg-success/5 text-success-900 placeholder:text-success/40 font-medium'
                                                            : 'border-border focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-primary text-black hover:text-white cursor-pointer font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        {editingId ? <CheckCircle2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                                        {editingId ? 'Update Question' : 'Save to Question Bank'}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="px-6 py-4 bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer font-semibold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* List Section (Right) */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-[calc(100vh-8rem)] sticky top-24 flex flex-col">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Question Bank</h2>
                        <p className="text-sm text-slate-500 mt-1 ">Review and manage your questions</p>
                    </div>
                    <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-primary-200">
                        {questions.length} Total
                    </span>
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 flex-grow  custom-scrollbar">
                    <AnimatePresence>
                        {questions.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-slate-400 pb-12"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <FileText className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="font-medium text-slate-500">No questions added yet.</p>
                                <p className="text-sm mt-1">Start by adding one manually or extracting from a file!</p>
                            </motion.div>
                        ) : (
                            questions.map((q, i) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                    className="bg-white p-5 rounded-xl border border-border shadow-sm group hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h4 className="font-bold text-slate-800 break-words flex-1 leading-relaxed">
                                            <span className="text-primary-500 mr-2 bg-primary-50 px-2 py-0.5 rounded text-sm">
                                                Q{i + 1}
                                            </span>
                                            {q.text}
                                        </h4>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditQuestion(q)}
                                                className="text-slate-400 cursor-pointer hover:text-primary-600 hover:bg-primary-50 transition-colors p-2 rounded-lg flex-shrink-0"
                                                title="Edit Question"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeQuestion(q.id)}
                                                className="text-slate-400 cursor-pointer hover:text-destructive hover:bg-red-50 transition-colors p-2 rounded-lg flex-shrink-0"
                                                title="Delete Question"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 cursor-pointer text-sm">
                                        {q.options.map((opt, optIdx) => (
                                            <div
                                                key={optIdx}
                                                className={`px-3 py-2 rounded-lg truncate flex items-center gap-2 ${q.correctOption === optIdx
                                                    ? 'bg-success/10 text-success-800 font-bold border border-success/30 ring-1 ring-success/20'
                                                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                                                    }`}
                                            >
                                                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${q.correctOption === optIdx ? 'bg-success text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </span>
                                                <span className="truncate">{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CreateQuiz;
