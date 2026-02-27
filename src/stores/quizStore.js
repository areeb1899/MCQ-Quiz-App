import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useQuizStore = create(
    persist(
        (set) => ({
            questions: [],
            currentScore: 0,
            userAnswers: {},

            addQuestion: (question) =>
                set((state) => ({
                    questions: [
                        ...state.questions,
                        { ...question, id: Date.now().toString() },
                    ],
                })),

            removeQuestion: (id) =>
                set((state) => ({
                    questions: state.questions.filter((q) => q.id !== id),
                })),

            updateQuestion: (id, updatedQuestion) =>
                set((state) => ({
                    questions: state.questions.map((q) =>
                        q.id === id ? { ...q, ...updatedQuestion } : q
                    ),
                })),

            setAnswer: (questionId, optionIndex) =>
                set((state) => ({
                    userAnswers: {
                        ...state.userAnswers,
                        [questionId]: optionIndex,
                    },
                })),

            calculateScore: () =>
                set((state) => {
                    let score = 0;
                    state.questions.forEach((q) => {
                        if (state.userAnswers[q.id] === q.correctOption) {
                            score += 1; // Each question is 1 mark
                        }
                    });
                    return { currentScore: score };
                }),

            resetQuiz: () =>
                set({
                    currentScore: 0,
                    userAnswers: {},
                }),

            clearAllQuestions: () => set({ questions: [], currentScore: 0, userAnswers: {} }),
        }),
        {
            name: 'mcq-storage', // saves to local storage so questions persist
        }
    )
);

export default useQuizStore;
