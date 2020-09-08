import { NextApiRequest, NextApiResponse } from "next";
import { makeAuthUrl } from "@/lib/server/spotify";

export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("location", makeAuthUrl());
  res.statusCode = 302;
  res.end();
};
