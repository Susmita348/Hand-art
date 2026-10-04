import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";

interface HandLandmarksProps {
  result: HandLandmarkerResult | null;
}

function HandLandmarks({ result }: HandLandmarksProps) {
  if (!result?.landmarks?.length) {
    return null;
  }

  return (
    <>
      {result.landmarks[0].map((landmark, index) => (
        <div
          key={index}
          className="absolute h-3 w-3 rounded-full bg-green-400"
          style={{
            left: `${(1 - landmark.x) * 100}%`,
            top: `${landmark.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );
}

export default HandLandmarks;