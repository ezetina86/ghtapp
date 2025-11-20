import React from "react";
import { Modal } from "../ui/Modal";
import { SessionForm } from "./SessionForm";
import { useSessionStore } from "../../store/sessionStore";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createSession, isLoading } = useSessionStore();

  const handleSubmit = async (data: any) => {
    try {
      await createSession(data);
      onClose();
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Reading Session"
      size="md"
    >
      <SessionForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Modal>
  );
};
