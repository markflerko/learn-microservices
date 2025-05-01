import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
