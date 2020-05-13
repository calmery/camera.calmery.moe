import React from "react";
import { useSelector } from "react-redux";
import { State } from "~/domains";
import { CanvasFilter } from "~/components/CanvasFilter";

export const CanvasFilters = () => {
  const { users } = useSelector(({ canvas }: State) => canvas);

  return (
    <defs>
      {users.layers.map(
        (userLayer, index) =>
          userLayer && (
            <CanvasFilter
              id={users.frames[index].id}
              {...userLayer}
              key={index}
            />
          )
      )}
    </defs>
  );
};
