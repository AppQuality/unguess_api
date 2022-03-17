import * as db from "../../db";

export default async (userData: {
  ID: number;
  user_login: string;
  user_pass: string;
  email: string;
}): Promise<UserType | Error> => {
  let user: UserType = {
    ...userData,
    role: "customer",
    id: 0,
  };

  try {
    // Check capabilities
    const isAdminSql =
      "SELECT * FROM wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value LIKE '%administrator%' AND user_id = ?";
    let isAdminResult = await db.query(
      db.format(isAdminSql, [userData.ID]),
      "unguess"
    );
    if (isAdminResult.length) {
      user.role = "administrator";
    }

    // Check customer info
    const customerInfoSql =
      "SELECT u.user_email, u.user_login, utc.* FROM wp_unguess_user_to_customer utc JOIN wp_users u ON (u.ID = utc.unguess_wp_user_id) WHERE utc.unguess_wp_user_id = ?";
    let customerInfoResult = await db.query(
      db.format(customerInfoSql, [userData.ID]),
      "unguess"
    );
    if (customerInfoResult.length) {
      let result = customerInfoResult[0];
      // The user is a customer
      user.tryber_wp_user_id = result.tryber_wp_user_id;
      user.profile_id = result.profile_id;
      user.id = result.tryber_wp_user_id;
      user.email = result.user_email;
    }
  } catch (e) {
    console.error(e);
    return e as Error;
  }

  return user;
};
