import { ThemeContext } from "../context/themeContext";
import React, { useContext, useEffect } from "react";

const ThemeProvider = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  // Apply theme class to html element for full page theming
  useEffect(() => {
    document.documentElement.className = theme;
    document.body.className = theme;
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
