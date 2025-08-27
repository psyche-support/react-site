// src/components/ThemeToggle.tsx
import React from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      className="ps-btn ps-btn--ghost"
      style={{ fontSize: "0.85rem" }}
    >
      {dark ? <Sun size={16}/> : <Moon size={16}/>}
    </button>
  );
};

export default ThemeToggle;
