/** OPENAPI-ROUTE: post-authenticate */
import jwt from "jsonwebtoken";
import { Context, Request } from "openapi-backend";
import hasher from "wordpress-hash-node";

import config from "../../config";
import authenticate from "../../features/wp/authenticate";
import getUserByName from "../../features/wp/getUserByName";

export default async (c: Context, req: Request, res: OpenapiResponse) => {
  const { username, password } = req.body;
  let userData;
  try {
    userData = await getUserByName(username);
  } catch (e) {
    res.status_code = 401;
    return "Invalid data";
  }

  const checked = hasher.CheckPassword(password, userData.user_pass);

  if (!checked) {
    res.status_code = 401;
    return "Password " + password + " not matching " + userData.user_login;
  }

  const data = await authenticate(userData);

  if (data instanceof Error) {
    res.status_code = 401;
    return "Invalid data";
  }

  const user = {
    ID: data.ID,
    user_email: data.user_email,
    role: data.role,
    tryber_wp_user_id: data.tryber_wp_user_id,
    profile_id: data.profile_id,
  };

  const token = jwt.sign(user, config.jwt.secret, {
    expiresIn: process.env.JWT_EXPIRATION, // token expires in 15 minutes
  });
  const tokenData = jwt.decode(token);
  if (tokenData === null || typeof tokenData === "string") {
    res.status_code = 502;
    return "Failed token generation";
  }

  const { iat, exp } = tokenData;
  const responseJson = {
    id: data.ID,
    username: data.user_login,
    email: data.user_email,
    role: data.role,
    tryber_id: data.tryber_wp_user_id,
    profile_id: data.profile_id,
    token: token,
    iat: iat,
    exp: exp,
  };

  res.status_code = 200;
  return responseJson;
};
