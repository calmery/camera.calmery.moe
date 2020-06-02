import ReactGA from "react-ga";
import { CanvasUserFrameType } from "~/types/CanvasUserFrameType";

ReactGA.initialize("UA-163144493-2", {
  debug: process.env.NODE_ENV !== "production",
  testMode: process.env.NODE_ENV === "test",
});

export const playFirstTutorial = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "FIRST_TUTORIAL",
    eventAction: "PLAY",
  });
};

export const stopFirstTutorial = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "FIRST_TUTORIAL",
    eventAction: "STOP",
  });
};

export const completeFirstTutorial = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "FIRST_TUTORIAL",
    eventAction: "COMPLETE",
  });
};

export const playTutorial = (url: string) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "TUTORIAL",
    eventAction: "PLAY",
    eventLabel: url,
  });
};

export const stopTutorial = (url: string) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "TUTORIAL",
    eventAction: "STOP",
    eventLabel: url,
  });
};

export const completeTutorial = (url: string) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "TUTORIAL",
    eventAction: "COMPLETE",
    eventLabel: url,
  });
};

export const addCanvasUserLayer = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "CANVAS_USER_LAYER",
    eventAction: "ADD",
  });
};

export const removeCanvasUserLayer = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "CANVAS_USER_LAYER",
    eventAction: "REMOVE",
  });
};

export const addCanvasStickerLayer = (group: number, id: number) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "CANVAS_STICKER_LAYER",
    eventAction: "ADD",
    eventLabel: `${group}/${id}`,
  });
};

export const removeCanvasStickerLayer = (group: number, id: number) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "CANVAS_STICKER_LAYER",
    eventAction: "REMOVE",
    eventLabel: `${group}/${id}`,
  });
};

export const enableCollage = (frame: CanvasUserFrameType, index: number) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "CANVAS_USER_FRAME",
    eventAction: "ENABLE_COLLAGE",
    eventLabel: `${frame}/${index}`,
  });
};

export const disableCollage = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "CANVAS_USER_FRAME",
    eventAction: "DISABLE_COLLAGE",
  });
};

export const saveCanvas = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "CANVAS",
    eventAction: "SAVE",
  });
};

export const changePage = (url: string) => {
  ReactGA.pageview(url);
};

export const clickBetaButton = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "BETA",
    eventAction: "OPEN_MENU",
  });
};
