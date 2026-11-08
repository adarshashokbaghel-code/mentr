import React from "react";
import { Composition } from "remotion";
import { MentrPythonL2 } from "./Video";
import { DeviceLaunch15, DEVICE_LAUNCH_DURATION } from "./DeviceLaunch15";
import { DURATION, FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MentrPythonL2"
        component={MentrPythonL2}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DeviceLaunch15"
        component={DeviceLaunch15}
        durationInFrames={DEVICE_LAUNCH_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
