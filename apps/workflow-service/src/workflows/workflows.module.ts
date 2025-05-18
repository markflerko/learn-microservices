import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxModule } from 'apps/workflow-service/src/inbox/inbox.module';
import { Workflow } from 'apps/workflow-service/src/workflows/entities/workflow.entity';
import { WorkflowsInboxProcessor } from 'apps/workflow-service/src/workflows/workflow-inbox.processor';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow]), InboxModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowsInboxProcessor],
})
export class WorkflowsModule {}
