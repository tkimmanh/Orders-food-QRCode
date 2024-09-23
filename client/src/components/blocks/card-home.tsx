"use client";
import { cn, formatCurrency } from "@/lib/utils";

export default function CardHome({
  imageUrl,
  title,
  price,
  description,
}: {
  imageUrl: string;
  title: string;
  price: number;
  description: string;
}) {
  return (
    <div className="max-w-xs w-full group/card">
      <div
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
        className={cn(
          " cursor-pointer w-full max-w-[384px] overflow-hidden relative -z-10 card h-96 rounded-md shadow-xl   mx-auto backgroundImage flex flex-col justify-between p-4",
          " bg-cover"
        )}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          <span className="font-medium">{formatCurrency(price as number)}</span>
        </div>
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            {title}
          </h1>
          <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
