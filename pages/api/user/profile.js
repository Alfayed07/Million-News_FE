import { proxyRequest } from "../_utils";

export default async function handler(req, res) {
  // Proxy to backend /user/profile for GET (fetch) and PUT/PATCH (update)
  return proxyRequest(req, res, "/user/profile");
}
