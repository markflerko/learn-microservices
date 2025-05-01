import { NestFactory } from '@nestjs/core';
import { WorkflowServiceModule } from './workflow-service.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WorkflowServiceModule);
  const PORT = process.env.PORT ?? 3001;
  await app.listen(PORT, () => {
    Logger.log(PORT);
  });
}
bootstrap();
