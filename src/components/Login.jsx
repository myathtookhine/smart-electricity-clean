import React, { useState } from 'react';
import { Zap, LockKeyhole, User, Moon, Sun } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from './ThemeProvider';
import { Input } from './ui/input';
import { PasswordInput } from './ui/password-input';
import { Button } from './ui/button';
import { Field } from './ui/field';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading time
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Light/Dark Mode Toggle - Top Right */}
      <div className="absolute top-12 right-6 z-50">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-foreground/10 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border border-foreground/10 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border border-foreground/10 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center mb-24">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue to Dura App
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <Field label="Username">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </Field>

          {/* Password Field */}
          <Field label="Password">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Field>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            width="full"
            size="lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Forgot Password */}
          <div className="text-center">
            <Button variant="link" type="button">
              Forgot password?
            </Button>
          </div>
        </form>

        {/* Register Section */}
        <div className="text-center space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                Don't have an account?
              </span>
            </div>
          </div>

          <Button type="button" variant="secondary" width="full" size="lg">
            Create Account
          </Button>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4">
          <p className="text-muted-foreground text-xs">
            © 2025 Dura App. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
