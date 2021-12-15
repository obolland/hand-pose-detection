// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

//  draw the fingers
export function drawKeypoints(keypoints, ctx, canvas) {
  const keypointsArray = keypoints;
  ctx.fillStyle = "Blue";
  ctx.strokeStyle = "White";
  ctx.lineWidth = 4;

  for (let i = 0; i < keypointsArray.length; i++) {
    const y = keypointsArray[i].x;
    const x = keypointsArray[i].y;
    drawPoint(x - 2, y - 2, 3, ctx, canvas);
  }

  const fingers = Object.keys(fingerJoints);
  for (let i = 0; i < fingers.length; i++) {
    const finger = fingers[i];
    const points = fingerJoints[finger].map((idx) => keypoints[idx]);
    drawPath(points, false, ctx);
  }
}

function drawPoint(y, x, r, ctx, canvas) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function drawPath(points, closePath, ctx) {
  const region = new Path2D();
  region.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point.x, point.y);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

export const getDistanceBetweenThumbAndFinger = (keypoints) => {
  const thumbTip = keypoints.find((obj) => obj.name === "thumb_tip");
  const fingerTip = keypoints.find((obj) => obj.name === "index_finger_tip");

  return Math.round(
    ((fingerTip.x - thumbTip.x) ** 2 + (fingerTip.y - thumbTip.y) ** 2) ** 0.5
  );
};

export const getRotationAngle = (keypoints) => {
  const fingerTip = keypoints.find((obj) => obj.name === "index_finger_tip");

  return fingerTip.x;
};
