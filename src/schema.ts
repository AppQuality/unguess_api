/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    /** Get all routes available for this apis */
    get: operations["get-root"];
    parameters: {};
  };
  "/authenticate": {
    /** A request to login with your username and password */
    post: operations["post-authenticate"];
  };
  "/projects": {
    /** Get all projects that you can view. A project is a collection of campaigns linked with your account. */
    get: operations["get-projects"];
  };
  "/users/me": {
    /** Get current logged user's info */
    get: operations["get-users-me"];
  };
}

export interface components {
  schemas: {
    /** User */
    User: {
      username?: string;
      name?: string;
      surname?: string;
      /** Format: email */
      email?: string;
      /** Format: uri */
      image?: string;
      id?: number;
      wp_user_id?: number;
      role?: string;
      is_verified?: boolean;
    };
    /** Project */
    Project: {
      name?: string;
    };
  };
  responses: {
    /** A user */
    UserData: {
      content: {
        "application/json": components["schemas"]["User"];
      };
    };
    /** Authentication data. The token can be used to authenticate the protected requests */
    Authentication: {
      content: {
        "application/json": {
          id?: number;
          firstName?: string;
          lastName?: string;
          token?: string;
          username?: string;
        };
      };
    };
    /** An error due to the resource not existing */
    NotFound: {
      content: {
        "application/json": {
          element: string;
          id: number;
          message: string;
        };
      };
    };
    /** An error due to missing required parameters */
    MissingParameters: {
      content: {
        "application/json": {
          message: string;
        };
      };
    };
    /** An error due to insufficient authorization to access the resource */
    NotAuthorized: {
      content: {
        "application/json": {
          message?: string;
        };
      };
    };
  };
  parameters: {
    /** @description A campaign id */
    campaign: string;
    /** @description A task id */
    task: string;
    /** @description A customer id */
    customer: string;
    /** @description A project id */
    project: string;
    /** @description Max items to retrieve */
    limit: number;
    /** @description Items to skip for pagination */
    start: number;
    /** @description Key-value Array for item filtering */
    filterBy: { [key: string]: unknown };
    /** @description How to order values (ASC, DESC) */
    order: "ASC" | "DESC";
    /** @description How to localize values */
    locale: "en" | "it";
    /** @description A comma separated list of fields which will be searched */
    searchBy: string;
    /** @description The value to search for */
    search: string;
  };
}

export interface operations {
  /** Get all routes available for this apis */
  "get-root": {
    parameters: {};
    responses: {
      /** OK */
      200: {
        content: {
          "application/json": { [key: string]: unknown };
        };
      };
    };
  };
  /** A request to login with your username and password */
  "post-authenticate": {
    parameters: {};
    responses: {
      200: components["responses"]["Authentication"];
      /** Unauthorized */
      401: {
        content: {
          "application/json": string;
        };
      };
    };
    /** A JSON containing username and password */
    requestBody: {
      content: {
        "application/json": {
          username: string;
          password: string;
        };
      };
    };
  };
  /** Get all projects that you can view. A project is a collection of campaigns linked with your account. */
  "get-projects": {
    parameters: {
      query: {
        /** A generic query parameter */
        "my-parameter"?: number;
      };
    };
    responses: {
      /** A list of projects */
      200: {
        content: {
          "application/json": {
            items?: {
              id?: number;
              name?: string;
              description?: string;
            }[];
          };
        };
      };
      403: components["responses"]["NotAuthorized"];
      404: components["responses"]["NotFound"];
    };
  };
  /** Get current logged user's info */
  "get-users-me": {
    parameters: {};
    responses: {
      200: {
        content: {
          "application/json": {
            id: number;
            email: string;
            role: string;
            name: string;
            tryber_wp_user_id?: number;
            profile_id?: number;
          };
        };
      };
      403: components["responses"]["NotAuthorized"];
      404: components["responses"]["NotFound"];
    };
  };
}

export interface external {}
