import {
  User,
  ChevronLeft,
  ChevronRight,
  Edit,
  Lock,
  Mail,
  Phone,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useApp } from "../../../contexts/AppContext";
import { BackToHomeButton } from "../../ui/BackToHomeButton";
import { Button } from "../../ui/button";

export function AccountSettingsPage({ onBack, onNavigate, onGoHome }) {
  const { user, logout } = useApp();

  return (
    <div className="min-h-full bg-background">
      {/* Header with Back Button */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-muted/20 rounded-xl flex items-center justify-center hover:bg-muted/30 transition-all duration-300 mr-2"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">
              Account Settings
            </h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-8">
        {/* Account Info Card */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <UserCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl text-card-foreground font-semibold">
                {user?.name || "John Doe"}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                <Mail className="w-4 h-4" />
                <span>{user?.email || "john.doe@example.com"}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                <Phone className="w-4 h-4" />
                <span>{user?.phone || "+1 (555) 123-4567"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">
            Account Management
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate("edit-account")}
              className="w-full flex items-center justify-between py-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Edit className="w-5 h-5 text-primary" />
                </div>
                <span className="text-card-foreground">Edit Account Info</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onNavigate("change-password")}
              className="w-full flex items-center justify-between py-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <span className="text-card-foreground">Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <Button
            onClick={logout}
            width="full"
            size="lg"
            variant="link"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out My Account
          </Button>
        </div>

        {/* Back to Home Button */}
        {onGoHome && (
          <div className="mt-8">
            <BackToHomeButton onGoHome={onGoHome} />
          </div>
        )}
      </div>
    </div>
  );
}
