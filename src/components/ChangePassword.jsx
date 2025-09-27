import React, { useState } from "react";
import { Eye, EyeOff, Lock, ArrowLeft, Check, AlertCircle } from "lucide-react";

export const ChangePassword = ({ onBack, onComplete }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock success
      onComplete?.();
    }, 1500);
  };

  const passwordStrength = (password) => {
    if (!password) return { score: 0, text: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = [
      { text: "Very Weak", color: "text-red-600 dark:text-red-400" },
      { text: "Weak", color: "text-orange-600 dark:text-orange-400" },
      { text: "Fair", color: "text-yellow-600 dark:text-yellow-400" },
      { text: "Good", color: "text-blue-600 dark:text-blue-400" },
      { text: "Strong", color: "text-green-600 dark:text-green-400" }
    ];
    
    return { score, ...levels[Math.min(score, 4)] };
  };

  const strength = passwordStrength(formData.newPassword);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-4 mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Change Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6">
        <div className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-lg border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.currentPassword ? "border-red-500" : "border-border"
                }`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-red-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.currentPassword}</span>
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-lg border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.newPassword ? "border-red-500" : "border-border"
                }`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        strength.score === 0 ? "bg-red-500 w-1/5" :
                        strength.score === 1 ? "bg-orange-500 w-2/5" :
                        strength.score === 2 ? "bg-yellow-500 w-3/5" :
                        strength.score === 3 ? "bg-blue-500 w-4/5" :
                        "bg-green-500 w-full"
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${strength.color}`}>
                    {strength.text}
                  </span>
                </div>
              </div>
            )}
            
            {errors.newPassword && (
              <p className="text-xs text-red-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.newPassword}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-lg border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.confirmPassword ? "border-red-500" : "border-border"
                }`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Submit Button */}
      <div className="px-6 py-6 border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span>{isLoading ? "Updating Password..." : "Update Password"}</span>
        </button>
      </div>
    </div>
  );
};