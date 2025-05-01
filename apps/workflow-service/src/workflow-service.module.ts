import { Module } from '@nestjs/common';
import { WorkflowServiceController } from './workflow-service.controller';
import { WorkflowServiceService } from './workflow-service.service';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [WorkflowsModule],
  controllers: [WorkflowServiceController],
  providers: [WorkflowServiceService],
})
export class WorkflowServiceModule {}
