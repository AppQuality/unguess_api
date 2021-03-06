/** OPENAPI-ROUTE: post-authenticate */
import getUserFeatures from "@src/features/wp/getUserFeatures";
import jwt from "jsonwebtoken";
import { Context, Request } from "openapi-backend";
import hasher from "wordpress-hash-node";
import config from "@src/config";
import authenticate from "@src/features/wp/authenticate";
import getUserByName from "@src/features/wp/getUserByName";
import { ERROR_MESSAGE } from "@src/utils/constants";

export default async (c: Context, req: Request, res: OpenapiResponse) => {
  const { username, password } = req.body;
  let userData;

  let error = {
    error: true,
    message: ERROR_MESSAGE,
  } as StoplightComponents["schemas"]["Error"];

  try {
    userData = await getUserByName(username);

    let features = await getUserFeatures(userData.ID);

    const checked = hasher.CheckPassword(password, userData.user_pass);

    if (!checked) {
      res.status_code = 403;
      return { ...error, code: 403 };
    }

    const data = await authenticate(userData);

    const user = {
      id: data.id,
      email: data.email,
      role: data.role,
      tryber_wp_user_id: data.tryber_wp_user_id,
      unguess_wp_user_id: data.unguess_wp_user_id,
      profile_id: data.profile_id,
    };

    const token = jwt.sign(user, config.jwt.secret, {
      expiresIn: process.env.JWT_EXPIRATION || "15m", // token expires in 15 minutes
    });

    const tokenData = jwt.decode(token);
    if (tokenData === null || typeof tokenData === "string") {
      res.status_code = 403;
      return { ...error, code: 403 };
    }

    const { iat, exp } = tokenData;
    const responseJson: StoplightComponents["schemas"]["Authentication"] = {
      id: data.id,
      name: data.user_login,
      email: data.email,
      role: data.role,
      token: token,
      ...(iat && { iat: iat }),
      ...(exp && { exp: exp }),
      ...(features && { features: features }),
    };

    res.status_code = 200;

    return responseJson;
  } catch (e: any) {
    if (e.code) {
      error.code = e.code;
      res.status_code = e.code;
    } else {
      error.code = 500;
      res.status_code = 500;
    }

    return error;
  }
};
