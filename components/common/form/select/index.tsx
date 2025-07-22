"use client";

import { Option } from "@/types/common";
import { cn } from "@/utils/tailwind-merge";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useCallback, useRef } from "react";
import Select, {
  components,
  ControlProps,
  MultiValue,
  SingleValue,
  type DropdownIndicatorProps,
  type OptionProps,
  type SingleValueProps,
  type StylesConfig,
} from "react-select";
import AsyncSelect from "react-select/async";

type SingleSelectProps = {
  options: Option[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  showCheckboxes?: boolean;
  className?: string;
  loadOptions?: (inputValue: string) => Promise<Option[]>;
  isAsync?: boolean;
  noOptionsMessage?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  menuPlacement?: "auto" | "bottom" | "top";
  menuPosition?: "absolute" | "fixed";
  maxMenuHeight?: number;
  isLoading?: boolean;
  defaultInputValue?: string;
  prefixIcon?: React.ReactNode;
};

export function SingleSelect({
  options: initialOptions,
  value,
  onChange,
  placeholder = "Select from dropdown",
  disabled = false,
  showCheckboxes = true,
  className,
  loadOptions,
  isAsync = false,
  noOptionsMessage = "No options found.",
  isSearchable = true,
  isClearable = false,
  menuPlacement = "bottom",
  menuPosition = "absolute",
  maxMenuHeight = 300,
  isLoading = false,
  defaultInputValue,
  prefixIcon,
}: Readonly<SingleSelectProps>) {
  const selectRef = useRef<any>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Selected option object
  const selectedOption = initialOptions?.find(
    (option) => option.value === value
  );

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

  const CustomOption = (props: OptionProps<Option>) => {
    const { data, isSelected } = props;

    return (
      <components.Option {...props}>
        <div className="flex items-center">
          {showCheckboxes && (
            <div
              className={cn(
                "h-4 w-4 rounded border border-[#4e52f5] mr-3 flex items-center justify-center",
                isSelected && "bg-[#4e52f5]"
              )}
            >
              {isSelected && <Check className="h-3 w-3 text-white" />}
            </div>
          )}
          <span>{data.label}</span>
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

  const CustomSingleValue = (props: SingleValueProps<Option>) => {
    return (
      <components.SingleValue {...props}>
        <span>{props.data.label}</span>
      </components.SingleValue>
    );
  };

  // Custom styles for React Select
  const customStyles: StylesConfig<Option> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#2b2b31",
      minHeight: "none",
      borderWidth: 1,
      borderColor: "#424248",
      borderRadius: "12px",
      padding: "0px 20px",
      height: "48px",
      transition: "all 200ms ease-in-out",
      cursor: "pointer",
      "&:focus-visible": {
        borderColor: "#89898c",
      },
      "&:hover": {
        borderColor: "#424248",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#2b2b31",
      border: "1px solid #424248",
      borderRadius: "12px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 10,
      animation: "fadeIn 0.2s ease-in-out",
      marginTop: "0.25rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#424248" : "#2b2b31",
      color: state.isSelected ? "white" : "#89898c",
      cursor: "pointer",
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: "normal",
      transition: "all 200ms ease-in-out",
    }),
    input: (provided) => ({
      ...provided,
      color: "#89898c",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
      fontSize: "14px",
      fontWeight: "normal",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#89898c",
      fontSize: "14px",
      fontWeight: "normal",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0 0.5rem 0 0",
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
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px",
    }),
  };

  const SelectComponent = isAsync ? AsyncSelect : Select;

  return (
    <div className={cn("relative !font-roboto", className)}>
      <SelectComponent
        ref={selectRef}
        options={initialOptions}
        value={selectedOption}
        onChange={(newValue: SingleValue<Option> | MultiValue<Option>) => {
          onChange(newValue ? (newValue as Option).value : "");
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
        defaultInputValue={defaultInputValue ?? selectedOption?.label}
        styles={customStyles}
        components={{
          Option: CustomOption,
          DropdownIndicator: CustomDropdownIndicator,
          SingleValue: CustomSingleValue,
          Control: CustomControl,
          LoadingIndicator: () => (
            <Loader2 className="h-4 w-4 text-[#4e52f5] animate-spin" />
          ),
        }}
      />
    </div>
  );
}
