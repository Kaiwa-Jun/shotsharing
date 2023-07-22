![og-image](https://github.com/Kaiwa-Jun/shotsharing/assets/76391902/0a17a975-2a41-4122-9993-2d43d1345d86)

## サービス概要

一眼レフカメラ初心者や撮影設定に苦手意識を持つ人向けに、
初心者が躓くポイントを明確にし、設定の難しさを解消する、
撮影シーンごとの設定値を画像と共にシェアするサービスです。
<br />
<br />
**サービスURL**
<br />
https://shotsharing.vercel.app/

## メインのターゲットユーザー

一眼レフカメラ初心者<br />
カメラに興味があるが操作が複雑なため理解するのが困難と思っている人
<br />
<br />

## ユーザーが抱える課題


カメラには複数の設定値があり、撮影シーンごとにそれらを適切に設定する必要があります。
しかし、この設定方法は無数にあり、カメラ初心者にとっては理解することが困難です。
この課題を解決することは、撮影におけるモチベーションやこれからカメラを始めようとする人のモチベーションにも大きく影響します。
<br />
<br />

## 解決方法

経験者がどのような設定で撮影しているか、画像とともにシェアすることで、カメラ初心者が撮影時の設定値を参考にすることができます。
これにより、撮影のモチベーションが上がり、カメラを始めようとする人にも敷居が下がります。
<br />
<br />



## なぜこのサービスを作りたいと思ったか？

社会人になったタイミングで、私は一眼レフカメラを購入しました。
初めは、撮影シーンごとにカメラの設定を変更することが難しく、カメラの操作が煩雑で理解するのが困難でした。
このため、設定操作が慣れるまで、Web で検索したり、知り合いに聞いたりと大変な思いをしました。
そこで、私は一眼レフカメラ初心者を対象に、撮影シーンに応じた設定値の参考となるサービスを作ることで、カメラに興味がある人たちが撮影の楽しさを手軽に味わえるようにしたいと考えました。
<br />
<br />

## スケジュール

1. 企画（アイデア企画・技術調査）：3/7〜3/14 〆切
2. 設計（README 作成・画面遷移図作成・ER 図作成）：3/14〜3/21 〆切
3. 機能実装：3/22 - 4/23
4. MVP リリース：6/11 〆切
5. 本リリース：6/30
   <br />
   <br />

## 実装機能

### Googleログイン
<p align="center">
<img width="512" alt="ログイン" src="https://github.com/Kaiwa-Jun/shotsharing/assets/76391902/bbc2d992-58ab-4542-927e-7737b8eb1cdd">
</p>
<br />
未ログイン状態でも投稿の閲覧、検索はできますが、投稿をしたり、いいね・コメントなどの機能を使うにはログインが必要です。

ユーザビリティの低下を防ぐためにGoogleアカウントでのログインを採用しています。
      <br />
      <br />

### 画像の投稿（ログインユーザーのみ）
<p align="center">
<img width="507" alt="投稿" src="https://github.com/Kaiwa-Jun/shotsharing/assets/76391902/f16e0c46-33a1-4f3d-8efe-207d6b1fc1ba">
</p>
<br />
ヘッダーの+アイコンから画像の投稿ができます。

撮影した画像を選択して投稿すると一覧画面に遷移し、撮影時のカメラの設定が表示されます。
<br />
<br />

### 投稿の検索
<p align="center">
<img width="1470" alt="検索" src="https://github.com/Kaiwa-Jun/shotsharing/assets/76391902/f56d226b-e1c6-4df1-add8-90ff2da40947">
</p>
<br />
ヘッダーの🔍アイコンから投稿の検索ができます。
<br />
<br />

### いいね（ログインユーザーのみ）
<p align="center">
<img width="354" alt="投稿のいいね" src="https://github.com/Kaiwa-Jun/shotsharing/assets/76391902/3c5f6dc2-a1df-4af6-b449-0e865869ec7a">
</p>
<br />
各投稿のいいねアイコンをタップすることでいいねができます。

マイページから自分がいいねした投稿を参照することもできます。
<br />
<br />

### コメント（ログインユーザーのみ）

<br />
各投稿のコメントアイコンをタップすると、コメント入力ページに遷移し、コメントができます。

マイページから自分がコメントした投稿を参照することもできます。
<br />
<br />

### プロフィールの編集
<p align="center">
<img width="711" alt="プロフィール編集" src="https://github.com/Kaiwa-Jun/shotsharing/assets/76391902/b6e16bf3-88a9-42c0-b328-ba6e69c6d396">
</p>
<br />
マイページからプロフィールの編集ができます。

変更できる項目は、ユーザー名とアバターアイコンになります。
<br />
<br />

---
<br />

## 主な使用技術

### バックエンド
- Rails 6.1.7
- Ruby 3.0.5

### フロントエンド
- React 18.2.0
- TypeScript 5.0.2
- TailwindCSS 3.2.7
- DaisyUI 3.2.1

### インフラ
- heroku
- Vercel
- AWS S3

### 環境構築
- Docker
- docker-compose

### 外部サービス
- Firebase Authentication
- Google Cloud Vision API
- Google Cloud Translate API

---
<br />

## インフラ構成図
![infra drawio](https://github.com/Kaiwa-Jun/shotsharing/assets/76391902/df1a6866-bbc6-4153-bbab-20323aa2c438)


## ER 図
![er drawio (1)](https://github.com/Kaiwa-Jun/shotsharing/assets/76391902/a16e3b63-1eaa-48e9-b3b8-b676d75d98f7)



## 画面遷移図

[Figma](https://www.figma.com/file/yJIKilFlmQci2UixxIPald/%E7%94%BB%E9%9D%A2%E9%81%B7%E7%A7%BB%E5%9B%B3?node-id=0%3A1&t=3c1PpH1fZswfUZJc-1 "画面遷移図")

