"use client";

import { useEffect, useRef } from "react";

function FluidCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0, g: 0, b: 0 },
  TRANSPARENT = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ... [tutto il codice WebGL rimane invariato fino alla funzione generateColor]

    function generateColor() {
      // Palette coerente: solo blue/cyan
      const colors = [
        { r: 34/255, g: 139/255, b: 230/255 }, // blue principale
        { r: 56/255, g: 189/255, b: 248/255 }, // cyan accent
        { r: 59/255, g: 130/255, b: 246/255 }, // blue secondario
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // ... [resto del codice rimane invariato]

    return () => {
      // Cleanup
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
  ]);

  return (
    <div className="fixed top-0 left-0 z-50 pointer-events-none">
      <canvas 
        ref={canvasRef} 
        id="fluid" 
        className="w-screen h-screen opacity-50 mix-blend-overlay" 
      />
    </div>
  );
}

export default FluidCursor; 