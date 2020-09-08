import qs from "qs";

export const makeAuthUrl = () => {
  const queries = {
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: "user-read-private user-read-email",
    redirect_uri: `${process.env.HOST_BASE_URL}/callbacks/spotify`,
  };

  return `https://accounts.spotify.com/authorize${qs.stringify(queries)}`;
};
