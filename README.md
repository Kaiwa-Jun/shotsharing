# Shot Sharing

## サービス概要

---

一眼レフカメラ初心者や撮影設定に苦手意識を持つ人向けに、
初心者が躓くポイントを明確にし、設定の難しさを解消する、
撮影シーンごとの設定値を画像と共にシェアするサービスです。
<br />
<br />

## メインのターゲットユーザー

---

一眼レフカメラ初心者
カメラに興味があるが操作が複雑なため理解するのが困難と思っている人
<br />
<br />

## ユーザーが抱える課題

---

カメラには複数の設定値があり、撮影シーンごとにそれらを適切に設定する必要があります。
しかし、この設定方法は無数にあり、カメラ初心者にとっては理解することが困難です。
この課題を解決することは、撮影におけるモチベーションやこれからカメラを始めようとする人のモチベーションにも大きく影響します。
<br />
<br />

## 解決方法

---

経験者がどのような設定で撮影しているか、画像とともにシェアすることで、カメラ初心者が撮影時の設定値を参考にすることができます。
これにより、撮影のモチベーションが上がり、カメラを始めようとする人にも敷居が下がります。
<br />
<br />

## 実装予定の機能

---

- 一般ユーザー
  - ログイン画面らからログインができる
    - google アカウントでのログインができる
    - twitter アカウントでのログインができる
  - ログインが必要な機能を使用する際は、ログインを促し、ログイン画面に遷移できる
  - 一覧画面の閲覧ができる
    - 画像と設定値がセットで表示できる
  - 画像詳細画面の閲覧ができる
    - 画像と設定値がセットで表示できる
    - その画像に関連する他ユーザーの画像一覧の閲覧ができる
    - 撮影場所の地図が表示できる
      - 位置情報の ON/OFF ができる
  - 撮影シーン毎に画像の検索ができる
  - 来月のおすすめスポットを閲覧できる
- ログインユーザー
  - ログアウトができる
  - 一覧画面の閲覧ができる
    - 画像と設定値がセットで表示できる
  - 画像詳細画面の閲覧ができる
    - 画像と設定値がセットで表示できる
    - その画像に関連する他ユーザーの画像一覧の閲覧ができる
    - 撮影場所の地図が表示される
      - 位置情報の ON/OFF ができる
  - 撮影シーン毎に画像の検索ができる
  - 来月のおすすめスポットを閲覧できる
  - 画像の投稿ができる
  - 投稿の編集ができる
  - 投稿にいいねができる
  - 投稿にお気に入りができる
  - 投稿にコメントができる
  - マイページの閲覧ができる
    - マイページには自分が投稿した画像一覧が表示される
    - お気に入りした画像一覧が表示される
      <br />
      <br />

## なぜこのサービスを作りたいと思ったか？

---

社会人になったタイミングで、私は一眼レフカメラを購入しました。
初めは、撮影シーンごとにカメラの設定を変更することが難しく、カメラの操作が煩雑で理解するのが困難でした。
このため、設定操作が慣れるまで、Web で検索したり、知り合いに聞いたりと大変な思いをしました。
そこで、私は一眼レフカメラ初心者を対象に、撮影シーンに応じた設定値の参考となるサービスを作ることで、カメラに興味がある人たちが撮影の楽しさを手軽に味わえるようにしたいと考えました。
<br />
<br />

## スケジュール

---

1. 企画（アイデア企画・技術調査）：3/7〜3/14 〆切
2. 設計（README 作成・画面遷移図作成・ER 図作成）：3/14〜3/21 〆切
3. 機能実装：3/22 - 4/23
4. MVP リリース：6/11 〆切
5. 本リリース：6/30
   <br />
   <br />

## ER 図
---

![erd](https://user-images.githubusercontent.com/76391902/226364239-a1447071-0d75-49a2-a93b-530d719d6f54.png)


## 画面遷移図

---

[Figma](https://www.figma.com/file/yJIKilFlmQci2UixxIPald/%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB%E5%9B%B3?node-id=0%3A1&t=3c1PpH1fZswfUZJc-1 "画面遷移図")

