import { SpotifyAccessToken } from "@/lib/public/spotify";
import { useState, useEffect } from "react";
import { ApiResponseRow } from "./ApiResponseRow";

type Props = {
  accessToken: SpotifyAccessToken;
};

export type SpotifyResponseInfo = {
  title: string;
  description: React.ReactNode;
  link: string;
  url: string;
  endpoint: string;
  data: object;
};

export const SpotifyResults: React.FC<Props> = ({ accessToken }) => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<SpotifyResponseInfo[]>([]);

  useEffect(() => {
    callApis(accessToken).then((r) => {
      setLoading(false);
      setResponses(r);
    });
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {responses.map((response) => (
            <ApiResponseRow {...response} />
          ))}
        </>
      )}
    </>
  );
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchToSpotify = async (
  endpoint: string,
  title: string,
  description: React.ReactNode,
  link: string,
  accessToken: SpotifyAccessToken
): Promise<SpotifyResponseInfo> => {
  const url = `https://api.spotify.com/v1/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return { title, description, data, url, link, endpoint };
};

const asyncGen = async function* (
  urls: [string, string, React.ReactNode, string, SpotifyAccessToken][]
) {
  for (const url of urls) {
    await sleep(500);
    yield await fetchToSpotify(...url);
  }
};

const callApis = async (accessToken: SpotifyAccessToken) => {
  const apis: [
    string,
    string,
    React.ReactNode,
    string,
    SpotifyAccessToken
  ][] = [
    [
      "me",
      "ユーザープロフィール",
      "",
      "https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/",
      accessToken,
    ],
    [
      "me/player",
      "現在再生中",
      "beta なので要注意。me/player/currently-playing というエンドポイントもあるが、違いについては未調査",
      "https://developer.spotify.com/documentation/web-api/reference/player/get-information-about-the-users-current-playback/",
      accessToken,
    ],
    [
      "me/following/contains?ids=3z8diLlUCkN1j9N9ZdnfBJ&type=artist",
      "特定のアーティストやユーザーをフォローしているか",
      <>
        指定中のアーティスト:{" "}
        <a
          href="https://open.spotify.com/artist/3z8diLlUCkN1j9N9ZdnfBJ"
          target="_blank"
        >
          https://open.spotify.com/artist/3z8diLlUCkN1j9N9ZdnfBJ
        </a>
      </>,
      "https://developer.spotify.com/documentation/web-api/reference/follow/check-current-user-follows/",
      accessToken,
    ],
    [
      "me/player/recently-played",
      "ユーザーが最近聞いた曲",
      "before, afterのパラメータで期間指定可能",
      "https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/",
      accessToken,
    ],
    [
      "me/albums/contains?ids=59iTZa7NEIzDyoKvNjZDin",
      "ユーザーが特定のアルバムを保存しているか",
      <>
        指定中のアルバム:{" "}
        <a
          href="https://open.spotify.com/album/4TnRXzfReekKIwLJ0reFvA"
          target="_blank"
        >
          https://open.spotify.com/album/4TnRXzfReekKIwLJ0reFvA
        </a>
      </>,
      "https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-tracks/",
      accessToken,
    ],
    [
      "me/tracks/contains?ids=59iTZa7NEIzDyoKvNjZDin",
      "ユーザーが特定の曲を保存しているか",
      <>
        指定中の曲:{" "}
        <a
          href="https://open.spotify.com/album/4TnRXzfReekKIwLJ0reFvA?highlight=spotify:track:59iTZa7NEIzDyoKvNjZDin"
          target="_blank"
        >
          https://open.spotify.com/album/4TnRXzfReekKIwLJ0reFvA?highlight=spotify:track:59iTZa7NEIzDyoKvNjZDin
        </a>
      </>,
      "https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-tracks/",
      accessToken,
    ],
    [
      "me/albums",
      "ユーザーが保存しているアルバム一覧",
      "",
      "https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-albums/",
      accessToken,
    ],
    [
      "me/albums",
      "ユーザーが保存している曲一覧",
      "",
      "https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/",
      accessToken,
    ],
  ];

  const results = [];

  for await (const res of asyncGen(apis)) {
    results.push(res);
  }

  return results;
};
