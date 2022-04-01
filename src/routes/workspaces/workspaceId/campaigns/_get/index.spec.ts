import app from "@src/app";
import request from "supertest";
import db from "@src/features/sqlite";

jest.mock("@src/features/db");
jest.mock("@appquality/wp-auth");

const unguessDb = db("unguess");
const tryberDb = db("tryber");

const campaign_1 = {
  id: 42,
  start_date: "2017-07-20 00:00:00",
  end_date: "2017-07-20 00:00:00",
  close_date: "2017-07-20 00:00:00",
  title: "Campagnetta Provetta ",
  customer_title: "titolo",
  description: "Descrizione della campagnazione",
  status_id: 1,
  is_public: 0,
  campaign_type_id: 1,
  project_id: 1,
  customer_id: 1,
};

const campaign_2 = {
  id: 43,
  start_date: "2017-07-20 00:00:00",
  end_date: "2017-07-20 00:00:00",
  close_date: "2017-07-20 00:00:00",
  title: "Campagnetta Provetta ",
  customer_title: "titolo",
  description: "Descrizione della campagnazione",
  status_id: 1,
  is_public: 0,
  campaign_type_id: 1,
  project_id: 1,
  customer_id: 2,
};

const campaign_3 = {
  id: 44,
  start_date: "2017-07-20 00:00:00",
  end_date: "2017-07-20 00:00:00",
  close_date: "2017-07-20 00:00:00",
  title: "Campagnetta Provetta ",
  customer_title: "titolo",
  description: "Descrizione della campagnazione",
  status_id: 1,
  is_public: 0,
  campaign_type_id: 1,
  project_id: 1,
  customer_id: 2,
};

const project_1 = {
  id: 1,
  display_name: "Nome del progetto abbastanza figo",
  customer_id: 123,
  edited_by: 42,
  created_on: "2017-07-20 00:00:00",
  last_edit: "2017-07-20 00:00:00",
};

describe("GET /workspaces/{wid}/campaigns", () => {
  beforeAll(async () => {
    return new Promise(async (resolve) => {
      try {
        await tryberDb.createTable("wp_appq_evd_campaign", [
          "id int(11) PRIMARY KEY",
          "start_date datetime",
          "end_date datetime",
          "close_date datetime",
          "title varchar(256)",
          "customer_title varchar(256)",
          "description varchar(512)",
          "status_id int(1)",
          "is_public int(1)",
          "campaign_type_id int(11)",
          "project_id int(11)",
          "customer_id int(11)",
        ]);
        await tryberDb.createTable("wp_appq_project", [
          "id int(11) PRIMARY KEY",
          "display_name varchar(64)",
          "customer_id int(11)",
          "edited_by int(11)",
          "created_on timestamp",
          "last_edit timestamp",
        ]);

        await tryberDb.insert("wp_appq_evd_campaign", campaign_1);
        await tryberDb.insert("wp_appq_evd_campaign", campaign_2);
        await tryberDb.insert("wp_appq_evd_campaign", campaign_3);
        await tryberDb.insert("wp_appq_project", project_1);
      } catch (e) {
        console.log(e);
      }
      resolve(true);
    });
  });

  afterAll(async () => {
    return new Promise(async (resolve) => {
      try {
        await tryberDb.dropTable("wp_appq_evd_campaign");
        await tryberDb.dropTable("wp_appq_project");
      } catch (error) {
        console.error(error);
      }
      resolve(true);
    });
  });

  it("Should return 403 status if user is not logged in", async () => {
    const response = await request(app).get("/workspaces/1/campaigns");
    expect(response.status).toBe(403);
  });

  it("Should return 200 status if user is logged in", async () => {
    const response = await request(app)
      .get("/workspaces/1/campaigns")
      .set("authorization", "Bearer customer");
    expect(response.status).toBe(200);
  });

  it("Should return 400 if the request parameter has a bad format", async () => {
    const response = await request(app)
      .get("/workspaces/banana/campaigns")
      .set("authorization", "Bearer customer");
    expect(response.status).toBe(400);
  });

  it("Should return an array of campaigns", async () => {
    const response = await request(app)
      .get("/workspaces/1/campaigns")
      .set("authorization", "Bearer customer");
    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify([
        {
          id: campaign_1.id,
          start_date: campaign_1.start_date,
          end_date: campaign_1.end_date,
          close_date: campaign_1.close_date,
          title: campaign_1.title,
          customer_title: campaign_1.customer_title,
          description: campaign_1.description,
          status_id: campaign_1.status_id,
          is_public: campaign_1.is_public,
          campaign_type_id: campaign_1.campaign_type_id,
          project_id: campaign_1.project_id,
          customer_id: campaign_1.project_id,
          project_name: project_1.display_name,
        },
      ])
    );
  });

  it("Should return an array of campaigns with more than one element", async () => {
    const response = await request(app)
      .get("/workspaces/2/campaigns")
      .set("authorization", "Bearer customer");
    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify([
        {
          id: campaign_2.id,
          start_date: campaign_2.start_date,
          end_date: campaign_2.end_date,
          close_date: campaign_2.close_date,
          title: campaign_2.title,
          customer_title: campaign_2.customer_title,
          description: campaign_2.description,
          status_id: campaign_2.status_id,
          is_public: campaign_2.is_public,
          campaign_type_id: campaign_2.campaign_type_id,
          project_id: campaign_2.project_id,
          customer_id: campaign_2.project_id,
          project_name: project_1.display_name,
        },
        {
          id: campaign_3.id,
          start_date: campaign_3.start_date,
          end_date: campaign_3.end_date,
          close_date: campaign_3.close_date,
          title: campaign_3.title,
          customer_title: campaign_3.customer_title,
          description: campaign_3.description,
          status_id: campaign_3.status_id,
          is_public: campaign_3.is_public,
          campaign_type_id: campaign_3.campaign_type_id,
          project_id: campaign_3.project_id,
          customer_id: campaign_3.project_id,
          project_name: project_1.display_name,
        },
      ])
    );
  });

  it("Should return empty an array if no campaign are found", async () => {
    try {
      const response = await request(app)
        .get("/workspaces/98218433/campaigns")
        .set("authorization", "Bearer customer");
      expect(JSON.stringify(response.body)).toBe(JSON.stringify([]));
    } catch (e) {
      console.log(e);
    }
  });
});
