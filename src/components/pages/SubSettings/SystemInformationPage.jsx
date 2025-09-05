import { Info, ChevronLeft, Battery, Zap, Copy } from 'lucide-react';
import { useState } from 'react';

export function SystemInformationPage({ onBack }) {
  const [copyStatus, setCopyStatus] = useState({});
  
  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [key]: true });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [key]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isDeviceRegistered = true; // Set to false to show "Device not registered!" placeholder

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
            <Info className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl text-foreground font-semibold">System Information</h1>
            <p className="text-sm text-muted-foreground">Device Details</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-6 pb-24">
        {!isDeviceRegistered ? (
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow border border-border/50 text-center">
            <div className="text-muted-foreground text-lg font-medium">
              Device not registered!
            </div>
          </div>
        ) : (
          <>
            {/* Battery Details Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Battery className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl text-card-foreground font-semibold">
                  Battery Details
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Serial Number:</label>
                  <div className="flex items-center justify-between">
                    <span className="text-card-foreground font-mono">BAT123456</span>
                    <button
                      onClick={() => copyToClipboard('BAT123456', 'battery')}
                      className="p-2 hover:bg-muted/30 rounded-lg transition-all duration-200"
                      title="Copy serial number"
                    >
                      <Copy className={`w-4 h-4 ${copyStatus.battery ? 'text-green-500' : 'text-muted-foreground'}`} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Model:</label>
                  <div className="">
                    <span className="text-card-foreground">Dura5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diverter Details Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl text-card-foreground font-semibold">
                  Diverter Details
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Serial Number:</label>
                  <div className="flex items-center justify-between">
                    <span className="text-card-foreground font-mono">DIV789123</span>
                    <button
                      onClick={() => copyToClipboard('DIV789123', 'diverter')}
                      className="p-2 hover:bg-muted/30 rounded-lg transition-all duration-200"
                      title="Copy serial number"
                    >
                      <Copy className={`w-4 h-4 ${copyStatus.diverter ? 'text-green-500' : 'text-muted-foreground'}`} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Model:</label>
                  <div className="">
                    <span className="text-card-foreground">DuraDiverter</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
