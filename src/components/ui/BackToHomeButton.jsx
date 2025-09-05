import { Home } from "lucide-react";

export function BackToHomeButton({ onGoHome, className = "" }) {
  return (
    <button
      onClick={onGoHome}
      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-transparent border-0 border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary rounded-md font-semibold transition-all duration-300 hover:bg-primary/5 ${className}`}
    >
      <Home className="w-5 h-5 mr-3" />
      <span>Back to Home</span>
    </button>
  );
}
