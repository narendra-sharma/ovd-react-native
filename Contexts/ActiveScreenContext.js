import React, { createContext, useContext, useState } from "react";

//Create a context
const ActiveScreenContext = createContext();

//Create a component provider
export const ActiveScreenProvider = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState("Home");

  return (
    <ActiveScreenContext.Provider value={{ activeScreen, setActiveScreen }}>
      {children}
    </ActiveScreenContext.Provider>
  );
};

//Create a custom hook to access active screen name
export const useCustomActiveScreenStatus = () => {
  const context = useContext(ActiveScreenContext);
  if (!context) {
    throw new Error(
      "useCustomActiveScreenStatus must be used within a ActiveScreenProvider"
    );
  }
  return context;
};
