"use client";

import type { Option } from "@/types/common";
import { clsx, type ClassValue } from "clsx";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import type React from "react";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import Select, {
  components,
  MenuListProps,
  type ControlProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type MultiValue,
  type MultiValueProps,
  type OptionProps,
  type StylesConfig,
} from "react-select";
import AsyncSelect from "react-select/async";
import { twMerge } from "tailwind-merge";

// Utility function for conditional class names
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MultiSelectProps = {
  options: Option[];
  value?: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  doubleClickedItem?: string | number | null;
  onDoubleClickItem?: (value: string | number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  showCheckboxes?: boolean;
  className?: string;
  loadOptions?: (inputValue: string) => Promise<Option[]>;
  isAsync?: boolean;
  noOptionsMessage?: string;
  height?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  menuPlacement?: "auto" | "bottom" | "top";
  menuPosition?: "absolute" | "fixed";
  maxMenuHeight?: number;
  isLoading?: boolean;
  defaultInputValue?: string;
  prefixIcon?: React.ReactNode;
  isOpen?: boolean;
  onMenuOpenChange?: (isOpen: boolean) => void;
  styles?: Partial<StylesConfig<Option, true, GroupBase<Option>>>;
};

export function MultiSelect({
  options: initialOptions,
  value = [],
  onChange,
  onDoubleClickItem,
  placeholder = "Select from dropdown",
  disabled = false,
  showCheckboxes = true,
  className,
  loadOptions,
  height,
  isAsync = false,
  noOptionsMessage = "No options found.",
  isSearchable = true,
  isClearable = false,
  menuPlacement = "bottom",
  menuPosition = "absolute",
  maxMenuHeight = 300,
  isLoading = false,
  defaultInputValue,
  doubleClickedItem,
  prefixIcon,
  isOpen,
  onMenuOpenChange,
  styles: userStyles,
}: MultiSelectProps) {
  const selectRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalMenuIsOpen, setInternalMenuIsOpen] = useState(false);
  const menuIsOpen = typeof isOpen === "boolean" ? isOpen : internalMenuIsOpen;

  const handleMenuOpen = () => {
    if (typeof isOpen !== "boolean") setInternalMenuIsOpen(true);
    onMenuOpenChange?.(true);
  };

  const handleMenuClose = () => {
    if (typeof isOpen !== "boolean") setInternalMenuIsOpen(false);
    onMenuOpenChange?.(false);
  };

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        menuIsOpen
      ) {
        handleMenuClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [menuIsOpen]);

  // Debounce ref for async loading
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOptions = value
    .map((val) => initialOptions?.find((option) => option.value === val))
    .filter(Boolean) as Option[];

  // Debounced promise options function for async loading
  const promiseOptions = useCallback(
    (selectedOption: string) => {
      return new Promise<Option[]>((resolve) => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
          if (loadOptions && selectedOption.length >= 1) {
            const options = await loadOptions(selectedOption);
            resolve(options);
          } else {
            resolve([]);
          }
          debounceRef.current = null;
        }, 1000);
      });
    },
    [loadOptions]
  );

  // Handle removing an item from selection
  const handleRemoveItem = useCallback(
    (itemValue: string | number) => {
      const newValues = value.filter((val) => val !== itemValue);
      onChange(newValues);

      // Clear main role if this was it
      if (doubleClickedItem === itemValue && onDoubleClickItem) {
        onDoubleClickItem(null);
      }
    },
    [value, onChange, doubleClickedItem, onDoubleClickItem]
  );

  // Handle container click to focus the input
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (selectRef.current && !disabled) {
        // Focus the input element inside the select
        const inputElement = containerRef.current?.querySelector("input");
        if (inputElement) {
          inputElement.focus();
        } else {
          selectRef.current.focus();
        }
      }
    },
    [disabled]
  );

  const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
    return (
      <components.Control
        {...props}
        className="!shadow-none focus-visible:shadow-unset"
      >
        {prefixIcon && (
          <div className="flex items-center mr-4">{prefixIcon}</div>
        )}
        {children}
      </components.Control>
    );
  };

  // 1. Custom Placeholder
  const CustomPlaceholder = (props: any) => {
    const {
      innerProps,
      selectProps: { placeholder },
    } = props;

    // position absolutely so it sits where the default would
    return (
      <div
        {...innerProps}
        className="top-1/2 left-1 absolute font-normal text-[#89898c] text-sm -translate-y-1/2 pointer-events-none transform"
      >
        {placeholder}
      </div>
    );
  };

  // Custom components for React Select
  const CustomOption = (props: OptionProps<Option>) => {
    const { data, isSelected, innerProps } = props;
    const isDoubleClicked = doubleClickedItem === data.value;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        // If not selected, select it (first click behavior)
        if (!isSelected) {
          innerProps?.onClick && innerProps.onClick(event);
        }
        // If already selected
        // If it's already the main role, unselect it (second click on selected item)
        else {
          innerProps?.onClick && innerProps.onClick(event);
          if (onDoubleClickItem) {
            onDoubleClickItem(null);
          }
        }
      },
      [innerProps, isSelected, data.value, isDoubleClicked, onDoubleClickItem]
    );

    return (
      <components.Option
        {...props}
        innerProps={{
          ...props.innerProps,
          onClick: handleClick,
        }}
      >
        <div className="flex justify-between items-center flex-shrink-0">
          <div className="flex items-center flex-shrink-0">
            {showCheckboxes && (
              <div
                className={cn(
                  "h-4 w-4 rounded border border-[#4e52f5] mr-3 flex items-center justify-center",
                  isSelected && "bg-[#4e52f5] flex-shrink-0"
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
            )}
            <span className="capitalize">{data.label}</span>
          </div>
        </div>
      </components.Option>
    );
  };

  const CustomDropdownIndicator = (props: DropdownIndicatorProps<Option>) => {
    return (
      <components.DropdownIndicator {...props}>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-[#4e52f5] transition-transform duration-200",
            props.selectProps.menuIsOpen && "rotate-180"
          )}
        />
      </components.DropdownIndicator>
    );
  };

  const CustomMultiValue = (props: MultiValueProps<Option>) => {
    const isDoubleClicked = doubleClickedItem === props.data.value;

    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleRemoveItem(props.data.value);
        // Force the menu to stay open
        if (selectRef.current) {
          setTimeout(() => {
            selectRef.current.focus();
          }, 0);
        }
      },
      [handleRemoveItem, props.data.value]
    );

    return (
      <components.MultiValue {...props}>
        <div
          onMouseDown={(e) => {
            // Prevent the default select behavior
            e.preventDefault();
            e.stopPropagation();
          }}
          className="flex items-center gap-1 bg-transparent px-2 border border-white rounded-full h-7 font-normal text-white text-sm"
        >
          <span className="max-w-[200px] truncate"> {props.data.label}</span>

          <div
            className="flex justify-center items-center w-4 h-4 cursor-pointer"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={handleRemove}
          >
            <X className="w-4 h-4 text-[#4e52f5]" />
          </div>
        </div>
      </components.MultiValue>
    );
  };

  const CustomMenuList = <
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  >(
    props: MenuListProps<Option, IsMulti, Group>
  ) => {
    // flatten the children into an array
    const items = Children.toArray(props.children);

    // interleave a divider after each option except the last
    const interleaved = items.reduce<React.ReactNode[]>((acc, child, idx) => {
      acc.push(child);
      if (idx < items.length - 1) {
        acc.push(
          <div key={`separator-${idx}`} className="border-[#424248] border-t" />
        );
      }
      return acc;
    }, []);

    // render the built-in MenuList but with our dividers injected
    return <components.MenuList {...props}>{interleaved}</components.MenuList>;
  };

  // Custom Input component to fix cursor issues
  const CustomInput = (props: any) => {
    return (
      <components.Input
        {...props}
        isHidden={false}
        className="!text-white cursor-text"
      />
    );
  };

  // Custom styles for React Select
  const customStyles: StylesConfig<Option, true> = {
    container: () => ({
      "&:focus-visible": {
        borderColor: "#89898C",
        outline: "none",
      },
    }),

    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#2b2b31",
      border: "1px solid #424248",
      borderRadius: "12px",
      padding: "0px 20px",
      minHeight: "48px",
      transition: "all 200ms ease-in-out",
      cursor: "text", // Change to text cursor for better UX
      outline: "none",
      boxShadow: "none", // remove any focus shadow
      "&:focus-within": {
        outline: "none",
        boxShadow: "none",
        border: "1px solid #89898C",
      },

      "&:focus-visible": {
        border: "none",
        outline: "none",
        boxShadow: "none",
      },

      "&:hover": {
        outline: "none",
        boxShadow: "none",
        border: "1px solid #424248",
      },
    }),
    menuList: (base) => ({
      ...base,
      padding: "0px",
      height: height ?? "auto",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#2b2b31",
      border: "1px solid #424248",
      borderRadius: "12px",
      overflow: "hidden",
      padding: 0,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 100,
      animation: "fadeIn 0.2s ease-in-out",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#424248" : "#2b2b31",
      color: state.isSelected ? "white" : "#89898c",
      overflow: "hidden",
      cursor: "pointer",
      padding: "12px 20px",
      margin: 0,
      borderRadius: state.isFocused ? "0px" : "12px",
      fontSize: "14px",
      fontWeight: "normal",
    }),
    input: (provided) => ({
      ...provided,
      color: "#89898c", // Make input text white
      margin: "0",
      padding: "0",
      cursor: "text",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#89898c",
      display: "none",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#89898c",
      "&:hover": {
        color: "#ffffff",
      },
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: "#89898c",
    }),
    loadingMessage: (provided) => ({
      ...provided,
      color: "#89898c",
    }),
    multiValue: (provided) => ({
      ...provided,
      flexShrink: 0,
      backgroundColor: "transparent",
      margin: "0 2px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      padding: 0,
      paddingLeft: 0,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      padding: 0,
      paddingRight: 0,
      "&:hover": {
        backgroundColor: "transparent",
        color: "#ffffff",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px",
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      overflowY: "hidden",
      alignItems: "center",
      paddingRight: "calc(1rem + 16px)",

      columnGap: "8px",
      rowGap: "0.25rem",
      overflow: "auto",
      maxHeight: "80px",
      cursor: "text", // Add text cursor to value container
    }),
  };

  function mergeStyles(
    base: StylesConfig<Option, true>,
    override?: Partial<StylesConfig<Option, true, GroupBase<Option>>>
  ): StylesConfig<Option, true> {
    if (!override) return base;
    const merged: Partial<StylesConfig<Option, true>> = {};
    const keys = new Set([
      ...Object.keys(base),
      ...Object.keys(override),
    ]) as Set<keyof StylesConfig<Option, true>>;
    keys.forEach((key) => {
      const baseFn = base[key];
      const overrideFn = override[key];
      if (overrideFn) {
        merged[key] = (provided, state: any) => {
          const fromBase = baseFn ? baseFn(provided, state) : provided;
          return overrideFn(fromBase, state);
        };
      } else if (baseFn) {
        merged[key] = baseFn as any;
      }
    });
    return merged as StylesConfig<Option, true, GroupBase<Option>>;
  }

  const mergedStyles = mergeStyles(customStyles, userStyles);

  const SelectComponent = isAsync
    ? (AsyncSelect as typeof AsyncSelect<Option, true, GroupBase<Option>>)
    : (Select as typeof Select<Option, true, GroupBase<Option>>);

  // Only control open state if explicit
  const controlProps: Partial<React.ComponentProps<typeof SelectComponent>> =
    {};
  if (typeof isOpen === "boolean") {
    controlProps.menuIsOpen = menuIsOpen;
    controlProps.onMenuOpen = handleMenuOpen;
    controlProps.onMenuClose = handleMenuClose;
  }

  return (
    <div
      // ref={containerRef}
      className={cn("relative !font-roboto", className)}
      onClick={handleContainerClick}
    >
      <SelectComponent
        ref={selectRef}
        options={initialOptions}
        value={selectedOptions}
        onChange={(options: MultiValue<Option>) => {
          const newValues = options
            ? options.map((option) => option.value)
            : [];

          onChange(newValues);

          if (
            doubleClickedItem &&
            !newValues.includes(doubleClickedItem) &&
            onDoubleClickItem
          ) {
            onDoubleClickItem(null);
          }
        }}
        isDisabled={disabled}
        isSearchable={isSearchable}
        isClearable={isClearable}
        placeholder={placeholder}
        noOptionsMessage={() => noOptionsMessage}
        loadOptions={isAsync ? promiseOptions : undefined}
        defaultOptions={isAsync ? initialOptions : undefined}
        isLoading={isLoading}
        menuPlacement={menuPlacement}
        menuPosition={menuPosition}
        maxMenuHeight={maxMenuHeight}
        defaultInputValue={defaultInputValue}
        isMulti={true}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={mergedStyles}
        components={{
          Option: CustomOption,
          DropdownIndicator: CustomDropdownIndicator,
          MultiValue: CustomMultiValue,
          Control: CustomControl,
          MultiValueRemove: () => null,
          Input: CustomInput,
          Placeholder: CustomPlaceholder,
          MenuList: CustomMenuList,
          LoadingIndicator: () => (
            <Loader2 className="w-4 h-4 text-[#4e52f5] animate-spin" />
          ),
        }}
        {...controlProps}
      />
    </div>
  );
}
