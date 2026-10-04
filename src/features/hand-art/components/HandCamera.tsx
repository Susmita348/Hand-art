import { useEffect, useRef, useState, type CSSProperties } from "react";
import useHandTracking from "../hooks/useHandTracking";
import HandLandmarks from "./HandLandmarks";
import HandConnections from "./HandConnections";
import useGestureDetection from "../hooks/useGestureDetection";
import DrawingCanvas from "./DrawingCanvas";
import useDrawing from "../hooks/useDrawing";
import DrawingToolbar from "./DrawingToolbar";

type HandCameraStyles = CSSProperties & {
  [key: `--${string}`]: string;
};

function HandCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousGestureRef = useRef<string | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);

  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { result, isLoading, error } = useHandTracking(videoRef);
  const gesture = useGestureDetection(result);

  const {
    draw,
    stopDrawing,
    undo,
    clearCanvas,
    downloadDrawing,
    resetDrawing,
    changeColor,
    changeBrushSize,
      brushSize,
    color,
  } = useDrawing(canvasRef);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setCameraError(
          "Unable to access the camera. Please allow camera permission.",
        );
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (gesture !== "DRAW") {
      stopDrawing();
      setCursorPosition(null);
      return;
    }

    if (!result?.landmarks?.length) {
      stopDrawing();
      setCursorPosition(null);
      return;
    }

    const landmark = result.landmarks[0][8];

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const x = (1 - landmark.x) * canvas.width;
    const y = landmark.y * canvas.height;

    setCursorPosition({
      x,
      y,
    });

    draw({
      x,
      y,
    });
  }, [gesture, result, draw, stopDrawing]);

  useEffect(() => {
    if (
      gesture === "CHANGE_COLOR" &&
      previousGestureRef.current !== "CHANGE_COLOR"
    ) {
      changeColor();
    }

    previousGestureRef.current = gesture;
  }, [gesture, changeColor]);

  const cursorStyle: HandCameraStyles | undefined = cursorPosition
    ? {
        "--cursor-left": `${(cursorPosition.x / 1280) * 100}%`,
        "--cursor-top": `${(cursorPosition.y / 720) * 100}%`,
        "--cursor-color": color,
      }
    : undefined;

  if (cameraError) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl bg-red-950 p-6 text-center text-red-300">
        {cameraError}
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-[min(90vw,1100px)] overflow-hidden rounded-xl bg-black shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover -scale-x-100"
      />

      <DrawingCanvas
        canvasRef={canvasRef}
        width={1280}
        height={720}
      />

      {cursorPosition && (
        <div
          className="pointer-events-none absolute left-[var(--cursor-left)] top-[var(--cursor-top)] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--cursor-color)]"
          style={cursorStyle}
        />
      )}

      <HandConnections result={result} />

      <HandLandmarks result={result} />

      <DrawingToolbar
        onUndo={undo}
        onClear={clearCanvas}
        onDownload={downloadDrawing}
        onReset={resetDrawing}
        onBrushSizeChange={changeBrushSize}
          brushSize={brushSize}
        
      />
      <div className="absolute left-4 top-4 rounded-lg bg-black/70 px-4 py-2 text-sm text-white">
        {isLoading
          ? "Loading MediaPipe..."
          : error
            ? error
            : gesture === "DRAW"
              ? " Drawing..."
              : gesture === "CHANGE_COLOR"
                ? " Change Color"
                : gesture === "PAUSE"
                  ? "Paused"
                  : result?.landmarks?.length
                    ? `Gesture: ${gesture}`
                    : "Looking for hand..."}
      </div>

      <div
        className="absolute right-4 top-4 h-6 w-9 rounded-full border-2 border-white bg-[var(--brush-color)]"
        style={{ "--brush-color": color } as HandCameraStyles}
      />
    </div>
  );
}

export default HandCamera;