import { APIContext, APIHandler } from "aleph/types.d.ts";

export const json = <T extends object>(
  response: APIContext["response"],
  data: T,
) => {
  response.json(data);
};

export const restful = ({
  delete: _delete,
  get,
  post,
  put,
}: {
  delete?: APIHandler;
  get?: APIHandler;
  post?: APIHandler;
  put?: APIHandler;
}) => {
  const handler: APIHandler = async (context) => {
    const { request, response } = context;

    if (request.method === "GET" && get) {
      await get(context);
    } else if (request.method === "DELETE" && _delete) {
      await _delete(context);
    } else if (request.method === "POST" && post) {
      await post(context);
    } else if (request.method === "PUT" && put) {
      await put(context);
    } else {
      response.status = 404;
    }
  };

  return handler;
};
