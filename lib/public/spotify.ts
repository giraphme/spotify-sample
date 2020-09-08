export type SpotifyAccessToken = {
  accessToken: string;
  tokenType: string;
  scope: string;
  expiresIn: number;
  refreshToken: string;
};

const localStorageKey = "__spotify_example_access_token";

export const storeAccessToken = (
  maybeToken: SpotifyAccessToken | undefined
) => {
  if (maybeToken) {
    window.localStorage.setItem(localStorageKey, JSON.stringify(maybeToken));
  } else {
    window.localStorage.removeItem(localStorageKey);
  }
};

export const retriveAccessToken = (): SpotifyAccessToken | undefined => {
  const maybeToken = window.localStorage.getItem(localStorageKey);

  if (maybeToken) {
    // TODO: check the expiration.
    return JSON.parse(maybeToken);
  }

  return undefined;
};
