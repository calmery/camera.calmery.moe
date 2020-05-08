import { combineReducers } from "redux";
import container, { CropperContainerState } from "./container/reducer";
import cropper, { CropperCropperState } from "./cropper/reducer";
import image, { CropperImageState } from "./image/reducer";

export type CropperState = {
  container: CropperContainerState;
  cropper: CropperCropperState;
  image: CropperImageState;
};

export default combineReducers({
  container,
  cropper,
  image,
});
