'use client';

/**
 * PERFORMANCE OPTIMIZED:
 * - Kept GIF but removed blur layers (major GPU bottleneck)
 * - Reduced from 5 layers to 2 layers
 * - Lighter overlay so GIF is visible
 */
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
      
      {/* Light vignette overlay - keeps GIF visible */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
