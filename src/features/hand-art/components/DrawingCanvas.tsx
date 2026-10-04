import { useEffect } from "react";

interface DrawingCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
}

function DrawingCanvas({
  canvasRef,
  width,
  height,
}: DrawingCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.lineWidth = 6;
    context.strokeStyle = "#22c55e";
    context.lineCap = "round";
    context.lineJoin = "round";
  }, [canvasRef, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export default DrawingCanvas;