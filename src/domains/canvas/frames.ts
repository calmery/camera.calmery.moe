export enum CanvasUserLayerFrame {
  W3H4 = "3:4",
  W4H3 = "4:3",
}

export const canvasUserLayerFrame: {
  [_ in CanvasUserLayerFrame]: {
    width: number;
    height: number;
    frames: {
      width: number;
      height: number;
      x: number;
      y: number;
      d: string;
    }[][];
  };
} = {
  [CanvasUserLayerFrame.W3H4]: {
    width: 900,
    height: 1200,
    frames: [
      [
        {
          width: 852,
          height: 564,
          x: 24,
          y: 24,
          d: "M0 0H852V564H0V0Z",
        },
        {
          width: 852,
          height: 564,
          x: 24,
          y: 612,
          d: "M0 0H852V564H0V0Z",
        },
      ],
      [
        {
          width: 852,
          height: 752,
          x: 24,
          y: 24,
          d: "M0 0H852V752L0 376V0Z",
        },
        {
          width: 852,
          height: 752,
          x: 24,
          y: 424,
          d: "M0 0L852 376V752H0V0Z",
        },
      ],
      [
        {
          width: 852,
          height: 564,
          x: 24,
          y: 24,
          d: "M0 0H852V564H0V0Z",
        },
        {
          width: 414,
          height: 564,
          x: 24,
          y: 612,
          d: "M0 0H414V564H0V0Z",
        },
        {
          width: 414,
          height: 564,
          x: 462,
          y: 612,
          d: "M0 0H414V564H0V0Z",
        },
      ],
      [
        {
          width: 852,
          height: 368,
          x: 24,
          y: 24,
          d: "M0 0H852V368H0V0Z",
        },
        {
          width: 852,
          height: 368,
          x: 24,
          y: 416,
          d: "M0 0H852V368H0V0Z",
        },
        {
          width: 852,
          height: 368,
          x: 24,
          y: 808,
          d: "M0 0H852V368H0V0Z",
        },
      ],
    ],
  },
  [CanvasUserLayerFrame.W4H3]: {
    width: 1200,
    height: 900,
    frames: [
      [
        {
          width: 564,
          height: 852,
          x: 24,
          y: 24,
          d: "M0 0H564V852H0V0Z",
        },
        {
          width: 564,
          height: 852,
          x: 612,
          y: 24,
          d: "M0 0H564V852H0V0Z",
        },
      ],
      [
        {
          width: 752,
          height: 852,
          x: 24,
          y: 24,
          d: "M0 0H752L376 852H0V0Z",
        },
        {
          width: 752,
          height: 852,
          x: 424,
          y: 24,
          d: "M376 0H752V852H0L376 0Z",
        },
      ],
      [
        {
          width: 564,
          height: 852,
          x: 24,
          y: 24,
          d: "M0 0H564V852H0V0Z",
        },
        {
          width: 564,
          height: 414,
          x: 612,
          y: 24,
          d: "M0 0H564V414H0V0Z",
        },
        {
          width: 564,
          height: 414,
          x: 612,
          y: 462,
          d: "M0 0H564V414H0V0Z",
        },
      ],
      [
        {
          width: 368,
          height: 852,
          x: 24,
          y: 24,
          d: "M0 0H368V852H0V0Z",
        },
        {
          width: 368,
          height: 852,
          x: 416,
          y: 24,
          d: "M0 0H368V852H0V0Z",
        },
        {
          width: 368,
          height: 852,
          x: 808,
          y: 24,
          d: "M0 0H368V852H0V0Z",
        },
      ],
    ],
  },
};
