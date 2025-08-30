import {
  Zap,
  Cloud,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  Play,
  Pause,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { Alert } from "../ui/alert";
import { useTheme } from "../ThemeProvider";
import { useState } from "react";
import exampleImage from "../../assets/iso-home.png";
import SampleWeatherIcon from "../../assets/partly-cloudy-day-rain.svg";

export function HomePage() {
  const { theme, setTheme } = useTheme();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const notificationCount = 3; // Example notification count

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-2">
        <div className="flex items-center justify-between mb-2">
          {/* Center: Title and Text */}
          <div className="flex-1 text-left">
            <h1 className="text-2xl text-foreground font-semibold">
              Live Usage Monitor
            </h1>
            <p className="text-sm text-muted-foreground">Energy Management</p>
          </div>

          {/* Right: Notifications */}
          <div className="flex items-center relative">
            {/* Light/Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-300 mr-2"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Weather Information */}
      <div className="px-6 mb-6">
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Weather Icon */}
              <div className="w-16 h-16 bg-primary/10 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-primary/20 dark:border-slate-700">
                <img
                  src={SampleWeatherIcon}
                  alt="Weather icon"
                  className="w-16 h-16"
                />
              </div>

              {/* Weather Info */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg font-semibold text-foreground">
                    22°C
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Partly cloudy conditions
                </p>
              </div>
            </div>

            {/* View More Button */}
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors">
              <span>More</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Smart Home Visualization */}
      <div className="px-6 mb-0 flex justify-center home-image-wrapper">
        <div className="w-full max-w-sm relative pb-20">
          {/* Animation on/off switch */}
          {/* <div className="absolute top-2 left-0 z-10">
            <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 shadow-lg">
              <div className="flex items-center space-x-1">
                {isAnimationEnabled ? (
                  <Play className="w-4 h-4 text-green-500" />
                ) : (
                  <Pause className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-xs font-medium text-foreground">
                  {isAnimationEnabled ? "On" : "Off"}
                </span>
              </div>
              <Switch
                checked={isAnimationEnabled}
                onCheckedChange={setIsAnimationEnabled}
                className="scale-75"
              />
            </div>
          </div> */}

          <img
            src={exampleImage}
            alt="Isometric smart home with solar panels and electric car charging station"
            className="w-full h-auto rounded-2xl"
          />

          {/* Overlay Labels and Lines */}
          <div className="absolute inset-0">
            {/* Solar Panel Label - Top Center */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg">
                <div className="text-sm font-bold text-foreground">6.5 kW</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Solar Panel
                </div>
              </div>
              {/* Direct connector line pointing to solar panels on roof */}
              <div className="solar-connector">
                <div className="line-vertical"></div>
                <div className="connector-dot"></div>
                {isAnimationEnabled && <div className="animated-dot"></div>}
              </div>
            </div>

            {/* Grid Export Label - Under image, left side */}
            <div className="absolute top-80 left-0 mt-6">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg">
                <div className="text-sm font-bold text-green-500">+1.2 kW</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Grid Export
                </div>
              </div>
              {/* Bent connector line pointing to grid lines on left side */}
              <div className="grid-connector">
                <div className="line-up"></div>
                <div className="line-right"></div>
                <div className="line-up-final"></div>
                <div className="connector-dot green"></div>
                {isAnimationEnabled && <div className="animated-dot"></div>}
              </div>
            </div>

            {/* Charging Station Label - Under image, center */}
            <div className="absolute top-80 left-1/2 transform -translate-x-1/2 mt-6">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg">
                <div className="text-sm font-bold text-foreground">11 kW</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Invertor
                </div>
              </div>
              {/* Bent connector line pointing to charging station */}
              <div className="charger-connector">
                <div className="line-up"></div>
                <div className="line-right"></div>
                <div className="line-up-final"></div>
                <div className="connector-dot"></div>
                {isAnimationEnabled && <div className="animated-dot"></div>}
              </div>
            </div>

            {/* Electric Car Label - Under image, right side */}
            <div className="absolute top-80 right-0 mt-6">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg">
                <div className="text-sm font-bold text-foreground">7.2 kW</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Electric Car
                </div>
              </div>
              {/* Bent connector line pointing to electric car */}
              <div className="car-connector">
                <div className="line-up"></div>
                <div className="line-left"></div>
                <div className="line-up-final"></div>
                <div className="connector-dot"></div>
                {isAnimationEnabled && <div className="animated-dot"></div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strom-ready Mode Alert */}
      <div className="px-6 mb-6">
        <Alert
          type="neutral"
          title="Strom-ready Mode : Disabled"
          message="Please check in the settings to enable!"
          customIcon={Zap}
          showIcon={true}
          showMessage={true}
        />
      </div>
    </div>
  );
}
