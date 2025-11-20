import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../../store/authStore";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-dark-800/95 backdrop-blur-lg border-b border-neon-cyan/20 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold"
          >
            <span className="bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
              HabitFlux
            </span>
          </Link>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <UserCircleIcon className="w-8 h-8" />
              <span className="hidden sm:inline">
                {user?.displayName || user?.username}
              </span>
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-dark-700 border border-neon-cyan/20 shadow-lg shadow-neon-cyan/10 focus:outline-none">
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`${
                        active ? "bg-dark-600" : ""
                      } flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors`}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-dark-600" : ""
                      } flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors`}
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
};
