/** OPENAPI-ROUTE: get-workspace-projects */
import { Context } from "openapi-backend";
import * as db from "../../../../../features/db";
import getWorkspace from "../../getWorkspace/";

export default async (
  c: Context,
  req: OpenapiRequest,
  res: OpenapiResponse
) => {
  let user = req.user;

  res.status_code = 200;

  // Get wid path parameter
  let workspaceId;
  if (typeof c.request.params.wid == "string") {
    workspaceId = parseInt(
      c.request.params.wid
    ) as StoplightOperations["get-workspace-projects"]["parameters"]["path"]["wid"];
  }

  // Check if workspaceId is valid
  if (
    typeof workspaceId == "undefined" ||
    workspaceId == null ||
    workspaceId < 0
  ) {
    res.status_code = 400;
    return "Workspace id is not valid";
  }

  // Get workspace
  let workspace;
  try {
    workspace = await getWorkspace(workspaceId);
  } catch (error) {
    if ((error as OpenapiError).message == "No workspace found") {
      res.status_code = 404;
      return (error as OpenapiError).message;
    } else {
      res.status_code = 500;
      throw error;
    }
  }

  // Get workspace projects
  let projects: any;
  try {
    const projectSql =
      "SELECT id, display_name FROM wp_appq_project WHERE customer_id = ? ORDER BY id";
    projects = await db.query(db.format(projectSql, [workspaceId]));
  } catch (error) {
    res.status_code = 500;
    throw error;
  }

  let returnProjects: Array<StoplightComponents["schemas"]["Project"]> = [];
  if (projects) {
    for (const project of projects) {
      // Get campaigns count
      let campaigns;
      try {
        const campaignSql =
          "SELECT COUNT(*) AS count FROM wp_appq_evd_campaign WHERE project_id = ?";
        campaigns = await db.query(db.format(campaignSql, [project.id]));
      } catch (error) {
        res.status_code = 500;
        throw error;
      }

      let item: StoplightComponents["schemas"]["Project"] = {
        id: project.id,
        name: project.display_name,
        campaigns_count: campaigns[0].count,
      };

      returnProjects.push(item);
    }
  }

  return returnProjects;
};
