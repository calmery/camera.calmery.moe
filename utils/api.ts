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
}): APIHandler => {
  return (context) => {
    const { request, response } = context;

    if (request.method === "GET" && get) {
      return get(context);
    } else if (request.method === "DELETE" && _delete) {
      return _delete(context);
    } else if (request.method === "POST" && post) {
      return post(context);
    } else if (request.method === "PUT" && put) {
      return put(context);
    }

    response.status = 404;
  };
};
