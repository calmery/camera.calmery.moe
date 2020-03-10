import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "~/modules";
import { changeUserLayerFilterValue } from "~/modules/canvas/actions";

export const Filters = () => {
  const dispatch = useDispatch();
  const { userLayers } = useSelector(({ canvas }: State) => canvas);
  const onClickBlurButton = useCallback((index, value) => {
    dispatch(changeUserLayerFilterValue(index, "blur", value));
  }, []);
  const onChangeHueRotate = useCallback((index, value) => {
    dispatch(changeUserLayerFilterValue(index, "hueRotate", value));
  }, []);
  const onChangeLuminanceToAlpha = useCallback((index, value) => {
    dispatch(changeUserLayerFilterValue(index, "luminanceToAlpha", value));
  }, []);
  const onClickSaturate = useCallback((index, value) => {
    dispatch(changeUserLayerFilterValue(index, "saturate", value));
  }, []);

  return (
    <>
      {userLayers.map((userLayer, index) => (
        <div key={index}>
          <div>{userLayer.id}</div>
          <div>
            <div>Blur: {userLayer.filter.blur}</div>
            <button
              onClick={
                userLayer.filter.blur > 0
                  ? () => onClickBlurButton(index, userLayer.filter.blur - 1)
                  : undefined
              }
            >
              -
            </button>
            <button
              onClick={() =>
                onClickBlurButton(index, userLayer.filter.blur + 1)
              }
            >
              +
            </button>
          </div>
          <div>
            <div>hueRotate</div>
            <input
              type="range"
              min="0"
              max="359"
              defaultValue={userLayer.filter.hueRotate}
              onChange={event => {
                onChangeHueRotate(index, parseInt(event.target.value, 10));
              }}
            />
          </div>
          <div>
            <div>luminanceToAlpha</div>
            <input
              type="checkbox"
              checked={userLayer.filter.luminanceToAlpha}
              onChange={() => {
                onChangeLuminanceToAlpha(
                  index,
                  !userLayer.filter.luminanceToAlpha
                );
              }}
            />
          </div>
          <div>
            <div>saturate: {userLayer.filter.saturate}</div>
            <button
              onClick={
                userLayer.filter.saturate > 0
                  ? () => onClickSaturate(index, userLayer.filter.saturate - 1)
                  : undefined
              }
            >
              -
            </button>
            <button
              onClick={() =>
                onClickSaturate(index, userLayer.filter.saturate + 1)
              }
            >
              +
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
