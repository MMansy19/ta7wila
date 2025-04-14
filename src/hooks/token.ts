import { useEffect, useState } from "react";

export function useLocalStorage(key: string, defaultValue: string = ""): string {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key) ?? defaultValue;
    setValue(storedValue);
  }, [key, defaultValue]);

  return value;
}
