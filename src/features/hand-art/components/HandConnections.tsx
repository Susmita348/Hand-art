import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";

interface HandConnectionsProps {
  result: HandLandmarkerResult | null;
}

const connections: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],

  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],

  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],

  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],

  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],

  [5, 9],
  [9, 13],
  [13, 17],
];

function HandConnections({ result }: HandConnectionsProps) {
  if (!result?.landmarks?.length) {
    return null;
  }

  const landmarks = result.landmarks[0];

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
    >
      {connections.map(([start, end]) => {
        const first = landmarks[start];
        const second = landmarks[end];

        return (
          <line
            key={`${start}-${end}`}
            x1={1 - first.x}
            y1={first.y}
            x2={1 - second.x}
            y2={second.y}
            stroke="white"
            strokeWidth="0.01"
          />
        );
      })}
    </svg>
  );
}

export default HandConnections;