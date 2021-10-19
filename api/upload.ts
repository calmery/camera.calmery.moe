import { json, restful, status } from "../utils/api.ts";

export const handler = restful({
  async post({ request, response }) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (
      !(file instanceof File &&
        file.size <= 5120 * 1024 &&
        file.type.startsWith("image/"))
    ) {
      status(response, 400);
      return;
    }

    json<{ name: string }>(response, { name: file.name });
  },
});
