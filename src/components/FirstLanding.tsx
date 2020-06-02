import React, { useEffect, useCallback, useState } from "react";
import { Tutorial } from "./Tutorial";
import { FIRST_LANDING_SCENARIOS } from "~/constants/tutorials";
import * as GA from "~/utils/google-analytics";

export const FirstLanding: React.FC = () => {
  const [firstLanding, setFirstLanding] = useState(false);

  // Hooks

  useEffect(() => {
    if (!localStorage.getItem("first-landing")) {
      setFirstLanding(true);
      GA.playFirstTutorial();
    }
  }, []);

  // Events

  const save = () => {
    localStorage.setItem("first-landing", new Date().toISOString());
    setFirstLanding(false);
  };

  const handleOnComplete = useCallback(() => {
    GA.completeFirstTutorial();
    save();
  }, []);

  const handleOnStop = useCallback(() => {
    GA.stopFirstTutorial();
    save();
  }, []);

  // Render

  if (!firstLanding) {
    return null;
  }

  return (
    <Tutorial
      scenarios={FIRST_LANDING_SCENARIOS}
      onComplete={handleOnComplete}
      onStop={handleOnStop}
    />
  );
};
