import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "~/domains";
import { changeUserLayerFilterValue } from "~/domains/canvas/actions";
import { FeColorMatrix } from "~/types/FeColorMatrix";

export const Filters = () => {
  const dispatch = useDispatch();
  const { frames, layers } = useSelector(({ canvas }: State) => canvas);
  const onClickBlurButton = useCallback((index, value) => {
    dispatch(changeUserLayerFilterValue(index, FeColorMatrix.blur, value));
  }, []);
  const onChangeHueRotate = useCallback((index, value) => {
    dispatch(changeUserLayerFilterValue(index, FeColorMatrix.hueRotate, value));
  }, []);
  const onChangeLuminanceToAlpha = useCallback((index, value) => {
    dispatch(
      changeUserLayerFilterValue(index, FeColorMatrix.luminanceToAlpha, value)
    );
  }, []);
  const onClickSaturate = useCallback((index, value) => {
    dispatch(changeUserLayerFilterValue(index, FeColorMatrix.saturate, value));
  }, []);

  return (
    <>
      {layers.users.map(
        (userLayer, index) =>
          userLayer && (
            <div key={index}>
              <div>{frames.users[index].id}</div>
              <div>
                <div>Blur: {userLayer.filter.blur}</div>
                <button
                  onClick={
                    userLayer.filter.blur > 0
                      ? () =>
                          onClickBlurButton(index, userLayer.filter.blur - 1)
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
                  onChange={(event) => {
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
                      ? () =>
                          onClickSaturate(index, userLayer.filter.saturate - 1)
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
          )
      )}
    </>
  );
};
