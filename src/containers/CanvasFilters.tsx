import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import { CanvasFilter } from "~/components/CanvasFilter";

export const CanvasFilters = () => {
  const users = useSelector(({ canvas }: State) => canvas);

  return (
    <defs>
      {users.userFrames.map((_, index) => {
        const userLayer = users.userLayers[index];

        return (
          userLayer && (
            <CanvasFilter
              id={users.userFrames[index].id}
              {...userLayer}
              key={index}
            />
          )
        );
      })}
    </defs>
  );
};
