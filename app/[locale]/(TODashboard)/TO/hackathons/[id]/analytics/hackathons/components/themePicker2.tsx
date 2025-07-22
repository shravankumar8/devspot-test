import { PaintIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind-merge";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ColorPickerProps {
  value: { h: number; s: number; l: number; a: number };
  onChange: (color: { h: number; s: number; l: number; a: number }) => void;
  theme: "light" | "dark";
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  theme,
}) => {
  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseInt(e.target.value);
    onChange({ ...value, h: hue });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseFloat(e.target.value);
    onChange({ ...value, a: opacity });
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hslToRgba = (h: number, s: number, l: number, a: number) => {
    const hex = hslToHex(h, s, l);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const hexColor = hslToHex(value.h, value.s, value.l);
  const displayColor =
    value.a === 1 ? hexColor : hslToRgba(value.h, value.s, value.l, value.a);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "space-y-3 p-2 rounded-md",
          theme == "dark" ? "bg-secondary-bg" : "bg-[#E7E7E8]"
        )}
      >
        {/* Hue Slider - Full spectrum */}
        <div className="relative">
          <div
            className="h-3 rounded-lg relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, 100%, 50%) 0%, 
                hsl(60, 100%, 50%) 16.66%, 
                hsl(120, 100%, 50%) 33.33%, 
                hsl(180, 100%, 50%) 50%, 
                hsl(240, 100%, 50%) 66.66%, 
                hsl(300, 100%, 50%) 83.33%, 
                hsl(360, 100%, 50%) 100%)`,
            }}
          >
            <input
              type="range"
              min="0"
              max="360"
              value={value.h}
              onChange={handleHueChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-300 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${(value.h / 360) * 100}%` }}
            />
          </div>
        </div>

        {/* Opacity Slider */}
        <div className="relative">
          <div
            className="h-3 rounded-lg relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, 
                transparent 0%, 
                hsl(${value.h}, ${value.s}%, ${value.l}%) 100%),
                repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px`,
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value.a}
              onChange={handleOpacityChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-300 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${value.a * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hex Display */}
      <div
        className={cn(
          "flex items-center justify-between p-2 rounded-md",
          theme === "dark" ? "bg-secondary-bg" : "bg-[#E7E7E8]"
        )}
      >
        <span className="text-sm font-medium text-gray-700">Hex</span>
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg border-2 border-gray-200"
            style={{ backgroundColor: displayColor }}
          />
          <span className="text-sm font-mono text-tertiary-text">
            {value.a === 1
              ? hexColor.toUpperCase()
              : displayColor.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

const DEFAULT_BACKGROUND = "#13131A";
const DEFAULT_THEME = "dark";

const ThemePicker: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<"dark" | "light">(
    DEFAULT_THEME
  );
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState({
    h: 100,
    s: 70,
    l: 60,
    a: 1,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", displayMode === "dark");
    // Update the hackathon page background
    const container = document.querySelector(".hackathon-container");
    if (container) {
      (
        container as HTMLElement
      ).style.backgroundColor = `hsl(${backgroundColor.h}, ${backgroundColor.s}%, ${backgroundColor.l}%) 100%)`;
    }
  }, [displayMode, backgroundColor]);

  const handleBackToDefault = () => {
    setBackgroundColor({
      h: 100,
      s: 70,
      l: 60,
      a: 1,
    });
    setDisplayMode(DEFAULT_THEME);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-7 w-7 rounded-md bg-main-primary flex justify-center items-center"
      >
        <PaintIcon />
      </button>
      {isOpen && (
        <div
          className={cn(
            "w-[400px] mx-auto p-3 bg-gray-100 rounded-2xl absolute -right-2 mb-2 bottom-full",
            displayMode === "dark" ? "bg-primary-bg" : "bg-white"
          )}
        >
          {/* Display Mode Section */}
          <div className="mb-3">
            <h2 className="text-sm font-medium text-tertiary-text mb-2">
              Display mode
            </h2>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => setDisplayMode("dark")}
                className={`flex items-center space-x-3 w-full px-6 py-4 text-sm font-medium transition-colors ${
                  displayMode === "dark"
                    ? "!bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-white"
                    : "!bg-[#424248] !text-secondary-text"
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Dark mode</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setDisplayMode("light")}
                className={`flex items-center space-x-3 w-full px-6 py-4  text-sm font-medium transition-colors ${
                  displayMode === "light"
                    ? "!bg-gradient-to-tr from-[#4075FF] to-[#9667FA] text-white"
                    : "!bg-[#424248] !text-secondary-text"
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Light mode</span>
              </Button>
            </div>
          </div>

          {/* Background Color Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-tertiary-text">
                Background color
              </h2>
              <button
                onClick={handleBackToDefault}
                className="text-sm text-tertiary-text underline hover:text-gray-900 transition-colors"
              >
                Back to default
              </button>
            </div>

            <ColorPicker
              value={backgroundColor}
              onChange={setBackgroundColor}
              theme={displayMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
