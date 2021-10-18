import type { APIHandler } from "aleph/types.d.ts";

export const handler: APIHandler = async ({ request, response }) => {
  const formData = await request.formData();

  const file = formData.get("file") as File;
  const buffer = await file.arrayBuffer();

  response.json({
    file: file.name,
  });
};
