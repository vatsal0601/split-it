import { useId } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import type { FC, InputHTMLAttributes, Dispatch, SetStateAction } from "react";

interface StateType {
  value: string;
  errorMessage: string;
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  state: StateType;
  setState: Dispatch<SetStateAction<StateType>>;
  required?: boolean;
}

const Input: FC<Props> = ({ required, label, state, setState, ...rest }) => {
  const id: string = useId();

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block w-full text-xs font-semibold text-slate-600 lg:text-sm"
      >
        <span className={`space-x-1 ${required ? "after:ml-0.5 after:text-red-600 after:content-['*']" : ""}`}>
          {label}
        </span>
      </label>
      <input
        className="w-full truncate rounded-lg border border-slate-200 p-3 text-sm placeholder-slate-400 ring-blue-600 transition-all focus:border-transparent focus:outline-none focus:ring-2 lg:text-base"
        id={id}
        onChange={(e) =>
          setState((state) => ({
            ...state,
            value: e.target.value,
          }))
        }
        value={state.value}
        {...rest}
      />
      {state.errorMessage && (
        <p className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600 lg:text-sm">
          <ExclamationCircleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
          {state.errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
