import { createContext, useContext, useState } from "react";

const ExpandContext = createContext();

export function ExpandProvider({ children }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <ExpandContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </ExpandContext.Provider>
  );
}

export function useExpand() {
  return useContext(ExpandContext);
}
