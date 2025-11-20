import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800/95 backdrop-blur-lg border-t border-neon-cyan/20 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <p className="text-sm text-gray-400">
            © {currentYear} HabitFlux. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-neon-cyan transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-neon-cyan transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-neon-cyan transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
