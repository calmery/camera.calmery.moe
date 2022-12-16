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
          viewBox={`0 0 ${rect.width} ${rect.height}`}
          width={rect.width}
        />
      )}
    </CanvasResizableContainer>
  );
};

export default Canvas;
