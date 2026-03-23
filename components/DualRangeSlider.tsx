"use client";

import React from "react";
import * as Slider from "@radix-ui/react-slider";

interface DualRangeSliderProps {
    min: number;
    max: number;
    step: number;
    value: [number, number];
    onValueChange: (value: [number, number]) => void;
    formatValue?: (val: number) => string;
}

export function DualRangeSlider({
    min,
    max,
    step,
    value,
    onValueChange,
    formatValue
}: DualRangeSliderProps) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={value}
                min={min}
                max={max}
                step={step}
                onValueChange={(val) => onValueChange(val as [number, number])}
            >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[4px]">
                    <Slider.Range className="absolute bg-gold rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                    className="block w-5 h-5 bg-white border-2 border-gold shadow-md rounded-[10px] hover:bg-gray-50 focus:outline-none focus:shadow-[0_0_0_4px_rgba(198,161,74,0.3)] transition-shadow"
                    aria-label="Min value"
                />
                <Slider.Thumb
                    className="block w-5 h-5 bg-white border-2 border-gold shadow-md rounded-[10px] hover:bg-gray-50 focus:outline-none focus:shadow-[0_0_0_4px_rgba(198,161,74,0.3)] transition-shadow"
                    aria-label="Max value"
                />
            </Slider.Root>

            <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                <span>{formatValue ? formatValue(value[0]) : value[0]}</span>
                <span>{formatValue ? formatValue(value[1]) : value[1]}</span>
            </div>
        </div>
    );
}
