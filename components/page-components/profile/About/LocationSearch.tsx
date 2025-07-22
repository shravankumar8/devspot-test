import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type LocationDropdownProps = {
  initialLocation: string;
  setLocation: (location: string) => void;
};

export default function LocationDropdown({
  initialLocation,
  setLocation,
}: LocationDropdownProps) {
  const [query, setQuery] = useState(initialLocation || "");
  const [results, setResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 400);

   const simplifyLocation = (place: any): string => {
     const parts = [];
     if (place.address?.city) parts.push(place.address.city);
     else if (place.address?.town) parts.push(place.address.town);
     else if (place.address?.village) parts.push(place.address.village);

     if (place.address?.state) parts.push(place.address.state);
     if (place.address?.country) parts.push(place.address.country);

     // Fallback to display_name if address components are missing
     if (parts.length === 0) {
       return place.display_name.split(",").slice(0, 3).join(", ");
     }

     return parts.join(", ");
   };

  // Fetch locations based on debounced input
  useEffect(() => {
    const fetchLocations = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${debouncedQuery}&limit=5&addressdetails=1`
        );
        const data = await res.json();
        const options = data.map((place: any) => simplifyLocation(place));
        setResults(options);
        setIsOpen(true);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setResults([]);
      }
    };

    fetchLocations();
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location: string) => {
    setQuery(location);
    setLocation(location);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <Input
        type="text"
        prefixIcon={<MapPin className="text-main-primary w-5 h-5" />}
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);

          // If user manually clears the input, reset the selected location too
          // if (val.trim() === "") {
          //   setLocation(""); // inform parent form
          // }
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search for a location..."
      />

      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-[#2B2B31] border border-[#424248] rounded-xl max-h-60 overflow-y-auto shadow-md">
          {results.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelect(location)}
              className="block w-full text-left px-4 py-2 hover:bg-[#3a3a42] font-roboto text-sm text-secondary-text border-b border-b-tertiary-bg"
            >
              {location}
            </button>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && debouncedQuery.trim() && (
        <div className="absolute z-10 mt-1 w-full bg-[#2B2B31] border border-[#424248] rounded-xl text-sm text-secondary-text font-roboto px-4 py-2">
          No locations found.
        </div>
      )}
    </div>
  );
}
