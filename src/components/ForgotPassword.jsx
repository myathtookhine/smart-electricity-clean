import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Field } from './ui/field';
import { Popup } from './ui/popup';

export function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { theme } = useTheme();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Countdown effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsButtonDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Format countdown time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate sending email (replace with actual API call)
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmation(true);
      
      // Start 60-second countdown
      setCountdown(60);
      setIsButtonDisabled(true);

      // Here you would make the actual API call to send reset email
      // The backend should send an email with username and temporary password
      console.log(`Password reset email would be sent to: ${email}`);
    }, 1000);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="h-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Back Button - Top Left */}
        <div className="absolute top-12 left-6 z-50">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Reset Password
            </h1>
            <p className="text-muted-foreground text-center">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Field label="Email Address">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className={error ? 'border-red-500 focus:border-red-500' : ''}
              />
            </Field>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Reset Button */}
            <div className="space-y-2">
              <Button 
                type="submit" 
                disabled={isLoading || isButtonDisabled} 
                width="full" 
                size="lg"
                className={isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Reset Password"
                )}
              </Button>
              
              {/* Countdown Timer */}
              {countdown > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    You can request another reset in <span className="font-medium text-primary">{formatTime(countdown)}</span>
                  </p>
                </div>
              )}
            </div>
          </form>

          {/* Back to Login */}
          <div className="text-center">
            <Button variant="link" type="button" onClick={onBack}>
              Back to Sign In
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

      {/* Confirmation Popup */}
      <Popup
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        type="success"
        icon={CheckCircle}
        title="Email Sent"
        description="A password reset email has been sent. You should receive your username and a temporary password within 60 seconds."
        primaryButton={{
          text: "Got it",
          onClick: handleCloseConfirmation,
        }}
      />
    </>
  );
}
