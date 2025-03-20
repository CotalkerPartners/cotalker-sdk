import { Request, Response } from "express";
import { ProjectService } from "@service/project.service";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  getAll = async (_: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.projectService.getAll();
      const status = 200;
      return res.status(status).json({
        status,
        elements: Array.isArray(result) ? result.length : undefined,
        data: result,
      });
    } catch (err) {
      const error = 'Error fetching projects from Cotalker API';
      console.error(error, err);
      return res.status(500).json({ error });
    }
  }
}