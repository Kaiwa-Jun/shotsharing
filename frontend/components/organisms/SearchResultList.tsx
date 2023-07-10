import React, { useState, useEffect } from "react";
import { SearchResult } from "../../types/searchResult";
import Image from "next/image";
import Link from "next/link";

type Props = {
  searchResults: SearchResult[];
};

const toFraction = (decimal: number) => {
  if (decimal == null) {
    // decimalがnullまたはundefinedの場合、何らかのデフォルト値を返す
    return "";
  }
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const len = decimal.toString().length - 2;
  let denominator = Math.pow(10, len);
  let numerator = decimal * denominator;
  const divisor = gcd(numerator, denominator); // Should be more than 1
  numerator /= divisor; // Should be less than 10
  denominator /= divisor;
  if (denominator === 1) return `${numerator}`;
  return `${numerator}/${denominator}`;
};

const SearchResultList: React.FC<Props> = ({ searchResults }) => {
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    // いいね数とコメント数を取得する処理をここに書く
  }, [searchResults]);

  const handleLikeClick = async (photoId: number) => {
    // いいねをクリックしたときの処理をここに書く
  };

  return (
    <div className="flex flex-wrap justify-start items-start">
      {searchResults.map((result) => (
        <div
          key={result.id}
          className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2"
        >
          <div className="relative rounded-t-lg">
            <Link href={`/photo/${result.id}`}>
              <Image
                className="rounded-t-lg"
                src={result.file_url}
                alt="Search result"
                width={500}
                height={300}
                objectFit="cover"
                objectPosition="center"
                priority
              />
            </Link>
          </div>
          <div className="p-5">
            <p className="text-gray-500">
              {new Date(result.created_at).toLocaleString()}
            </p>
            <p className="text-gray-900">カメラ : {result.camera_model}</p>
            <p className="text-gray-900">ISO : {result.iso}</p>
            <p className="text-gray-900">F値 : {result.f_value}</p>
            <p className="text-gray-900">
              シャッタースピード :{" "}
              {result.exposure_time < 1
                ? toFraction(result.exposure_time)
                : result.exposure_time}
            </p>
            <p className="text-gray-900">
              撮影日 :{" "}
              {new Date(result.taken_at).toLocaleString("ja-JP", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-900">
              {result.categories.map((category) => (
                <span
                  key={category.id}
                  className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                >
                  {" "}
                  {category.japanese_name}
                </span>
              ))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultList;
