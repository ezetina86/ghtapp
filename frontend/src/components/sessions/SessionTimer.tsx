import React, { useState, useEffect } from "react";
import { PlayIcon, PauseIcon, StopIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { SessionForm } from "./SessionForm";
import { useSessionStore } from "../../store/sessionStore";

export const SessionTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createSession, isLoading } = useSessionStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsModalOpen(true);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSessionSubmit = async (data: any) => {
    try {
      await createSession(data);
      setIsModalOpen(false);
      setSeconds(0);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-bold text-white mb-4">Reading Timer</h3>
      <div className="text-5xl font-mono text-neon-cyan mb-8">
        {formatTime(seconds)}
      </div>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isActive && !isPaused
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isActive && !isPaused ? (
            <PauseIcon className="w-8 h-8 text-white" />
          ) : (
            <PlayIcon className="w-8 h-8 text-white" />
          )}
        </Button>
        {isActive && (
          <Button
            onClick={stopTimer}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600"
          >
            <StopIcon className="w-8 h-8 text-white" />
          </Button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Save Session"
      >
        <SessionForm
          onSubmit={handleSessionSubmit}
          isLoading={isLoading}
          initialData={{
            durationMinutes: Math.max(1, Math.round(seconds / 60)),
            startTime: new Date(Date.now() - seconds * 1000)
              .toISOString()
              .slice(0, 16),
          }}
        />
      </Modal>
    </div>
  );
};
