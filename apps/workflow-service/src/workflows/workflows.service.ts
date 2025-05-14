import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from 'apps/workflow-service/src/workflows/entities/workflow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  constructor(
    @InjectRepository(Workflow)
    private readonly workflowsRepository: Repository<Workflow>,
  ) {}

  async findAll(): Promise<Workflow[]> {
    return this.workflowsRepository.find();
  }

  async findOne(id: number): Promise<Workflow> {
    const workflow = await this.workflowsRepository.findOne({ where: { id } });
    if (!workflow) {
      throw new NotFoundException(`Workflow #${id} does not exist`);
    }
    return workflow;
  }

  async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const workflow = this.workflowsRepository.create({
      ...createWorkflowDto,
    });
    const newWorkflowEntity = await this.workflowsRepository.save(workflow);
    console.log(
      `Create workflow with id ${newWorkflowEntity.id} for building ${newWorkflowEntity.buildingId}`,
    );
    return newWorkflowEntity;
  }

  async update(
    id: number,
    updateWorkflowDto: UpdateWorkflowDto,
  ): Promise<Workflow> {
    const workflow = await this.workflowsRepository.preload({
      id: +id,
      ...updateWorkflowDto,
    });
    if (!workflow) {
      throw new NotFoundException(`Workflow #${id} does not exist`);
    }
    return this.workflowsRepository.save(workflow);
  }

  async remove(id: number): Promise<Workflow> {
    const workflow = await this.findOne(id);
    return this.workflowsRepository.remove(workflow);
  }
}
