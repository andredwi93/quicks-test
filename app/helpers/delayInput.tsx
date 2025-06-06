import { useEffect } from "react";

function useDebouncedEffect(callback: () => void, deps: any[], delay: number) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
}

export default useDebouncedEffect;
