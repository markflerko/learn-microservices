/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateWorkflowDto } from '@app/workflows';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'apps/mcrsers/src/buildings/entities/building.entity';
import { WORKFLOWS_SERVICE } from 'apps/mcrsers/src/constants';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private buildingsRepository: Repository<Building>,
    @Inject(WORKFLOWS_SERVICE)
    private readonly workflowsService: ClientProxy,
  ) {}

  findAll(): Promise<Building[]> {
    return this.buildingsRepository.find();
  }

  findOne(id: number): Promise<Building | null> {
    return this.buildingsRepository.findOneBy({ id });
  }

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const building = this.buildingsRepository.create({
      ...createBuildingDto,
    });

    const newBuildingEntity = await this.buildingsRepository.save(building);

    // Create a workflow for the new building
    await this.createWorkflow(newBuildingEntity.id);

    return newBuildingEntity;
  }

  async update(
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    const building = await this.buildingsRepository.preload({
      id: +id,
      ...updateBuildingDto,
    });

    if (!building) {
      throw new NotFoundException(`Building #${id} does not exist`);
    }

    return this.buildingsRepository.save(building);
  }

  async remove(id: number): Promise<Building> {
    const building = await this.findOne(id);
    if (building) {
      return this.buildingsRepository.remove(building);
    }
    throw new NotFoundException(`Building #${id} does not exist`);
  }

  async createWorkflow(buildingId: number) {
    const newWorkflow = await lastValueFrom(
      this.workflowsService.send('workflows.create', {
        name: 'My Workflow',
        buildingId,
      } as CreateWorkflowDto),
    );
    console.log({ newWorkflow });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return newWorkflow;
  }
}
