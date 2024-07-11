import { create } from "zustand";

/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} email
 * @property {string} [displayName]
 * @property {string} [photoURL]
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {boolean} loading
 * @property {function(User|null): void} setUser
 * @property {function(boolean): void} setLoading
 */

/**
 * @type {import('zustand').StoreApi<AuthState>}
 */
const useAuthStore = create((set) => ({
	user: null,
	loading: true,
	setUser: (user) => set({ user, loading: false }),
	setLoading: (loading) => set({ loading }),
}));

export default useAuthStore;
