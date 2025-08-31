import { Zap, ChevronLeft, Settings } from 'lucide-react';

export function InverterPage({ onBack }) {
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
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground font-semibold">Inverter</h1>
            <p className="text-sm text-muted-foreground">Sub Menu</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
          <h3 className="text-xl text-card-foreground font-semibold mb-4">
            Inverter Settings
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-card-foreground">3-Phase Inv Log In Code</span>
              </div>
              <span className="text-xs text-orange-500 font-medium">(Coming soon!)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
