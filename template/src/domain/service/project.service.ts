import { cotalkerAPI } from "../../core/libs/CotalkerAPI";
import { Project } from "@schema/project.schema";

export class ProjectService {
  
  async getAll(): Promise<Project[]> {
    try {
      const result = await cotalkerAPI.getAllFromPropertyType('tbl_glencore_project') as Project[];
      return result;
    } catch (error) {
      return error;
    }
  }
}
