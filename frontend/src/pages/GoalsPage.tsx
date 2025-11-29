import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import { GoalCard } from "../components/goals/GoalCard";
import { GoalModal } from "../components/goals/GoalModal";
import { useGoalStore } from "../store/goalStore";
import type { CreateGoalData, Goal } from "../types/goal";

export const GoalsPage: React.FC = () => {
  const { goals, fetchGoals, createGoal, updateGoal, deleteGoal, isLoading } =
    useGoalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreateGoal = async (data: CreateGoalData) => {
    try {
      await createGoal(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create goal:", error);
    }
  };

  const handleUpdateGoal = async (data: CreateGoalData) => {
    if (!editingGoal) return;
    try {
      await updateGoal(editingGoal.id, data);
      setIsModalOpen(false);
      setEditingGoal(undefined);
    } catch (error) {
      console.error("Failed to update goal:", error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoal(id);
      } catch (error) {
        console.error("Failed to delete goal:", error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingGoal(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const activeGoals = goals.filter((g) => g.isActive && !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reading Goals</h1>
          <p className="text-gray-400">
            Set targets and track your reading achievements
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Goal</span>
        </Button>
      </div>

      {isLoading && goals.length === 0 ? (
        <div className="text-center text-gray-400 py-12">Loading goals...</div>
      ) : (
        <>
          {/* Active Goals */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-neon-cyan rounded-full mr-2"></span>
              Active Goals
            </h2>
            {activeGoals.length === 0 ? (
              <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">
                  You don't have any active goals yet.
                </p>
                <Button onClick={openCreateModal} variant="secondary">
                  Set Your First Goal
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={openEditModal}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Completed Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
        initialData={editingGoal}
        isLoading={isLoading}
      />
    </div>
  );
};
