import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RmqRecord } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { WORKFLOWS_SERVICE } from 'apps/mcrsers/src/constants';
import { Outbox } from 'apps/mcrsers/src/outbox/entities/outbox.entity';
import { OutboxService } from 'apps/mcrsers/src/outbox/outbox.service';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    private readonly outboxService: OutboxService,
    @Inject(WORKFLOWS_SERVICE)
    private readonly workflowsService: ClientProxy,
    @InjectRepository(Outbox)
    private readonly outboxRepository: Repository<Outbox>,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processOutboxMessages() {
    this.logger.debug(`Processing outbox messages`);

    const messages = await this.outboxService.getUnprocessedMessages({
      target: WORKFLOWS_SERVICE.description as string,
      take: 100,
    });

    await Promise.all(
      messages.map(async (message) => {
        await this.dispatchWorkflowEvent(message);
        await this.outboxRepository.delete(message.id);
      }),
    );
  }

  async dispatchWorkflowEvent(outbox: Outbox) {
    const rmqRecord = new RmqRecord(outbox.payload, {
      messageId: `${outbox.id}`,
    });

    await lastValueFrom(this.workflowsService.emit(outbox.type, rmqRecord));
  }
}
