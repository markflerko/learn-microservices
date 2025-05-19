import { TracingLogger } from '@app/tracing/tracing.logger';
import { Module } from '@nestjs/common';
import { TracingService } from './tracing.service';
import { NatsClientModule } from './nats-client/nats-client.module';

@Module({
  providers: [TracingService, TracingLogger],
  exports: [TracingService, TracingLogger],
  imports: [NatsClientModule],
})
export class TracingModule {}
