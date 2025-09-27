import React, { useState } from "react";
import { 
  CheckCircle, 
  Mail, 
  Key, 
  Download, 
  FileText, 
  ArrowRight,
  X
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";

export const GuidedHandoverModal = ({ isOpen, onClose, onPageChange }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose?.();
  };

  const handleChangePassword = () => {
    // Navigate to Settings > Account Settings > Change Password
    onPageChange?.('settings');
    onClose?.();
  };

  const handleDownloadPDF = () => {
    // Mock PDF download - in real app this would trigger actual download
    console.log("Download PDF handover document");
  };

  return (
    <>
      {/* Modal Overlay - positioned relative to phone mockup */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-3xl shadow-2xl border border-border/50 max-w-sm w-full max-h-[80vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-foreground">Welcome Setup</h1>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                You're Welcome!
              </h2>
              <p className="text-sm text-muted-foreground">
                Your system setup is complete. Let's secure your account and get you started.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Change Password Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Secure Your Account</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For your security, please change your temporary password to something unique and memorable. You can do this in your account settings.
              </p>
              <button
                onClick={handleChangePassword}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span>Go to Account Settings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PDF Download Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Digital Handover</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Download your complete system handover documentation including installation details, warranty information, and user guides.
              </p>
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <Download className="w-4 h-4 text-primary" />
                <span className="text-foreground">Download Handover PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};