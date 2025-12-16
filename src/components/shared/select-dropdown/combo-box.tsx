"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import * as React from "react";
import { FaChevronDown } from "react-icons/fa";

export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboBoxProperties {
  options: ComboBoxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  width?: string;
  triggerClassName?: string;
  contentClassName?: string;
  allowClear?: boolean;
}

export function ComboBox({
  options,
  value = "",
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  disabled = false,
  className,
  width = "w-[200px]",
  triggerClassName,
  contentClassName,
  allowClear = true,
}: ComboBoxProperties) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  // Update internal value when prop changes
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const currentValue = onValueChange ? value : internalValue;
  const setCurrentValue = onValueChange || setInternalValue;

  const selectedOption = options.find((option) => option.value === currentValue);

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === currentValue && allowClear ? "" : selectedValue;
    setCurrentValue(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(width, "justify-between", triggerClassName, className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <FaChevronDown className="ml-2 size-3 shrink-0 opacity-30" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className={cn("p-0", contentClassName)}
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align="start"
      >
        <Command className="w-full">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            className="max-h-[200px] overflow-y-auto"
          >
            <CommandEmpty className="py-6 text-center text-sm">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Use label for search instead of value
                  disabled={option.disabled}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <CheckIcon
                    className={cn("mr-2 h-4 w-4", currentValue === option.value ? "opacity-100" : "opacity-0")}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
