import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
  stall?: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  tokens: { accessToken: string; refreshToken: string } | null;
  setUser: (user: User | null) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string } | null) => void;
  refreshTokens: () => Promise<boolean>;
  fetchMyTickets: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchE4Profile: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  logout: () => Promise<void> | void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // CART STATE
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // TICKETS STATE
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'bookingDate' | 'isExpired'>) => void;
  checkExpirations: () => void;

  // TOAST STATE
  toast: { message: string, visible: boolean } | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  image: any;
  bookingDate: number; // timestamp
  isExpired: boolean;
  qrData: string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      tokens: null,
      setTokens: (tokens) => set({ tokens }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: async () => {
        const { tokens } = useAppStore.getState();
        if (tokens?.refreshToken) {
          try {
            await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/auth/logout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken: tokens.refreshToken })
            });
          } catch (error) {
            console.error('SERVER LOGOUT FAILED:', error);
          }
        }
        set({ user: null, isAuthenticated: false, tokens: null });
      },
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // TOAST IMPLEMENTATION
      toast: null,
      showToast: (message) => set({ toast: { message, visible: true } }),
      hideToast: () => set({ toast: null }),

      // CART IMPLEMENTATION
      cart: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),

      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find(i => i.id === item.id);
        const newState = existingItem
          ? { cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
          : { cart: [...state.cart, { ...item, quantity: 1 }] };

        return { ...newState, toast: { message: `${item.name.toUpperCase()} ADDED TO CART!`, visible: true } };
      }),

      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter(i => i.id !== itemId)
      })),

      updateQuantity: (itemId, delta) => set((state) => ({
        cart: state.cart.map(i => {
          if (i.id === itemId) {
            const newQty = Math.max(1, i.quantity + delta);
            return { ...i, quantity: newQty };
          }
          return i;
        })
      })),

      clearCart: () => set({ cart: [] }),

      fetchProfile: async () => {
        const { tokens, refreshTokens, logout, setUser } = useAppStore.getState();
        if (!tokens?.accessToken) return;

        try {
          const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/profile', {
            headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
          });

          if (response.status === 401) {
            const refreshed = await refreshTokens();
            if (refreshed) {
              const { tokens: newTokens } = useAppStore.getState();
              const retryResponse = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/profile', {
                headers: { 'Authorization': `Bearer ${newTokens?.accessToken}` }
              });
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                setUser(data.user || data);
                return;
              }
            }
            logout();
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setUser(data.user || data);
          }
        } catch (error) {
          console.error("FETCH PROFILE FAILED:", error);
        }
      },

      updateProfile: async (name: string, email: string) => {
        const { tokens, refreshTokens, logout, setUser } = useAppStore.getState();
        if (!tokens?.accessToken) return false;

        try {
          const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/profile', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${tokens.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
          });

          if (response.status === 401) {
            const refreshed = await refreshTokens();
            if (refreshed) {
              const { tokens: newTokens } = useAppStore.getState();
              const retryResponse = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/profile', {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${newTokens?.accessToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
              });
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                setUser(data.user || data);
                return true;
              }
            }
            logout();
            return false;
          }

          if (response.ok) {
            const data = await response.json();
            setUser(data.user || data);
            return true;
          }
          return false;
        } catch (error) {
          console.error("UPDATE PROFILE FAILED:", error);
          return false;
        }
      },

      fetchE4Profile: async () => {
        const { tokens, refreshTokens, logout, setUser } = useAppStore.getState();
        if (!tokens?.accessToken) return;

        try {
          const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/profile/e4', {
            headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
          });

          if (response.status === 401) {
            const refreshed = await refreshTokens();
            if (refreshed) {
              const { tokens: newTokens } = useAppStore.getState();
              const retryResponse = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/profile/e4', {
                headers: { 'Authorization': `Bearer ${newTokens?.accessToken}` }
              });
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                setUser(data.user || data);
                return;
              }
            }
            logout();
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setUser(data.user || data);
          }
        } catch (error) {
          console.error("FETCH E4 PROFILE FAILED:", error);
        }
      },

      deleteAccount: async () => {
        const { tokens, refreshTokens, logout } = useAppStore.getState();
        if (!tokens?.accessToken) return false;

        try {
          const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/profile', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
          });

          if (response.status === 401) {
            const refreshed = await refreshTokens();
            if (refreshed) {
              const { tokens: newTokens } = useAppStore.getState();
              const retryResponse = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/profile', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${newTokens?.accessToken}` }
              });
              if (retryResponse.ok) {
                await logout();
                return true;
              }
            }
            logout();
            return false;
          }

          if (response.ok) {
            await logout();
            return true;
          }
          return false;
        } catch (error) {
          console.error("DELETE ACCOUNT FAILED:", error);
          return false;
        }
      },

      refreshTokens: async () => {
        const { tokens, logout, setTokens } = useAppStore.getState();
        if (!tokens?.refreshToken) return false;

        try {
          const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/auth/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: tokens.refreshToken })
          });

          const data = await response.json();
          if (response.ok && data.accessToken) {
            setTokens({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken || tokens.refreshToken
            });
            return true;
          } else {
            logout();
            return false;
          }
        } catch (error) {
          return false;
        }
      },

      fetchMyTickets: async () => {
        const { tokens, refreshTokens, logout } = useAppStore.getState();
        if (!tokens?.accessToken) return;

        try {
          const response = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/tickets/my-tickets', {
            headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
          });

          if (response.status === 401) {
            const refreshed = await refreshTokens();
            if (refreshed) {
              const { tokens: newTokens } = useAppStore.getState();
              const retryResponse = await fetch('https://xzanzkz0wl.execute-api.ap-south-1.amazonaws.com/api/tickets/my-tickets', {
                headers: { 'Authorization': `Bearer ${newTokens?.accessToken}` }
              });
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                set({ tickets: data.tickets || data });
                return;
              }
            }
            logout();
            return;
          }

          if (response.ok) {
            const data = await response.json();
            set({ tickets: data.tickets || data });
          }
        } catch (error) {
          console.error("FETCH TICKETS FAILED:", error);
        }
      },

      // TICKETS IMPLEMENTATION
      tickets: [],
      addTicket: (item) => set((state) => {
        const id = Math.random().toString(36).substring(7).toUpperCase();
        const bookingDate = Date.now();
        const newTicket: Ticket = {
          ...item,
          id,
          bookingDate,
          isExpired: false,
          qrData: `TKT-${id}-${bookingDate}`
        };
        return { tickets: [newTicket, ...state.tickets] };
      }),
      checkExpirations: () => set((state) => {
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        return {
          tickets: state.tickets.map(t => ({
            ...t,
            isExpired: now - t.bookingDate > ONE_DAY
          }))
        };
      }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
