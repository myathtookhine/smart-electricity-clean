import { Settings, User, Bell, Shield, HelpCircle, Moon, Sun, Smartphone } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { Switch } from '../ui/switch';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-7 h-7 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">App Preferences</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        {/* Profile Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl text-card-foreground font-semibold">John Doe</h3>
              <p className="text-muted-foreground">john.doe@email.com</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Account Active</span>
              </div>
            </div>
          </div>
          <button className="w-full bg-muted/30 backdrop-blur-sm border border-border/50 rounded-2xl p-3 text-card-foreground font-medium hover:bg-muted/50 transition-all duration-300">
            Edit Profile
          </button>
        </div>

        {/* Theme Settings */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">Appearance</h3>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <Sun className="w-5 h-5 text-yellow-500" />
                </div>
              )}
              <div>
                <div className="text-card-foreground font-medium">Dark Mode</div>
                <div className="text-xs text-muted-foreground">
                  {theme === 'dark' ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </div>

        {/* Preferences Settings */}
        <div className="space-y-4">
          <h3 className="text-xl text-foreground font-semibold">Preferences</h3>
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 overflow-hidden">
            {[
              { icon: Bell, label: 'Notifications', subtitle: 'Alerts and reminders', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
              { icon: Shield, label: 'Privacy & Security', subtitle: 'Data protection settings', color: 'text-green-500', bgColor: 'bg-green-500/10' },
              { icon: Smartphone, label: 'Device Settings', subtitle: 'Connected devices', color: 'text-primary', bgColor: 'bg-primary/10' },
              { icon: HelpCircle, label: 'Help & Support', subtitle: 'FAQs and contact', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
            ].map((item, index) => (
              <button key={item.label} className={`w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-all duration-200 ${index !== 3 ? 'border-b border-border/30' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${item.bgColor} rounded-xl`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="text-card-foreground font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                  </div>
                </div>
                <div className="text-muted-foreground text-lg">›</div>
              </button>
            ))}
          </div>
        </div>

        {/* App Information */}
        <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-6 border border-border/30">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">About</h3>
          <div className="space-y-3">
            {[
              { label: 'Version', value: '1.0.0' },
              { label: 'Build', value: '2024.1' },
              { label: 'Last Updated', value: 'Dec 15, 2024' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center p-3 bg-muted/20 rounded-xl">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-card-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 font-semibold hover:from-red-500/30 hover:to-red-500/20 transition-all duration-300">
          Sign Out
        </button>
      </div>
    </div>
  );
}
