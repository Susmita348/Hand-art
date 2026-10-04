function useGestureDetection(result: any) {
  if (!result?.landmarks?.length) {
    return "NONE";
  }

  const landmarks = result.landmarks[0];

  const indexUp = landmarks[8].y < landmarks[6].y;
  const middleUp = landmarks[12].y < landmarks[10].y;
  const ringUp = landmarks[16].y < landmarks[14].y;
  const pinkyUp = landmarks[20].y < landmarks[18].y;

  const ringDown = !ringUp;
  const pinkyDown = !pinkyUp;

  if (indexUp && middleUp && ringDown && pinkyDown) {
    return "CHANGE_COLOR";
  }

  if (indexUp && !middleUp) {
    return "DRAW";
  }

  if (indexUp && middleUp && ringUp && pinkyUp) {
    return "PAUSE";
  }

  return "STOP";
}

export default useGestureDetection;