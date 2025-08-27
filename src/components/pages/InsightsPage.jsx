import { BarChart3, PieChart, Activity, TrendingDown, TrendingUp } from 'lucide-react';

export function InsightsPage() {
  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground font-semibold">Energy Insights</h1>
            <p className="text-sm text-muted-foreground">Analytics & Reports</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        {/* Usage Trends Chart */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-card-foreground font-semibold">Usage Trends</h3>
            <div className="p-2 bg-green-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="h-40 bg-gradient-to-r from-green-500/10 to-primary/10 rounded-2xl flex items-center justify-center border border-border/20 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-muted-foreground text-sm">Interactive chart coming soon</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-center">
              <div className="text-2xl text-card-foreground font-bold">28.5 kWh</div>
              <div className="text-xs text-muted-foreground">Daily Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-green-500 font-bold flex items-center justify-center">
                <TrendingDown className="w-5 h-5 mr-1" />
                12%
              </div>
              <div className="text-xs text-muted-foreground">vs Last Month</div>
            </div>
          </div>
        </div>

        {/* Usage Breakdown */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-card-foreground font-semibold">Usage Breakdown</h3>
            <div className="p-2 bg-primary/10 rounded-xl">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Heating', percent: 45, color: 'bg-primary', textColor: 'text-primary' },
              { label: 'Appliances', percent: 32, color: 'bg-green-500', textColor: 'text-green-500' },
              { label: 'Lighting', percent: 23, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                    <span className="text-card-foreground font-medium">{item.label}</span>
                  </div>
                  <span className={`font-bold ${item.textColor}`}>{item.percent}%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-6 border border-border/30">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">Cost Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl text-card-foreground font-bold">$127.45</div>
              <div className="text-sm text-muted-foreground">This Month</div>
              <div className="flex items-center justify-center text-green-500 text-xs mt-1">
                <TrendingDown className="w-3 h-3 mr-1" />
                15% less
              </div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl text-card-foreground font-bold">$4.25</div>
              <div className="text-sm text-muted-foreground">Daily Average</div>
              <div className="flex items-center justify-center text-primary text-xs mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Peak: $6.80
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="space-y-4">
          <h3 className="text-xl text-foreground font-semibold">Reports</h3>
          <div className="space-y-3">
            {[
              { title: 'Weekly Report', subtitle: 'Last 7 days usage', color: 'from-primary/20 to-primary/10', border: 'border-primary/30' },
              { title: 'Monthly Report', subtitle: 'Detailed monthly analysis', color: 'from-green-500/20 to-green-500/10', border: 'border-green-500/30' },
              { title: 'Energy Efficiency Tips', subtitle: 'Personalized recommendations', color: 'from-blue-500/20 to-blue-500/10', border: 'border-blue-500/30' },
            ].map((report) => (
              <button key={report.title} className={`w-full bg-gradient-to-r ${report.color} ${report.border} border rounded-2xl p-4 text-left backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}>
                <div className="text-card-foreground font-semibold">{report.title}</div>
                <div className="text-sm text-muted-foreground">{report.subtitle}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
