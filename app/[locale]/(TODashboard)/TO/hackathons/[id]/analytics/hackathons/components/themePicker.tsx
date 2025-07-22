"use client";

import { useState, useEffect, useRef } from "react";
import { PaintIcon } from "@/components/icons/Location";


const DEFAULT_BACKGROUND = "#13131A";
const DEFAULT_THEME = "dark";

export function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(DEFAULT_THEME);
  const [bgColor, setBgColor] = useState(DEFAULT_BACKGROUND);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Apply theme changes to the document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    // Update the hackathon page background
    const container = document.querySelector(".hackathon-container");
    if (container) {
      (container as HTMLElement).style.backgroundColor = bgColor;
    }
  }, [theme, bgColor]);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
  };

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
  };

  const resetToDefault = () => {
    setTheme(DEFAULT_THEME);
    setBgColor(DEFAULT_BACKGROUND);
  };

  const isDefault = theme === DEFAULT_THEME && bgColor === DEFAULT_BACKGROUND;

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-7 w-7 rounded-md bg-main-primary flex justify-center items-center"
      >
        <PaintIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Display mode
          </h3>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 py-2 px-3 rounded-md border ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              }`}
            >
              Dark mode
            </button>
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex-1 py-2 px-3 rounded-md border ${
                theme === "light"
                  ? "bg-gray-100 text-gray-800 border-gray-300"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              }`}
            >
              Light mode
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => handleBgColorChange(e.target.value)}
                className="w-8 h-8 cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => handleBgColorChange(e.target.value)}
                className="flex-1 text-sm px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <button
            onClick={resetToDefault}
            disabled={isDefault}
            className={`w-full py-2 px-3 rounded-md text-sm ${
              isDefault
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
          >
            Back to default
          </button>
        </div>
      )}
    </div>
  );
}
