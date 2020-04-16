import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import { CanvasFilter } from "~/components/CanvasFilter";

export const CanvasFilters = () => {
  const { frames, layers } = useSelector(({ canvas }: State) => canvas);

  return (
    <defs>
      {layers.users.map(
        (userLayer, index) =>
          userLayer && (
            <CanvasFilter
              id={frames.users[index].id}
              {...userLayer}
              key={index}
            />
          )
      )}
    </defs>
  );
};
