import { Injectable } from '@nestjs/common';
import { Inbox } from 'apps/workflow-service/src/inbox/entities/inbox.entity';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class InboxService {
  constructor(private readonly dataSource: DataSource) {}

  async processInboxMessages(
    process: (messages: Inbox[], manager: EntityManager) => Promise<unknown>,
    options: { take: number },
  ) {
    return this.dataSource.transaction(async (manager) => {
      const inboxRepository = manager.getRepository(Inbox);
      const messages = await inboxRepository.find({
        where: {
          status: 'pending',
        },
        order: {
          createdAt: 'ASC',
        },
        take: options.take,
        lock: {
          mode: 'pessimistic_write',
          onLocked: 'nowait',
        },
      });
      await process(messages, manager);
    });
  }
}
