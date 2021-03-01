import { VercelRequest, VercelResponse } from "@vercel/node";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (_: VercelRequest, res: VercelResponse) => {
  res.status(200).json({ name: "John Doe" });
};
