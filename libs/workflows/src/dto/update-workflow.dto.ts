import { CreateWorkflowDto } from '@app/workflows/dto/create-workflow.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWorkflowDto extends PartialType(CreateWorkflowDto) {}
