import { Outbox } from 'apps/mcrsers/src/outbox/entities/outbox.entity';
import { OutboxProcessor } from 'apps/mcrsers/src/outbox/outbox.processor';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class OutboxEntitySubscriber
  implements EntitySubscriberInterface<Outbox>
{
  constructor(
    dataSource: DataSource,
    private readonly outboxProcessor: OutboxProcessor,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Outbox;
  }

  async afterInsert(event: InsertEvent<Outbox>) {
    await this.outboxProcessor.dispatchWorkflowEvent(event.entity);
    console.log('its done by triggers kitty');
    await event.manager.delete(Outbox, event.entity.id);
  }
}
