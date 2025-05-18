import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inbox } from 'apps/workflow-service/src/inbox/entities/inbox.entity';
import { InboxService } from './inbox.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inbox])],
  providers: [InboxService],
  exports: [TypeOrmModule, InboxService],
})
export class InboxModule {}
