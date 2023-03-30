import { useState } from "react";
import Image from "next/image";

const AboutArea = () => {
  return (
    <>
      <div className="hero-section">
        <section className="bg-white dark:bg-gray-900">
          <div className="grid max-w-screen-xl px-24 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-0 lg:grid-cols-10 ">
            <div className="mr-auto place-self-center lg:col-span-4">
              <h1 className="max-w-2xl mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-2xl xl:text-2xl dark:text-black">
                カメラ初心者の技術向上をサポート
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                本サービスは、カメラ初心者が技術を向上させることを目的とした、画像と撮影時のカメラ設定値をシェアするプラットフォームです。
                経験豊富なユーザーが投稿した画像と設定情報を参考に、自分の撮影スキルを磨きましょう。
              </p>
            </div>
            <div className="hidden lg:mt-0  lg:col-span-5 lg:flex ml-28">
              <Image
                src="/Camera-rafiki.png"
                alt="mockup"
                width={400}
                height={400}
              />
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900">
          <div className="grid max-w-screen-xl px-24 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-0 lg:grid-cols-10">
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <Image
                src="/Camera-rafiki.png"
                alt="mockup"
                width={400}
                height={400}
              />
            </div>
            <div className="mr-auto place-self-center lg:col-span-4">
              <h1 className="max-w-2xl mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-2xl xl:text-2xl dark:text-black">
                コミュニティで知識と経験を共有
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                本サービスでは、撮影時の悩みや疑問を共有し、他のユーザーからアドバイスやフィードバックをもらえるコミュニティ機能が提供されています。
                さまざまな撮影シーンやカメラの設定に関する情報交換を通じて、一緒にカメラの世界を楽しみましょう。
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutArea;
