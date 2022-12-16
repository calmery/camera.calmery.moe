import { useState } from "react";
import { CanvasResizableContainer } from "~/components/Canvas/ResizableContainer";
import type { Rect } from "~/types/Rect";

const Canvas = () => {
  const [rect, setRect] = useState<Rect>();

  return (
    <CanvasResizableContainer onResize={setRect}>
      {rect && (
        <svg
          height={rect.height}
          overflow="visible"
          viewBox={`0 0 ${rect.width} ${rect.height}`}
          width={rect.width}
        >
          <rect width="100" height="100" fill="red" y={-20} />
        </svg>
      )}
    </CanvasResizableContainer>
  );
};

export default Canvas;
