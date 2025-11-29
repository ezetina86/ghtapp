import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useNavigate } from "react-router-dom";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="bg-dark-800/50 backdrop-blur-lg p-8 rounded-xl border border-neon-cyan/20 shadow-lg shadow-neon-cyan/10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">HabitFlux</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-dark-700/50 border-neon-cyan/20 focus:border-neon-cyan"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-dark-700/50 border-neon-cyan/20 focus:border-neon-cyan"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
