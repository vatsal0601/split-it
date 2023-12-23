"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import isEmpty from "lodash/isEmpty";
import trim from "lodash/trim";
import { Loader2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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

  function handleClear() {
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    setSearch("");
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
        className="pr-10"
        {...props}
      />
      {isPending ? (
        <span className="absolute right-2 top-1/2 size-6 -translate-y-1/2 opacity-50">
          <Loader2Icon className="animate-spin" />
        </span>
      ) : !isEmpty(search) ? (
        <Button
          onClick={handleClear}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 size-6 -translate-y-1/2 opacity-50"
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  );
}
