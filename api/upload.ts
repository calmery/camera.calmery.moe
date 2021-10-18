import { json, restful } from "../utils/api.ts";

export const handler = restful({
  async post({ request, response }) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      response.status = 400;
      return;
    }

    json<{ name: string }>(response, { name: file.name });
  },
});
