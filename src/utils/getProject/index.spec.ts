import { getProject } from "@src/utils/getProject";
import { adapter as dbAdapter } from "@src/__mocks__/database/companyAdapter";
import { ERROR_MESSAGE } from "@src/utils/consts";

jest.mock("@src/features/db");
jest.mock("@appquality/wp-auth");

const customer_1 = {
  id: 1,
  company: "Company",
  company_logo: "logo.png",
  tokens: 100,
};

const user_to_customer_1 = {
  wp_user_id: 1,
  customer_id: 1,
};

const project_1 = {
  id: 1,
  display_name: "Projettino unoh",
  customer_id: 1,
};

const project_2 = {
  id: 2,
  display_name: "Projettino dueh",
  customer_id: 1,
};

const user_to_project_1 = {
  wp_user_id: 1,
  project_id: 1,
};

const user_to_project_2 = {
  wp_user_id: 1,
  project_id: 2,
};

const campaign_1 = {
  id: 1,
  start_date: "2020-01-01",
  end_date: "2020-01-02",
  close_date: "2020-01-03",
  title: "Campagna 1",
  customer_title: "Campagna 1",
  description: "Descrizione campagna 1",
  status_id: 1,
  is_public: 1,
  campaign_type_id: 1,
  project_id: 1,
  customer_id: 1,
};

describe("getProject", () => {
  beforeAll(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await dbAdapter.create();

        await dbAdapter.add({
          companies: [customer_1],
          campaigns: [campaign_1],
          projects: [project_1, project_2],
          userToProjects: [user_to_project_1, user_to_project_2],
          userToCustomers: [user_to_customer_1],
        });
      } catch (error) {
        console.log(error);
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
        console.log(error);
        reject(error);
      }

      resolve(true);
    });
  });

  it("Should throw error 400 if the params are not valid", async () => {
    try {
      await getProject(0, 0);
    } catch (error: any) {
      expect(error.code).toBe(400);
      expect(error.message).toBe(ERROR_MESSAGE);
    }
  });

  it("Should return a project", async () => {
    let project = await getProject(project_1.id, customer_1.id);
    expect(JSON.stringify(project)).toBe(
      JSON.stringify({
        id: project_1.id,
        name: project_1.display_name,
        campaigns_count: 1,
      })
    );
  });
});
