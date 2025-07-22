import React from "react";

interface FadeTransitionLoaderProps {
  isLoading: boolean;
  loader: React.ReactNode;
  children: React.ReactNode;
  transitionDuration?: number;
  className?: string;
}

const FadeTransitionLoader: React.FC<FadeTransitionLoaderProps> = ({
  isLoading,
  loader,
  children,
  transitionDuration = 300,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          opacity: isLoading ? 1 : 0,
          pointerEvents: isLoading ? "auto" : "none",
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        {loader}
      </div>
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          opacity: isLoading ? 0 : 1,
          pointerEvents: isLoading ? "none" : "auto",
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FadeTransitionLoader;
