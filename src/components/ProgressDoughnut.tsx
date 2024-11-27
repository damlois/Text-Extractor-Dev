import React, { useState, useEffect } from "react";
import { Progress, Spin } from "antd";

const ProgressDoughnut: React.FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div className="flex flex-col items-center">
      <Progress
        type="circle"
        percent={percentage}
        width={100}
        strokeColor="#4096ff"
        trailColor="#f3f3f3"
        format={(percent) => `${percent}%`}
      />
      <p className="mt-4 text-lg text-gray-600">Please wait while we extract your data...</p>
    </div>
  );
};

export default ProgressDoughnut;
