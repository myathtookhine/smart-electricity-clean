import { Home, BarChart3, Settings } from 'lucide-react';

export function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      {/* Liquid Glass Background */}
      <div className="mx-4 mb-4">
        <div
          className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-3xl px-0 py-2 shadow-2xl"
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <div className="flex justify-around items-center">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex flex-col items-center space-y-1 px-8 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary/20 backdrop-blur-md"
                      : "hover:bg-white/5 dark:hover:bg-white/10"
                  }`}
                  style={
                    isActive
                      ? {
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                        }
                      : {}
                  }
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/30 to-primary/20"
                      style={{
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                      }}
                    />
                  )}
                  <IconComponent
                    size={20}
                    className={`relative z-10 ${
                      isActive
                        ? "text-primary"
                        : "text-black/70 dark:text-white/60"
                    }`}
                  />
                  <span
                    className={`relative z-10 text-xs font-medium ${
                      isActive
                        ? "text-primary"
                        : "text-black/70 dark:text-white/60"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
