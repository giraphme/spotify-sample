import { retriveAccessToken, SpotifyAccessToken } from "@/lib/public/spotify";
import { useEffect, useState } from "react";
import { SpotifyResults } from "@/client/components/SpotifyResults";

const IndexPage = () => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<
    SpotifyAccessToken | undefined
  >();

  useEffect(() => {
    const maybeAccessToken = retriveAccessToken();
    setAccessToken(maybeAccessToken);
    setLoading(false);
  }, []);

  return (
    <>
      {!loading && (
        <>
          {!accessToken && <a href="/api/auth/spotify">login with spotify</a>}
          {accessToken && (
            <>
              <a href="/api/auth/spotify">re-login with spotify</a>
              <SpotifyResults accessToken={accessToken} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default IndexPage;
