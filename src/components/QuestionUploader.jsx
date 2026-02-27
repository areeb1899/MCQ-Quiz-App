import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, FileText, Loader2, AlertCircle, ScanText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const QuestionUploader = ({ onExtracted }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const processImage = async (file) => {
        try {
            const result = await Tesseract.recognize(file, 'eng', {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                },
            });
            return result.data.text;
        } catch (err) {
            console.error('Tesseract Error:', err);
            throw new Error('Failed to extract text from image.');
        }
    };

    const processPDF = async (file) => {
        try {
            setProgress(10);
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                setProgress(10 + Math.round((i / pdf.numPages) * 80));
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            setProgress(100);
            return fullText;
        } catch (err) {
            console.error('PDF.js Error:', err);
            throw new Error('Failed to extract text from PDF.');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsProcessing(true);
        setError('');
        setProgress(0);
        setFileName(file.name);

        try {
            let extractedText = '';

            if (file.type.startsWith('image/')) {
                extractedText = await processImage(file);
            } else if (file.type === 'application/pdf') {
                extractedText = await processPDF(file);
            } else {
                throw new Error('Unsupported file format. Please upload JPG, PNG, or PDF.');
            }

            if (!extractedText.trim()) {
                throw new Error('No text could be found in the uploaded file.');
            }

            onExtracted(extractedText);
        } catch (err) {
            setError(err.message || 'An error occurred during extraction.');
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (isProcessing) return;

        const file = e.dataTransfer.files[0];
        if (file) {
            // Create a spoofed event object to match the onChange handler
            handleFileUpload({ target: { files: [file] } });
        }
    };

    return (
        <div className="w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 transition-all hover:border-primary/50 relative overflow-hidden group">

            {/* Background decoration */}
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

            <div
                className="relative z-10 flex flex-col items-center justify-center text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <AnimatePresence mode="wait">
                    {!isProcessing ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center w-full"
                        >
                            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-primary-500 ring-4 ring-primary-50">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Question File</h3>
                            <p className="text-slate-500 mb-6 max-w-sm">
                                Drag and drop your image (JPG, PNG) or PDF here, or click to browse. We'll extract the text automatically.
                            </p>

                            {error && (
                                <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm w-full max-w-md border border-red-100">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-left">{error}</span>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/jpeg, image/png, application/pdf"
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="px-6 py-3 bg-primary text-black hover:text-white font-medium rounded-xl hover:bg-primary-600 transition-colors cursor-pointer shadow-sm shadow-primary/20 flex items-center gap-2 active:scale-95"
                            >
                                <ScanText className="w-5 h-5" />
                                Select File
                            </label>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center w-full py-4"
                        >
                            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 text-primary-500">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                Extracting Text from <span className="text-primary-600 max-w-[200px] truncate">{fileName}</span>
                            </h3>

                            <div className="w-full max-w-sm mt-4">
                                <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                                    <span>Processing file...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-6 max-w-xs">
                                Depending on the image quality or PDF size, this might take a few moments. Please don't close this window.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default QuestionUploader;
