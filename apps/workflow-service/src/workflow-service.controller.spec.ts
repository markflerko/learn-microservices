import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowServiceController } from './workflow-service.controller';
import { WorkflowServiceService } from './workflow-service.service';

describe('WorkflowServiceController', () => {
  let workflowServiceController: WorkflowServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowServiceController],
      providers: [WorkflowServiceService],
    }).compile();

    workflowServiceController = app.get<WorkflowServiceController>(WorkflowServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workflowServiceController.getHello()).toBe('Hello World!');
    });
  });
});
