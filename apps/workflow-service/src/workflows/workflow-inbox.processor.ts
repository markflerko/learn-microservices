import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inbox } from 'apps/workflow-service/src/inbox/entities/inbox.entity';
import { InboxService } from 'apps/workflow-service/src/inbox/inbox.service';
import { Workflow } from 'apps/workflow-service/src/workflows/entities/workflow.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class WorkflowsInboxProcessor {
  private readonly logger = new Logger(WorkflowsInboxProcessor.name);

  constructor(private readonly inboxService: InboxService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processInboxMessages() {
    this.logger.debug(`Processing inbox messages`);

    await this.inboxService.processInboxMessages(
      async (messages, manager) => {
        return Promise.all(
          messages.map((message) => {
            if (message.pattern === 'workflows.create') {
              return this.createWorkflow(message, manager);
            }
          }),
        );
      },
      {
        take: 100,
      },
    );
  }

  async createWorkflow(message: Inbox, manager: EntityManager) {
    const workflowsRepository = manager.getRepository(Workflow);

    const workflow = workflowsRepository.create({
      ...message.payload,
    });
    const newWorkflowEntity = await workflowsRepository.save(workflow);
    this.logger.debug(
      `Created workflow with id ${newWorkflowEntity.id} for building ${newWorkflowEntity.buildingId}`,
    );

    await manager.update(Inbox, message.id, {
      status: 'processed',
    });
  }
}
