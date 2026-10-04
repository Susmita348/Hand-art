import { useCallback, useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#eab308",
  "#a855f7",
];

function useDrawing(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const lastPointRef = useRef<Point | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  const [colorIndex, setColorIndex] = useState(0);
  const [brushSize, setBrushSize] = useState(6);

  const color = COLORS[colorIndex];

  const draw = useCallback(
    (point: Point) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.lineCap = "round";
      context.lineJoin = "round";

      if (!lastPointRef.current) {
        historyRef.current.push(
          context.getImageData(0, 0, canvas.width, canvas.height),
        );

        lastPointRef.current = point;
        return;
      }

      const lastPoint = lastPointRef.current;

      const middlePoint = {
        x: (lastPoint.x + point.x) / 2,
        y: (lastPoint.y + point.y) / 2,
      };

      context.beginPath();

      context.moveTo(lastPoint.x, lastPoint.y);

      context.quadraticCurveTo(
        lastPoint.x,
        lastPoint.y,
        middlePoint.x,
        middlePoint.y,
      );

      context.stroke();

      lastPointRef.current = point;
    },
    [canvasRef, color, brushSize],
  );

  const stopDrawing = useCallback(() => {
    lastPointRef.current = null;
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const previousCanvas = historyRef.current.pop();

    if (!previousCanvas) {
      return;
    }

    context.putImageData(previousCanvas, 0, 0);

    lastPointRef.current = null;
  }, [canvasRef]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    lastPointRef.current = null;
    historyRef.current = [];
  }, [canvasRef]);

  const downloadDrawing = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const link = document.createElement("a");

    link.download = "hand-art.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
  }, [canvasRef]);

  const changeColor = useCallback(() => {
    setColorIndex((currentIndex) => {
      return (currentIndex + 1) % COLORS.length;
    });

    lastPointRef.current = null;
  }, []);

  const changeBrushSize = useCallback(() => {
    setBrushSize((currentSize) => {
      if (currentSize === 6) {
        return 12;
      }

      if (currentSize === 12) {
        return 20;
      }

      return 6;
    });

    lastPointRef.current = null;
  }, []);

  const resetDrawing = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    lastPointRef.current = null;
    historyRef.current = [];
    setColorIndex(0);
    setBrushSize(6);
  }, [canvasRef]);

  useEffect(() => {
    return () => {
      lastPointRef.current = null;
      historyRef.current = [];
    };
  }, []);

  return {
    draw,
    stopDrawing,
    undo,
    clearCanvas,
    downloadDrawing,
    resetDrawing,
    changeColor,
    changeBrushSize,
    color,
    brushSize,
  };
}

export default useDrawing;