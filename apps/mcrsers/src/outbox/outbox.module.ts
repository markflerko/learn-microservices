import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WORKFLOWS_SERVICE } from 'apps/mcrsers/src/constants';
import { Outbox } from 'apps/mcrsers/src/outbox/entities/outbox.entity';
import { OutboxProcessor } from 'apps/mcrsers/src/outbox/outbox.processor';
import { OutboxService } from './outbox.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outbox]),
    ClientsModule.register([
      {
        name: WORKFLOWS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL as string],
          queue: 'workflows-service',
        },
      },
    ]),
  ],
  providers: [OutboxService, OutboxProcessor],
})
export class OutboxModule {}
