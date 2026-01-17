'use client';

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Guardians GIF background - full opacity */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/guardians.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Cool dark overlay for readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 12, 18, 0.5) 0%, rgba(10, 12, 18, 0.6) 100%)',
        }}
      />
      {/* Blue neon gradient accent */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
