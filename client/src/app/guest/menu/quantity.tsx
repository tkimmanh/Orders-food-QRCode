import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { number } from "zod";

const Quantity = ({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) => {
  return (
    <div className="flex gap-1 ">
      <Button
        className="h-6 w-6 p-0"
        disabled={value === 0}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="w-3 h-3" />
      </Button>
      <Input
        onChange={(e) => {
          const value = Number(e.target.value);
          if (typeof value !== "number") return;
          onChange(value);
        }}
        value={value}
        type="text"
        inputMode="numeric"
        pattern="[0-9]"
        className="h-6 p-1 w-8 text-center"
      />
      <Button className="h-6 w-6 p-0" onClick={() => onChange(value + 1)}>
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default Quantity;
