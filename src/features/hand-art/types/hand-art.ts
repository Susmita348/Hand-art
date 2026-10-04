export type Gesture =
  | "DRAW"
  | "CHANGE_COLOR"
  | "SPACE"
  | "STOP"
  | "NONE";

export interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}