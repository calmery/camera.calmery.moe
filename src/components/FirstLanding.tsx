import React, { useState, useEffect, useCallback } from "react";
import { Tutorial } from "./Tutorial";

export const FirstLanding: React.FC = () => {
  const [firstLanding, setFirstLanding] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("first-landing")) {
      setFirstLanding(false);
    }
  }, []);

  const handleOnClose = useCallback(() => {
    localStorage.setItem("first-landing", new Date().toISOString());
    setFirstLanding(true);
  }, []);

  if (firstLanding) {
    return null;
  }

  return (
    <Tutorial
      skip={false}
      scenarios={[
        {
          characterImageUrl: "https://static.calmery.moe/s/2/3.png",
          focusElementId: null,
          message: "ようこそ！かるめりちゃんカメラへ！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/3.png",
          focusElementId: null,
          message: "説明を担当する愛々璃（あめり）です！これからよろしくね！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/1/8.png",
          focusElementId: null,
          message: "はじめに使い方を説明するね！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/1/8.png",
          focusElementId: null,
          message: "ちょっと長いけど頑張って説明するからついてきて！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/19.png",
          focusElementId: null,
          message: "まずは...",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/1/3.png",
          focusElementId: null,
          message: "諸注意から！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/1/16.png",
          focusElementId: null,
          message: "このアプリ、実は...",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/18.png",
          focusElementId: null,
          message: "まだベータ版なの！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/6.png",
          focusElementId: null,
          message: "だからもしかするとバグがあるかも...",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/3.png",
          focusElementId: "tutorial-control-bar-beta",
          message: "もしバグを見つけたらここをタップ！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/1/7.png",
          focusElementId: "tutorial-control-bar-beta",
          message: "こういうバグを見つけたよって報告してね！\nお願い...！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/19.png",
          focusElementId: null,
          message: "次は...",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/1/11.png",
          focusElementId: null,
          message: "画面の説明をするね！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/3.png",
          focusElementId: "tutorial-control-bar-usage",
          message: "これはヘルプボタン！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/3.png",
          focusElementId: "tutorial-control-bar-usage",
          message: "もし何かわからないことがあればここをタップしてね！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/1/16.png",
          focusElementId: "tutorial-control-bar-usage",
          message: "私が使い方を説明するよ！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/3.png",
          focusElementId: "tutorial-menu",
          message: "次はここ！メニュー！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/3.png",
          focusElementId: "tutorial-menu",
          message: "読み込んだ画像にスタンプをつけたりフィルターをかけたり...",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/3.png",
          focusElementId: "tutorial-menu",
          message: "...",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/11.png",
          focusElementId: "tutorial-menu",
          message: "とにかく色んなことができるの...！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/19.png",
          focusElementId: null,
          message: "次は...",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/5.png",
          focusElementId: null,
          message: "あっ...！これで説明は終わりみたい！",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/15.png",
          focusElementId: null,
          message: "緊張したけどちゃんと説明できて良かった...",
        },
        {
          characterImageUrl: "https://static.calmery.moe/s/2/4.png",
          focusElementId: null,
          message: "これからよろしくね！",
        },
      ]}
      onEnd={handleOnClose}
    />
  );
};
