import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WorkflowServiceModule } from './workflow-service.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkflowServiceModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL as string],
        queue: 'workflow-service',
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();

  const PORT = process.env.PORT ?? 3001;
  await app.listen(PORT, () => {
    Logger.log(PORT);
  });
}
void bootstrap();
