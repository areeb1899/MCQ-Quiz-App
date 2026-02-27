import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            isTeacher: false,
            password: 'teacher123',
            login: (inputPassword) => {
                if (inputPassword === get().password) {
                    set({ isTeacher: true });
                    return true;
                }
                return false;
            },
            logout: () => set({ isTeacher: false }),
            changePassword: (newPassword) => set({ password: newPassword }),
            adminResetPassword: (secretCode, newPassword) => {
                if (secretCode === 'Areeb') {
                    set({ password: newPassword });
                    return true;
                }
                return false;
            }
        }),
        {
            name: 'auth-storage', // persist login state
        }
    )
);

export default useAuthStore;
