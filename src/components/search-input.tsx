"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import isEmpty from "lodash/isEmpty";
import trim from "lodash/trim";
import { Loader2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  initialValue: string;
}

export function SearchInput({ initialValue, ...props }: SearchInputProps) {
  const [search, setSearch] = React.useState(initialValue);
  const [isPending, startTransition] = React.useTransition();
  const { replace } = useRouter();
  const pathname = usePathname();

  function handleSearch(value: string) {
    const params = new URLSearchParams(window.location.search);

    if (!isEmpty(value)) {
      params.set("search", trim(value));
    } else {
      params.delete("search");
    }

    setSearch(value);
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative grid w-full md:max-w-lg">
      <Input
        value={search}
        onChange={(e) => handleSearch(e.target.value ?? "")}
        name="search"
        {...props}
      />
      {isPending ? (
        <span className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 opacity-50">
          <Loader2Icon className="animate-spin" />
        </span>
      ) : null}
    </div>
  );
}