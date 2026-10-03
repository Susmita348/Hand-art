import { useEffect, useRef, useState } from "react";

function HandCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

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
        setError("Unable to access the camera. Please allow camera permission.");
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl bg-red-950 p-6 text-center text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-auto w-full -scale-x-100"
      />
    </div>
  );
}

export default HandCamera;