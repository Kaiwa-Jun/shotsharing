import Image from "next/image";

const HeroSection = () => {
  return (
    <>
      <div className="hero-section">
        <section className="bg-gray-400 dark:bg-gray-900">
          <div className="grid max-w-screen-xl px-24 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-0 lg:grid-cols-10">
            <div className="mr-auto place-self-center lg:col-span-6">
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-black">
                Shot Sharing
              </h1>
              <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl dark:text-black">
                カメラ初心者向け
                <br />
                画像・設定値シェアサービス
              </p>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-4 lg:flex">
              <Image
                src="/Camera-rafiki.png"
                alt="mockup"
                width={250}
                height={250}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HeroSection;
