import { NextApiRequest, NextApiResponse } from "next";
import { fetchAccessToken } from "@/lib/server/spotify";

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
