import React, { useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
  };

  const colors = {
    success: "bg-green-500/90",
    error: "bg-red-500/90",
    info: "bg-blue-500/90",
    warning: "bg-yellow-500/90",
  };

  const Icon = icons[type];

  return (
    <div
      className={`${colors[type]} backdrop-blur-sm text-white rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px] max-w-md animate-slide-in-right`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
        aria-label="Close"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
