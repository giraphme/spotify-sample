import qs from "qs";
import { SpotifyAccessToken } from "../public/spotify";

type RawSpotifyAccessToken = {
  access_token: string; // An access token that can be provided in subsequent calls, for example to Spotify Web API services.
  token_type: string; // How the access token may be used: always “Bearer”.
  scope: string; // A space-separated list of scopes which have been granted for this access_token
  expires_in: number; // The time period (in seconds) for which the access token is valid.
  refresh_token: string; // A token that can be sent to the Spotify Accounts service in place of an authorization code. (When the access code expires, send a POST request to the Accounts service /api/token endpoint, but use this code in place of an authorization code. A new access token will be returned. A new refresh token might be returned too.)
};

const authCallbackUrl = `${process.env.HOST_BASE_URL}/callbacks/spotify`;

export const makeAuthUrl = () => {
  const queries = {
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: [
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-email",
      "user-read-private",
      "playlist-read-collaborative",
      "playlist-read-private",
      "user-library-read",
      "user-top-read",
      "user-read-playback-position",
      "user-read-recently-played",
      "user-follow-read",
    ].join(" "),
    redirect_uri: authCallbackUrl,
  };

  return `https://accounts.spotify.com/authorize?${qs.stringify(queries)}`;
};

export const fetchAccessToken = async (
  code: string
): Promise<SpotifyAccessToken | null> => {
  const tokenSeed = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  const authorizationToken = Buffer.from(tokenSeed).toString("base64");

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${authorizationToken}`,
  };

  const response = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "post",
    headers,
    body: qs.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: authCallbackUrl,
    }),
  });

  const data = await response.json();

  if (response.status !== 200) {
    return Promise.reject(data?.error || null);
  }

  const raw: RawSpotifyAccessToken = data;

  return {
    accessToken: raw.access_token,
    tokenType: raw.token_type,
    scope: raw.scope,
    expiresIn: raw.expires_in,
    refreshToken: raw.refresh_token,
  };
};
