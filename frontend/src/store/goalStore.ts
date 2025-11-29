import { create } from "zustand";
import { api } from "../services/api";
import type { Goal, CreateGoalData, UpdateGoalData } from "../types/goal";

interface GoalState {
  goals: Goal[];
  currentGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
  fetchGoals: (active?: boolean) => Promise<void>;
  fetchGoalProgress: (id: string) => Promise<void>;
  createGoal: (data: CreateGoalData) => Promise<void>;
  updateGoal: (id: string, data: UpdateGoalData) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  currentGoal: null,
  isLoading: false,
  error: null,

  fetchGoals: async (active) => {
    set({ isLoading: true, error: null });
    try {
      const params = active !== undefined ? `?active=${active}` : "";
      const response = await api.get(`/goals${params}`);
      set({ goals: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchGoalProgress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/goals/${id}/progress`);
      set({ currentGoal: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createGoal: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/goals", data);
      set((state) => ({
        goals: [response.data, ...state.goals],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateGoal: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/goals/${id}`, data);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? response.data : g)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/goals/${id}`);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
