export function PhoneMockup({ children }) {
  return (
    <div className="relative">
      {/* iPhone 14 Pro Max Frame */}
      <div className="w-[390px] h-[844px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-black/50">
        {/* Screen */}
        <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-full z-20"></div>
          
          {/* Screen Content */}
          <div className="relative z-10 w-full h-full pt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
