import React from "react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: boolean;
  color?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  icon: Icon,
  isUnlocked,
  color = "text-yellow-500",
}) => {
  return (
    <div
      className={`relative group p-4 rounded-xl border transition-all duration-300 ${
        isUnlocked
          ? "bg-gray-800/50 border-gray-700 hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          : "bg-gray-900/50 border-gray-800 opacity-50 grayscale"
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div
          className={`p-3 rounded-full bg-gray-800 ${isUnlocked ? "animate-float" : ""}`}
        >
          <Icon className={`w-8 h-8 ${isUnlocked ? color : "text-gray-500"}`} />
        </div>

        <div>
          <h4 className="font-bold text-white text-sm">{title}</h4>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
      </div>

      {isUnlocked && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-shine opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
    </div>
  );
};
