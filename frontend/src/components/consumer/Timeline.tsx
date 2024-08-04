import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Step {
  location: string;
  date: string;
  status: "completed" | "current" | "";
}

interface TimelineProps {
  steps: Step[];
}

const Timeline: React.FC<TimelineProps> = ({ steps }) => {
  return (
    <div className="relative flex flex-col pl-8">
      {/* Vertical line connecting the timeline dots */}
      <div className="absolute left-[10px] top-0 h-full w-0.5 bg-gray-300"></div>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center relative mt-3 mb-3">
          <div
            className={`absolute left-[-29px] w-4 h-4 rounded-full ${
              step.status === "completed"
                ? "bg-green-500"
                : step.status === "current"
                ? "bg-blue-500"
                : "bg-gray-400"
            }`}
          ></div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{step.location}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">{step.date}</div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
