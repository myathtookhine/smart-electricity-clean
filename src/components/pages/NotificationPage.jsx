import { 
  Bell, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Battery, 
  BatteryLow, 
  Zap, 
  Car, 
  Cloud, 
  Shield, 
  Key,
  Info
} from "lucide-react";

export function NotificationPage({ onPageChange }) {
  const handleBack = () => {
    if (onPageChange) {
      onPageChange("home");
    }
  };

  // Dummy notification data organized by date
  const notificationsByDate = {
    "Today": [
      {
        id: 1,
        type: "danger",
        icon: AlertTriangle,
        title: "Storm Alert",
        message: "Severe weather warning! StormReady mode activated automatically.",
        time: "2 min ago",
        isRead: false
      },
      {
        id: 2,
        type: "success",
        icon: Battery,
        title: "Battery Fully Charged",
        message: "Home battery has reached 100% capacity.",
        time: "15 min ago",
        isRead: false
      },
      {
        id: 3,
        type: "warning",
        icon: BatteryLow,
        title: "Low Battery Warning",
        message: "Home battery level is below 20%. Consider charging soon.",
        time: "1 hour ago",
        isRead: true
      },
      {
        id: 4,
        type: "info",
        icon: Car,
        title: "EV Charging Complete",
        message: "Your electric vehicle has finished charging (100%).",
        time: "3 hours ago",
        isRead: true
      }
    ],
    "Yesterday": [
      {
        id: 5,
        type: "success",
        icon: CheckCircle,
        title: "Password Reset Successful",
        message: "Your account password has been updated successfully.",
        time: "8:30 PM",
        isRead: true
      },
      {
        id: 6,
        type: "info",
        icon: Cloud,
        title: "Weather Advisory",
        message: "Cloudy weather expected. Good time to charge battery from grid.",
        time: "2:15 PM",
        isRead: true
      },
      {
        id: 7,
        type: "success",
        icon: Zap,
        title: "Solar Panel Peak Production",
        message: "Solar panels generating maximum power (6.5kW).",
        time: "12:45 PM",
        isRead: true
      },
      {
        id: 8,
        type: "neutral",
        icon: Shield,
        title: "System Update",
        message: "Smart energy system updated to version 2.1.3.",
        time: "9:00 AM",
        isRead: true
      }
    ],
    "9 Sep 2025": [
      {
        id: 9,
        type: "info",
        icon: Info,
        title: "Monthly Report Ready",
        message: "Your August energy usage report is now available.",
        time: "6:00 PM",
        isRead: true
      },
      {
        id: 10,
        type: "success",
        icon: Zap,
        title: "Grid Export Milestone",
        message: "You've exported 1000 kWh to the grid this month!",
        time: "2:30 PM",
        isRead: true
      },
      {
        id: 11,
        type: "warning",
        icon: AlertTriangle,
        title: "Maintenance Reminder",
        message: "Solar panel cleaning recommended for optimal performance.",
        time: "10:15 AM",
        isRead: true
      }
    ],
    "8 Sep 2025": [
      {
        id: 12,
        type: "info",
        icon: Car,
        title: "EV Charging Scheduled",
        message: "Electric vehicle charging will start at 11 PM (off-peak hours).",
        time: "7:45 PM",
        isRead: true
      },
      {
        id: 13,
        type: "success",
        icon: Battery,
        title: "Battery Health Check",
        message: "Home battery health: Excellent (98% efficiency).",
        time: "3:20 PM",
        isRead: true
      }
    ],
    "7 Sep 2025": [
      {
        id: 14,
        type: "neutral",
        icon: Key,
        title: "Security Update",
        message: "Two-factor authentication has been enabled for your account.",
        time: "4:10 PM",
        isRead: true
      },
      {
        id: 15,
        type: "info",
        icon: Cloud,
        title: "Weather Forecast",
        message: "Sunny weekend ahead - perfect for solar energy generation!",
        time: "8:00 AM",
        isRead: true
      }
    ]
  };

  const getIconColor = (type) => {
    switch (type) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "success":
        return "text-green-500";
      case "info":
        return "text-blue-500";
      case "neutral":
      default:
        return "text-gray-500";
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "danger":
        return "bg-red-50 dark:bg-red-950/20";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/20";
      case "success":
        return "bg-green-50 dark:bg-green-950/20";
      case "info":
        return "bg-blue-50 dark:bg-blue-950/20";
      case "neutral":
      default:
        return "bg-gray-50 dark:bg-gray-950/20";
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          
          {/* Title */}
          <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
          
          {/* Empty space for balance */}
          <div className="w-9"></div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 pb-6">
        <div className="space-y-6">
          {Object.entries(notificationsByDate).map(([date, notifications]) => (
            <div key={date}>
              {/* Date Header */}
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
                {date}
              </h2>
              
              {/* Notifications for this date */}
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`
                        p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50
                        ${getBgColor(notification.type)}
                        ${notification.isRead ? 'border-border/50' : 'border-border'}
                        ${!notification.isRead ? 'shadow-sm' : ''}
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className={`
                          p-2 rounded-full shrink-0
                          ${getBgColor(notification.type)}
                        `}>
                          <IconComponent className={`w-5 h-5 ${getIconColor(notification.type)}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className={`
                              text-sm font-semibold 
                              ${!notification.isRead 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-600 dark:text-gray-300'}
                            `}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-muted-foreground ml-2 shrink-0">
                              {notification.time}
                            </span>
                          </div>
                          <p className={`
                            text-sm leading-relaxed
                            ${!notification.isRead 
                              ? 'text-gray-700 dark:text-gray-200' 
                              : 'text-gray-500 dark:text-gray-400'}
                          `}>
                            {notification.message}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state message at bottom */}
        <div className="text-center mt-8 py-8">
          <p className="text-muted-foreground text-sm">
            You're all caught up! No more notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
