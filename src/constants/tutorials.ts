import { UAParser } from "ua-parser-js";

const usParser = new UAParser();
const isMobile = usParser.getDevice().type === "mobile";

// First Landing

export const FIRST_LANDING_SCENARIOS = [
  {
    characterImageUrl: "/images/stickers/2/3.png",
    message: "ようこそ！かるめりちゃんカメラへ！",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    message: "説明を担当する愛々璃（あめり）です！これからよろしくね！",
  },
  {
    characterImageUrl: "/images/stickers/1/8.png",
    message: "はじめに使い方を説明するね！",
  },
  {
    characterImageUrl: "/images/stickers/1/8.png",
    message: "ちょっと長いけど頑張って説明するからついてきて！",
  },
  {
    characterImageUrl: "/images/stickers/2/19.png",
    message: "まずは...",
  },
  {
    characterImageUrl: "/images/stickers/1/3.png",
    message: "諸注意から！",
  },
  {
    characterImageUrl: "/images/stickers/1/16.png",
    message: "このアプリ、実は...",
  },
  {
    characterImageUrl: "/images/stickers/2/18.png",
    message: "まだベータ版なの！",
  },
  {
    characterImageUrl: "/images/stickers/2/6.png",
    message: "だからもしかするとバグがあるかも...",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-control-bar-beta",
    message: "もしバグを見つけたらここをタップ！",
  },
  {
    characterImageUrl: "/images/stickers/1/7.png",
    emphasisElementId: "tutorial-control-bar-beta",
    message: "こういうバグを見つけたよって報告してね！\nお願い...！",
  },
  {
    characterImageUrl: "/images/stickers/2/19.png",
    message: "次は...",
  },
  {
    characterImageUrl: "/images/stickers/1/11.png",
    message: "画面の説明をするね！",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-control-bar-usage",
    message: "これはヘルプボタン！",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-control-bar-usage",
    message: "もし何かわからないことがあればここをタップしてね！",
  },
  {
    characterImageUrl: "/images/stickers/1/16.png",
    emphasisElementId: "tutorial-control-bar-usage",
    message: "私が使い方を説明するよ！",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-menu",
    message: "次はここ！メニュー！",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-menu",
    message: "読み込んだ画像にスタンプをつけたりフィルターをかけたり...",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-menu",
    message: "...",
  },
  {
    characterImageUrl: "/images/stickers/2/11.png",
    emphasisElementId: "tutorial-menu",
    message: "とにかく色んなことができるの...！",
  },
  {
    characterImageUrl: "/images/stickers/2/19.png",
    message: "次は...えーっと...",
  },
  {
    characterImageUrl: "/images/stickers/2/5.png",
    message: "うん...！これで説明は終わりみたい！",
  },
  {
    characterImageUrl: "/images/stickers/2/15.png",
    message: "緊張したけどちゃんと説明できて良かった...",
  },
  {
    characterImageUrl: "/images/stickers/2/4.png",
    message: "これからよろしくね！",
  },
];

// Stickers

export const STICKERS_PAGE_WITH_IMAGE_SCENARIOS = [
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-canvas",
    message: "ここには読み込んだ画像、追加したスタンプが表示されるよ！",
  },
  {
    characterImageUrl: "/images/stickers/2/8.png",
    emphasisElementId: "tutorial-canvas",
    message: "画像を読み込んだら画面をタッチ！自由に動かしてみて！",
  },
  {
    characterImageUrl: "/images/stickers/2/11.png",
    emphasisElementId: "tutorial-stickers-images",
    message: "ここにあるスタンプをタップすると画面に追加されるよ！",
  },
  {
    characterImageUrl: "/images/stickers/2/11.png",
    emphasisElementId: "tutorial-stickers-images",
    message: "スタンプは今後も追加していく予定！お楽しみに！",
  },
];

// Tune

export const TUNE_PAHE_WITH_IMAGE_SCENARIOS = [
  {
    characterImageUrl: "/images/stickers/2/17.png",
    emphasisElementId: "tutorial-canvas",
    message: "ここにはフィルターをかける画像が表示されているよ！",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-filters-inputs",
    message: "ここがフィルターの値を変更するところ！",
  },
  {
    characterImageUrl: "/images/stickers/1/15.png",
    emphasisElementId: "tutorial-filters",
    message: "色んなフィルターを使って自分好みの画像にしちゃおう！",
  },
  {
    characterImageUrl: "/images/stickers/2/11.png",
    emphasisElementId: "tutorial-filters-images",
    message: "他の画像にフィルターをかけたい？",
  },
  {
    characterImageUrl: "/images/stickers/2/11.png",
    emphasisElementId: "tutorial-filters-images",
    message: "ここでフィルターをかけたい画像をタップしてみて！",
  },
];

// Crop

