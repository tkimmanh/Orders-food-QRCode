/*
 component sử dụng next-initl được wrap trong supense khi sử dụng useSearchParams
 nếu thẻ đó sử dụng đa ngôn ngữ , thì sẽ không render ra html phần thẻ đó dù đó có là static rendering

*/

"use client";

import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

type SearchParamsLoaderProps = {
  onParamsReceived: (params: ReadonlyURLSearchParams) => void;
};

export const SearchParamsLoader = React.memo(Suspender);

function Suspender(props: SearchParamsLoaderProps) {
  return (
    <Suspense>
      <Suspendend {...props} />
    </Suspense>
  );
}

function Suspendend({ onParamsReceived }: SearchParamsLoaderProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onParamsReceived(searchParams);
  });

  return null;
}

export const useSearchParamsLoader = () => {
  const [searchParams, setSearchParams] =
    useState<ReadonlyURLSearchParams | null>(null);
  return {
    searchParams,
    setSearchParams,
  };
};
