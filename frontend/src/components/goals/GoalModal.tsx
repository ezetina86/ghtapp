import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { CreateGoalData, Goal } from "../../types/goal";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalData) => Promise<void>;
  initialData?: Goal;
  isLoading?: boolean;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateGoalData>({
    title: "",
    description: "",
    goalType: "monthly",
    targetValue: 0,
    targetUnit: "minutes",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || "",
        goalType: initialData.goalType,
        targetValue: initialData.targetValue,
        targetUnit: initialData.targetUnit,
        startDate: new Date(initialData.startDate).toISOString().split("T")[0],
        endDate: initialData.endDate
          ? new Date(initialData.endDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      // Reset form when opening for create
      setFormData({
        title: "",
        description: "",
        goalType: "monthly",
        targetValue: 10,
        targetUnit: "pages",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Goal" : "Set New Goal"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Goal Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Read 30 minutes daily"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Frequency
            </label>
            <select
              value={formData.goalType}
              onChange={(e) =>
                setFormData({ ...formData, goalType: e.target.value as any })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Target Unit
            </label>
            <select
              value={formData.targetUnit}
              onChange={(e) =>
                setFormData({ ...formData, targetUnit: e.target.value as any })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            >
              <option value="minutes">Minutes</option>
              <option value="pages">Pages</option>
              <option value="books">Books</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Target Value
          </label>
          <input
            type="number"
            min="1"
            value={formData.targetValue}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetValue: parseInt(e.target.value) || 0,
              })
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
          <Input
            label="End Date (Optional)"
            type="date"
            value={formData.endDate || ""}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : initialData
                ? "Update Goal"
                : "Create Goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
