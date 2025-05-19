import { NATS_BROKER } from '@app/tracing/nats-client/constants';
import { NatsClientProxy } from '@app/tracing/nats-client/nats.client.proxy';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_BROKER,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
          queue: 'alarms-service',
        },
      },
    ]),
  ],
  providers: [NatsClientProxy],
  exports: [NatsClientProxy],
})
export class NatsClientModule {}
