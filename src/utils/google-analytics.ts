import ReactGA from "react-ga";
import { CanvasUserLayerFrameType } from "~/types/CanvasUserLayerFrameType";

ReactGA.initialize("UA-163144493-2", {
  debug: process.env.NODE_ENV !== "production",
  testMode: process.env.NODE_ENV === "test",
});

export const showFirstTutorial = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "FIRST_TUTORIAL",
    eventAction: "OPEN",
  });
};

export const hideFirstTutorial = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "FIRST_TUTORIAL",
    eventAction: "CLOSE",
  });
};

export const showTutorial = (url: string) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "TUTORIAL",
    eventAction: "OPEN",
    eventLabel: url,
  });
};

export const hideTutorial = (url: string) => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "TUTORIAL",
    eventAction: "CLOSE",
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

export const enableCollage = (
  frame: CanvasUserLayerFrameType,
  index: number
) => {
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
  ReactGA.send({
    hitType: "event",
    eventCategory: "PAGE",
    eventAction: "CHANGE",
    eventLabel: url,
  });
};

export const clickBetaButton = () => {
  ReactGA.send({
    hitType: "event",
    eventCategory: "BETA",
    eventAction: "OPEN_MENU",
  });
};
