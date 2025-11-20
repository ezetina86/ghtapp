import React from "react";
import { Card } from "../components/ui/Card";
import { useAuthStore } from "../store/authStore";
import { UserCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      <Card variant="glass">
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta p-1">
              <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center">
                <UserCircleIcon className="w-20 h-20 text-neon-cyan" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Display Name
              </label>
              <p className="text-white text-lg">{user.displayName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <p className="text-white text-lg">{user.username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <p className="text-white text-lg flex items-center space-x-2">
                <EnvelopeIcon className="w-5 h-5" />
                <span>{user.email}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Member Since
              </label>
              <p className="text-white text-lg">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
