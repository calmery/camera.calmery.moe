import React, { useCallback } from "react";
import { NextPage } from "next";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { withRedux, NextPageContextWithRedux, State } from "~/domains";
import { actions } from "~/domains/canvas/actions";
import {
  canvasUserLayerFrame,
  CanvasUserLayerFrame,
} from "~/domains/canvas/frames";
import { Canvas } from "~/containers/Canvas";
import { Menu } from "~/components/Menu";
import { thunkActions } from "~/domains/canvas/actions";
import { FeColorMatrix } from "~/types/FeColorMatrix";

const Container = styled.div`
  width: 100%;
  height: 1000px;
  max-height: 80%;
  text-align: center;

  svg {
    height: 100%;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  -webkit-justify-content: center;
`;

const EditCanvasitems = styled.div`
  text-align: center;
  > * > * {
    margin: 12px 0 0 0;
  }
`;

const Edit: NextPage = () => {
  const dispatch = useDispatch();
  const canvas = useSelector(({ canvas }: State) => canvas);
  const { users } = canvas;
  const handleOnClickFrame = (frame: CanvasUserLayerFrame, index: number) =>
    dispatch(actions.setFrame(frame, index));

  const handleOnClockRemoveImageButton = (index: number) => {
    dispatch(actions.removeCanvasUserLayer(index));
  };

  const onClickBlurButton = useCallback((index, value) => {
    dispatch(actions.setUserLayerFilterValue(index, FeColorMatrix.blur, value));
  }, []);
  const onChangeHueRotate = useCallback((index, value) => {
    dispatch(
      actions.setUserLayerFilterValue(index, FeColorMatrix.hueRotate, value)
    );
  }, []);
  const onChangeLuminanceToAlpha = useCallback((index, value) => {
    dispatch(
      actions.setUserLayerFilterValue(
        index,
        FeColorMatrix.luminanceToAlpha,
        value
      )
    );
  }, []);
  const onClickSaturate = useCallback((index, value) => {
    dispatch(
      actions.setUserLayerFilterValue(index, FeColorMatrix.saturate, value)
    );
  }, []);

  const onClickAddStickerButton = useCallback(
    (url: string) => dispatch(thunkActions.addCanvasStickerLayerWithUrl(url)),
    []
  );

  return (
    <>
      <FlexContainer>
        <Container>
          <Canvas />
        </Container>
        <div>
          {users.layers.map((layer, index) =>
            layer ? (
              <button
                onClick={() => handleOnClockRemoveImageButton(index)}
                key={index}
              >
                Remove: {index}
              </button>
            ) : null
          )}
        </div>
        <EditCanvasitems>
          {users.layers.map(
            (userLayer, index) =>
              userLayer && (
                <div key={index}>
                  <div>{users.frames[index].id}</div>
                  <div>
                    <div>Blur: {userLayer.filter.blur}</div>
                    <button
                      onClick={
                        userLayer.filter.blur > 0
                          ? () =>
                              onClickBlurButton(
                                index,
                                userLayer.filter.blur - 1
                              )
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
                        onChangeHueRotate(
                          index,
                          parseInt(event.target.value, 10)
                        );
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
                              onClickSaturate(
                                index,
                                userLayer.filter.saturate - 1
                              )
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
          <button
            onClick={() => onClickAddStickerButton("/images/stickers/15.png")}
          >
            /images/stickers/15.png
          </button>
          <button onClick={() => dispatch(actions.setDefaultFrame())}>
            Default
          </button>
          {canvasUserLayerFrame[CanvasUserLayerFrame.W3H4].frames.map(
            (_, index) => (
              <button
                onClick={() =>
                  handleOnClickFrame(CanvasUserLayerFrame.W3H4, index)
                }
                key={index}
              >
                3:4 {index}
              </button>
            )
          )}
          {canvasUserLayerFrame[CanvasUserLayerFrame.W4H3].frames.map(
            (_, index) => (
              <button
                onClick={() =>
                  handleOnClickFrame(CanvasUserLayerFrame.W4H3, index)
                }
                key={index}
              >
                4:3 {index}
              </button>
            )
          )}
          <Menu />
        </EditCanvasitems>
      </FlexContainer>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Edit.getInitialProps = async (_: NextPageContextWithRedux) => {
  // ToDo
};

export default withRedux(Edit);