export const CROP_PAGE_WITH_IMAGE_SCENARIOS = [
  {
    characterImageUrl: "/images/stickers/2/17.png",
    emphasisElementId: "tutorial-cropper",
    message: "ここにはクロップする画像が表示されているよ！",
  },
  {
    characterImageUrl: "/images/stickers/1/5.png",
    emphasisElementId: "tutorial-cropper",
    message: "画面をドラッグしてクロップ位置を調整したり...",
  },
  ...(isMobile
    ? [
        {
          characterImageUrl: "/images/stickers/1/5.png",
          emphasisElementId: "tutorial-cropper",
          message: "ピンチイン、ピンチアウトして画像の大きさを変えられるの！",
        },
      ]
    : [
        {
          characterImageUrl: "/images/stickers/2/11.png",
          emphasisElementId: "tutorial-cropper",
          message:
            "Shift キーを押しながら画像をドラッグすると画像を回転できるの！",
        },
        {
          characterImageUrl: "/images/stickers/2/11.png",
          emphasisElementId: "tutorial-cropper",
          message:
            "Control (Ctrl) キーを押しながら画像をドラッグすると大きさが変えられるよ！",
        },
      ]),
  {
    characterImageUrl: "/images/stickers/1/16.png",
    emphasisElementId: "tutorial-crop-angle",
    message: "回した角度はここで確認！もうちょっと回してみる？",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-crop-aspect-ratios",
    message:
      "ここではアスペクト比を選べるよ！\n比率を保ったまま操作したいときに使ってね！",
  },
  {
    characterImageUrl: "/images/stickers/2/4.png",
    emphasisElementId: "tutorial-crop-target-images",
    message: "他の画像をクロップしたい？",
  },
  ...(isMobile
    ? [
        {
          characterImageUrl: "/images/stickers/2/4.png",
          emphasisElementId: "tutorial-crop-target-images",
          message: "ここでクロップしたい画像をタップしてみて！",
        },
      ]
    : [
        {
          characterImageUrl: "/images/stickers/2/4.png",
          emphasisElementId: "tutorial-crop-target-images",
          message: "ここでクロップしたい画像をクリックしてみて！",
        },
      ]),
];

// Collages

export const COLLAGES_PAGE_SCENARIOS = [
  {
    characterImageUrl: "/images/stickers/2/5.png",
    emphasisElementId: "tutorial-frames-canvas-frames",
    message: "ここに色んなフレームが用意されているよ！",
  },
  ...(isMobile
    ? []
    : [
        {
          characterImageUrl: "/images/stickers/2/13.png",
          emphasisElementId: "tutorial-canvas",
          message:
            "画像を回転させたいときは Shift キーを押しながら画像をドラッグ！",
        },
        {
          characterImageUrl: "/images/stickers/2/13.png",
          emphasisElementId: "tutorial-canvas",
          message:
            "大きさを変えたいときは Control (Ctrl) キーを押しながら画像をドラッグしてね！",
        },
        {
          characterImageUrl: "/images/stickers/2/5.png",
          emphasisElementId: "tutorial-frames-canvas-frames",
          message:
            "まずはフレームを選んで、それから画像を回転させたり大きさを変えてみてね！",
        },
      ]),
  {
    characterImageUrl: "/images/stickers/1/10.png",
    emphasisElementId: "tutorial-frames-canvas-frames",
    message: "あれっ...もしかして...",
  },
  {
    characterImageUrl: "/images/stickers/2/18.png",
    emphasisElementId: "tutorial-frames-canvas-frames",
    message: "使いたいフレームがない...！？",
  },
  {
    characterImageUrl: "/images/stickers/1/7.png",
    emphasisElementId: "tutorial-control-bar-beta",
    message: "ここからこんなフレームが欲しい！ってリクエストを送ってみて！",
  },
];

// Save

export const SAVE_PAGE_WITH_IMAGE_SCENARIOS = [
  {
    characterImageUrl: "/images/stickers/1/12.png",
    emphasisElementId: "tutorial-save-image",
    message: "完成〜！",
  },
  {
    characterImageUrl: "/images/stickers/2/11.png",
    emphasisElementId: "tutorial-save-image",
    message: "画像を長押しすると保存できるよ！",
  },
  {
    characterImageUrl: "/images/stickers/1/11.png",
    emphasisElementId: "tutorial-save-image",
    message: "Twitter で「#かるめりちゃんカメラ」を付けてツイートしてみて！",
  },
  {
    characterImageUrl: "/images/stickers/2/3.png",
    emphasisElementId: "tutorial-save-image",
    message: "使ってくれてありがとう！",
  },
];

// Common

export const PAGE_WITHOUT_IMAGE_SCENARIOS = [
  {
    characterImageUrl: "/images/stickers/2/17.png",
    emphasisElementId: "tutorial-canvas",
    message: "まずはここをタップして画像を読み込んでみて！",
  },
];
