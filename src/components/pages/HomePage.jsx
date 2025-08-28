import { Zap, Cloud, ChevronRight } from "lucide-react";
import exampleImage from "../../assets/iso-home.png";
import SampleWeatherIcon from "../../assets/partly-cloudy-day-rain.svg";

export function HomePage() {
  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground font-semibold">
              Smart Electricity
            </h1>
            <p className="text-sm text-muted-foreground">Energy Management</p>
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
      <div className="px-6 mb-24 flex justify-center home-image-wrapper">
        <div className="w-full max-w-sm relative pb-20">
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
                <div className="animated-dot"></div>
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
                <div className="animated-dot"></div>
              </div>
            </div>

            {/* Charging Station Label - Under image, center */}
            <div className="absolute top-80 left-1/2 transform -translate-x-1/2 mt-6">
              <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2 py-1 text-center shadow-lg">
                <div className="text-sm font-bold text-foreground">11 kW</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Charger
                </div>
              </div>
              {/* Bent connector line pointing to charging station */}
              <div className="charger-connector">
                <div className="line-up"></div>
                <div className="line-right"></div>
                <div className="line-up-final"></div>
                <div className="connector-dot"></div>
                <div className="animated-dot"></div>
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
                <div className="animated-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
