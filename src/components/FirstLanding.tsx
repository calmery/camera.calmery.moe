import React, { useEffect, useCallback, useState } from "react";
import { Tutorial } from "./Tutorial";
import { FIRST_LANDING_SCENARIOS } from "~/constants/tutorials";

export const FirstLanding: React.FC = () => {
  const [firstLanding, setFirstLanding] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("first-landing")) {
      setFirstLanding(false);
    }
  }, []);

  const handleOnClose = useCallback(() => {
    localStorage.setItem("first-landing", new Date().toISOString());
    setFirstLanding(true);
  }, []);

  if (firstLanding) {
    return null;
  }

  return (
    <Tutorial scenarios={FIRST_LANDING_SCENARIOS} onComplete={handleOnClose} />
  );
};
