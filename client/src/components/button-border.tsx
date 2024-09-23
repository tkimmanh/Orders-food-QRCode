import React from "react";

type Props = {
  children: string;
  onClick?: () => void;
};

const ButtonBorder = (props: Props) => {
  return (
    <button
      onClick={props.onClick && props.onClick}
      className="relative -z-10 inline-flex overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full lg:max-w-full cursor-pointer items-center justify-center rounded-md bg-slate-900 px-4 py-2 lg:text-sm text-xs font-medium text-white backdrop-blur-3xl">
        {props.children}
      </span>
    </button>
  );
};

export default ButtonBorder;
