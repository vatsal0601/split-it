import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

interface StateType {
  value: string;
  errorMessage: string;
}

interface InputProps {
  initialValue: StateType;
  required?: boolean;
  regex?: RegExp;
  errorMessage?: string;
}

const useText: (props: InputProps) => {
  state: StateType;
  setState: Dispatch<SetStateAction<StateType>>;
  handleBlur: () => void;
} = ({ initialValue, required, regex, errorMessage }) => {
  const [state, setState] = useState<StateType>(initialValue);
  const didMount = useRef<boolean>(false);

  useEffect(() => {
    const validate: () => void = () => {
      if (required && state.value.trim() === "")
        return setState((state) => ({
          ...state,
          errorMessage: "This field is required",
        }));
      if (regex) {
        const validator = regex;
        if (!validator.test(state.value))
          return setState((state) => ({
            ...state,
            errorMessage: errorMessage ?? "Please enter a valid value",
          }));
      }
      return setState((state) => ({ ...state, errorMessage: "" }));
    };

    if (didMount.current) validate();
    else didMount.current = true;
  }, [state.value]);

  const handleBlur: () => void = () => {
    if (state.value.trim() === "" || state.errorMessage !== "") return;
    setState((state) => ({ ...state, value: String(eval(state.value)) }));
  };

  return { state, setState, handleBlur };
};

export default useText;
