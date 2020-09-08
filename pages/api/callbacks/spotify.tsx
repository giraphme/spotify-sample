import { NextApiRequest, NextApiResponse } from "next";
import { fetchAccessToken } from "@/lib/server/spotify";

// This will be get the like following request by Spotify.
// /callbacks/spotify?code=AQA8K-4MEx4C6...uTe8W-WKlQ
//
// refs. https://developer.spotify.com/documentation/general/guides/authorization-guide/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query.code;

  if (Array.isArray(code) || !code) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const accessToken = await fetchAccessToken(code).catch((errorCode) => {
    res.status(400).json({
      error: `[${errorCode}]: Invalid authentication code. please retry`,
    });
    return null;
  });

  if (!accessToken) {
    return;
  }

  res.status(200).json({ accessToken });
};
