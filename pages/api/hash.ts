import { NextApiRequest, NextApiResponse } from "next";

import { encode } from "../../utils/codec";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const date = "6666-06-06";
  const word = "kontlo";
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=60, stale-while-revalidate=3600"
  // );
  res.status(200).json({ hash: encode(word), date: date });
}
