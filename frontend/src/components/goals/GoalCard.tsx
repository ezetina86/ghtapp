import React from "react";
import { CheckCircleIcon, TrophyIcon } from "@heroicons/react/24/solid";
import {
  ClockIcon,
  DocumentTextIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import type { Goal } from "../../types/goal";

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
}) => {
  const getIcon = () => {
    switch (goal.targetUnit) {
      case "minutes":
        return <ClockIcon className="w-5 h-5 text-neon-cyan" />;
      case "pages":
        return <DocumentTextIcon className="w-5 h-5 text-neon-lime" />;
      case "books":
        return <BookOpenIcon className="w-5 h-5 text-neon-magenta" />;
      default:
        return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getProgressColor = () => {
    if (goal.isCompleted) return "bg-green-500";
    if ((goal.progressPercentage || 0) > 75) return "bg-neon-lime";
    if ((goal.progressPercentage || 0) > 40) return "bg-neon-cyan";
    return "bg-neon-magenta";
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-all duration-300 relative group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-700/50 rounded-lg">{getIcon()}</div>
          <div>
            <h3 className="font-bold text-white text-lg">{goal.title}</h3>
            <p className="text-xs text-gray-400 capitalize">
              {goal.goalType} Goal • {goal.targetUnit}
            </p>
          </div>
        </div>
        {goal.isCompleted && (
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
        )}
      </div>

      {goal.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {goal.description}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">
            {goal.currentProgress} / {goal.targetValue}
          </span>
          <span className="text-white font-medium">
            {goal.progressPercentage}%
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${Math.min(goal.progressPercentage || 0, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-xs text-gray-500">
          Ends:{" "}
          {goal.endDate
            ? new Date(goal.endDate).toLocaleDateString()
            : "Ongoing"}
        </span>
        <div className="space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="text-xs text-neon-cyan hover:text-white transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="text-xs text-red-500 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
