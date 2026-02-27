const fs = require('fs');

const parseExtractedText = (text) => {
    if (!text) return null;

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const questions = [];
    let currentQuestion = null;

    const questionRegex = /^(?:Q|q)?\s*(\d+)[\.\)\-\:]\s*(.*)/;
    const optionRegex = /^(?:\()?([A-D]|[a-d]|[1-4])[\.\)\-\:]\s*(.*)/i;
    const answerRegex = /^(?:answer|ans|correct(?: option)?|key)[\s\:]+([A-D]|[a-d]|[1-4])/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const ansMatch = line.match(answerRegex);
        if (ansMatch && currentQuestion) {
            const char = ansMatch[1].toUpperCase();
            let answerIndex = 0;
            if (['A', 'B', 'C', 'D'].includes(char)) {
                answerIndex = char.charCodeAt(0) - 65;
            } else if (['1', '2', '3', '4'].includes(char)) {
                answerIndex = parseInt(char, 10) - 1;
            }
            currentQuestion.extractedCorrectOption = answerIndex;
            continue;
        }

        const qMatch = line.match(questionRegex);
        if (qMatch) {
            if (currentQuestion && currentQuestion.text) {
                questions.push(currentQuestion);
            }
            currentQuestion = {
                text: qMatch[2] ? qMatch[2] : '',
                options: [],
                currentOptionText: '',
                extractedCorrectOption: null
            };
            continue;
        }

        const optMatch = line.match(optionRegex);
        if (optMatch && currentQuestion) {
            if (currentQuestion.currentOptionText) {
                currentQuestion.options.push(currentQuestion.currentOptionText);
            }
            currentQuestion.currentOptionText = optMatch[2] ? optMatch[2] : '';
            continue;
        }

        if (currentQuestion) {
            if (currentQuestion.currentOptionText !== '') {
                currentQuestion.currentOptionText += ' ' + line;
            } else {
                currentQuestion.text += (currentQuestion.text ? ' ' : '') + line;
            }
        }
    }

    if (currentQuestion) {
        if (currentQuestion.currentOptionText) {
            currentQuestion.options.push(currentQuestion.currentOptionText);
            delete currentQuestion.currentOptionText;
        }
        if (currentQuestion.text) {
            questions.push(currentQuestion);
        }
    }

    const finalQuestions = questions.map(q => {
        let opts = [...q.options];
        delete q.currentOptionText;
        while (opts.length < 4) {
            opts.push('');
        }
        if (opts.length > 4) {
            opts = opts.slice(0, 4);
        }
        return {
            text: q.text,
            options: opts,
            correctOption: q.extractedCorrectOption !== null ? q.extractedCorrectOption : 0
        };
    });

    if (finalQuestions.length === 0) {
        return {
            error: "No distinct questions with options could be extracted.",
            rawText: text,
            isBulk: false
        };
    }

    return { questions: finalQuestions, isBulk: true, rawText: text };
};

const text1 = `
1. What is the capital of India? 2. Who is known as the Father of the Nation in India?
A) Mumbai A) Jawaharlal Nehru
B) New Delhi B) Subhas Chandra Bose
C) Kolkata C) Mahatma Gandhi
D) Chennai D) Bhagat Singh
Answer: B) New Delhi Answer: C) Mahatma Gandhi
`;

const text2 = `
1. What is the capital of India?
A) Mumbai
B) New Delhi
C) Kolkata
D) Chennai
Answer: B) New Delhi
2. Who is known as the Father of the Nation
in India?
A) Jawaharlal Nehru
B) Subhas Chandra Bose
C) Mahatma Gandhi
D) Bhagat Singh
Answer: C) Mahatma Gandhi
`;

console.log("TEXT 1:", JSON.stringify(parseExtractedText(text1), null, 2));
console.log("TEXT 2:", JSON.stringify(parseExtractedText(text2), null, 2));

