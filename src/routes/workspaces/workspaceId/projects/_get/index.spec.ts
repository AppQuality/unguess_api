import app from "@src/app";
import request from "supertest";
import { adapter as dbAdapter } from "@src/__mocks__/database/companyAdapter";
import { ERROR_MESSAGE, LIMIT_QUERY_PARAM_DEFAULT } from "@src/utils/constants";

const customer_profile_1 = {
  id: 1,
  wp_user_id: 1,
  name: "Customer",
  surname: "Customer",
  email: "customer@unguess.io",
};

const customer_1 = {
  id: 1,
  company: "Company 1",
  company_logo: "logo1.png",
  tokens: 100,
};

const customer_2 = {
  id: 2,
  company: "Company 2",
  company_logo: "logo2.png",
  tokens: 200,
};

const user_to_customer_1 = {
  wp_user_id: 1,
  customer_id: 1,
};

const user_to_customer_2 = {
  wp_user_id: 2,
  customer_id: 2,
};

const project_1 = {
  id: 1,
  display_name: "Projettino unoh",
  customer_id: 1,
};

const project_2 = {
  id: 2,
  display_name: "Projettino dueh",
  customer_id: 2,
};

const project_3 = {
  id: 3,
  display_name: "Projettino treh",
  customer_id: 1,
};

const user_to_project_1 = {
  wp_user_id: 1,
  project_id: 1,
};

const user_to_project_2 = {
  wp_user_id: 2,
  project_id: 2,
};

const user_to_project_3 = {
  wp_user_id: 1,
  project_id: 3,
};

const user_to_project_4 = {
  wp_user_id: 2,
  project_id: 1,
};

const campaign_1 = {
  id: 1,
  start_date: "2017-07-20 00:00:00",
  end_date: "2017-07-20 00:00:00",
  close_date: "2017-07-20 00:00:00",
  title: "Campagnetta Funzionale Provetta 1",
  customer_title: "titolo 1",
  description: "Descrizione della campagnazione 1",
  status_id: 1,
  is_public: 0,
  campaign_type_id: 1,
  project_id: 1,
  customer_id: 2,
};

const campaign_2 = {
  id: 2,
  start_date: "2017-07-20 00:00:00",
  end_date: "2017-07-20 00:00:00",
  close_date: "2017-07-20 00:00:00",
  title: "Campagnetta Funzionale Provetta 2",
  customer_title: "titolo 2",
  description: "Descrizione della campagnazione 2",
  status_id: 1,
  is_public: 0,
  campaign_type_id: 1,
  project_id: 1,
  customer_id: 2,
};

const campaign_3 = {
  id: 3,
  start_date: "2017-07-20 00:00:00",
  end_date: "2017-07-20 00:00:00",
  close_date: "2017-07-20 00:00:00",
  title: "Campagnetta Funzionale Provetta 3",
  customer_title: "titolo 3",
  description: "Descrizione della campagnazione 3",
  status_id: 1,
  is_public: 0,
  campaign_type_id: 1,
  project_id: 3,
  customer_id: 2,
};

describe("GET /workspaces/{wid}/projects", () => {
  beforeAll(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbAdapter.create();

        await dbAdapter.add({
          campaigns: [campaign_1, campaign_2, campaign_3],
          profiles: [customer_profile_1],
          companies: [customer_1, customer_2],
          projects: [project_1, project_2, project_3],
          userToCustomers: [user_to_customer_1, user_to_customer_2],
          userToProjects: [
            user_to_project_1,
            user_to_project_2,
            user_to_project_3,
            user_to_project_4,
          ],
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }

      resolve(true);
    });
  });

  afterAll(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbAdapter.drop();
      } catch (error) {
        console.error(error);
        reject(error);
      }

      resolve(true);
    });
  });

  it("Should answer 200 if logged in", async () => {
    const response = await request(app)
      .get(`/workspaces/${customer_1.id}/projects`)
      .set("authorization", "Bearer customer");
    expect(response.status).toBe(200);
  });

  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).get(
      `/workspaces/${customer_1.id}/projects`
    );
    expect(response.status).toBe(403);
  });

  it("Should answer with only the visible projects", async () => {
    const response = await request(app)
      .get(`/workspaces/${customer_1.id}/projects`)
      .set("authorization", "Bearer customer");
    expect(JSON.stringify(response.body)).toStrictEqual(
      JSON.stringify({
        items: [
          {
            id: project_1.id,
            name: project_1.display_name,
            campaigns_count: 2,
          },
          {
            id: project_3.id,
            name: project_3.display_name,
            campaigns_count: 1,
          },
        ],
        start: 0,
        limit: LIMIT_QUERY_PARAM_DEFAULT,
        size: 2,
        total: 2,
      })
    );
  });

  it("Should answer with only one visible project because of limit 1", async () => {
    const response = await request(app)
      .get(`/workspaces/${customer_1.id}/projects?start=0&limit=1`)
      .set("authorization", "Bearer customer");
    expect(JSON.stringify(response.body)).toStrictEqual(
      JSON.stringify({
        items: [
          {
            id: project_1.id,
            name: project_1.display_name,
            campaigns_count: 2,
          },
        ],
        start: 0,
        limit: 1,
        size: 1,
        total: 2,
      })
    );
  });

  it("Should answer 400 if wid is a string", async () => {
    const response = await request(app)
      .get(`/workspaces/asd/projects`)
      .set("authorization", "Bearer customer");
    expect(response.status).toBe(400);
  });

  it("Should return 403 if workspace is not found", async () => {
    const result = await request(app)
      .get(`/workspaces/9999/projects`)
      .set("authorization", "Bearer customer");
    expect(result.body.code).toBe(403);
    expect(result.body.message).toBe(ERROR_MESSAGE);
  });

  it("Should return a list of projects if customer is present and has some projects", async () => {
    const response = await request(app)
      .get(`/workspaces/${customer_1.id}/projects`)
      .set("authorization", "Bearer customer");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeGreaterThan(0);
    response.body.items.forEach((project: Object) => {
      expect(project).toHaveProperty("id");
      expect(project).toHaveProperty("name");
      expect(project).toHaveProperty("campaigns_count");
    });
  });

  it("Should return only the projects that the user can see", async () => {
    const response = await request(app)
      .get(`/workspaces/${customer_1.id}/projects`)
      .set("authorization", "Bearer customer");
    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).toStrictEqual(
      JSON.stringify({
        items: [
          {
            id: project_1.id,
            name: project_1.display_name,
            campaigns_count: 2,
          },
          {
            id: project_3.id,
            name: project_3.display_name,
            campaigns_count: 1,
          },
        ],
        start: 0,
        limit: LIMIT_QUERY_PARAM_DEFAULT,
        size: 2,
        total: 2,
      })
    );
  });

  it("Should return only the projects that the user can see with the correct campaigns count", async () => {
    const response = await request(app)
      .get(`/workspaces/${customer_1.id}/projects`)
      .set("authorization", "Bearer customer");
    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).toStrictEqual(
      JSON.stringify({
        items: [
          {
            id: project_1.id,
            name: project_1.display_name,
            campaigns_count: 2,
          },
          {
            id: project_3.id,
            name: project_3.display_name,
            campaigns_count: 1,
          },
        ],
        start: 0,
        limit: LIMIT_QUERY_PARAM_DEFAULT,
        size: 2,
        total: 2,
      })
    );
  });
});
