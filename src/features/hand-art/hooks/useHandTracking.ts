import { useEffect, useRef, useState } from "react";
import type {
  HandLandmarker,
  HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { createHandLandmarker } from "../api/hand-landmarker";

interface UseHandTrackingReturn {
  result: HandLandmarkerResult | null;
  isLoading: boolean;
  error: string | null;
}

function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
): UseHandTrackingReturn {
  const [result, setResult] = useState<HandLandmarkerResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startDetection = async () => {
      try {
        const landmarker = await createHandLandmarker();

        if (!isMounted) {
          return;
        }

        landmarkerRef.current = landmarker;
        setIsLoading(false);

        const detect = () => {
          const video = videoRef.current;
          const handLandmarker = landmarkerRef.current;

          if (
            !video ||
            !handLandmarker ||
            video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
          ) {
            animationFrameRef.current = requestAnimationFrame(detect);
            return;
          }

          const currentTime = performance.now();

          const detectionResult = handLandmarker.detectForVideo(
            video,
            currentTime,
          );

          setResult(detectionResult);

          animationFrameRef.current = requestAnimationFrame(detect);
        };

        animationFrameRef.current = requestAnimationFrame(detect);
      } catch {
        if (isMounted) {
          setError("Failed to initialize hand detection.");
          setIsLoading(false);
        }
      }
    };

    startDetection();

    return () => {
      isMounted = false;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoRef]);

  return {
    result,
    isLoading,
    error,
  };
}

export default useHandTracking;