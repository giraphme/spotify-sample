import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import qs from "qs";
import { storeAccessToken } from "@/lib/public/spotify";

// This will be get the like following request by Spotify.
// /callbacks/spotify?code=AQA8K-4MEx4C6...uTe8W-WKlQ
//
// refs. https://developer.spotify.com/documentation/general/guides/authorization-guide/

const CallbackSpotify: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const code = router.query.code;

    fetch(`/api/callbacks/spotify?${qs.stringify({ code })}`).then(
      async (response) => {
        const data = await response.json();
        storeAccessToken(data?.accessToken);
        router.replace("/");
      }
    );
  }, []);

  return <>redirecting...</>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default CallbackSpotify;
