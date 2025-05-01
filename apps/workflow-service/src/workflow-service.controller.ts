import { Controller, Get } from '@nestjs/common';
import { WorkflowServiceService } from './workflow-service.service';

@Controller()
export class WorkflowServiceController {
  constructor(private readonly workflowServiceService: WorkflowServiceService) {}

  @Get()
  getHello(): string {
    return this.workflowServiceService.getHello();
  }
}
