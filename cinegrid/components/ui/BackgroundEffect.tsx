'use client';

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base GIF Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/synthwave.gif)',
          backgroundSize: 'cover',
        }}
      />
      
      {/* Dark overlay for better contrast */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
        }}
      />
      
      {/* Blur overlay layer */}
      <div 
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          background: 'rgba(15, 15, 15, 0.15)',
        }}
      />
      
      {/* Film grain / noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
