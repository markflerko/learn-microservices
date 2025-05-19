/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NATS_BROKER } from '@app/tracing/nats-client/constants';
import { NatsClientProxy } from '@app/tracing/nats-client/nats.client.proxy';
import { TracingLogger } from '@app/tracing/tracing.logger';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from 'apps/alarms-service/src/constants';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AlarmsServiceController {
  // private readonly logger = new Logger(AlarmsServiceController.name);

  constructor(
    @Inject(NATS_BROKER)
    private readonly natsMessageBroker: NatsClientProxy,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
    private readonly logger: TracingLogger,
  ) {}

  @EventPattern('alarm.created')
  async create(
    @Payload() data: { name: string; buildingId: number },
    @Ctx() ctx: NatsContext,
  ) {
    const traceId = ctx.getHeaders().get('traceId');
    this.logger.debug(
      `Received new "alarm.created" event: ${JSON.stringify(data)}`,
      traceId ? `[traceId: ${JSON.stringify(traceId)}]` : undefined,
    );
    const alarmClassification = await lastValueFrom(
      this.natsMessageBroker.send('alarm.classify', data),
    );

    this.logger.debug(
      `Alarm "${data.name}" classified as ${alarmClassification.category}`,
    );

    const notify$ = this.notificationsService.emit('notification.send', {
      alarm: data,
      category: alarmClassification.category,
    });

    await lastValueFrom(notify$);
    this.logger.debug(`1 Dispatched "notification.send" event`);
  }
}
