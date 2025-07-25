import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface LoadingStageProps {
  onComplete: () => void;
}

export const LoadingStage = ({ onComplete }: LoadingStageProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-sharepoint-gray flex items-center justify-center px-4">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-sharepoint-blue rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-sm"></div>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-sharepoint-text mb-2">SharePoint</h1>
          <p className="text-sm md:text-base text-sharepoint-text/70">Preparing your files...</p>
        </div>
        
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="text-center text-sm text-sharepoint-text/60">
            {progress}% Complete
          </div>
        </div>
      </div>
    </div>
  );
};