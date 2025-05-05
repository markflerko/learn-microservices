/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateWorkflowDto } from '@app/workflows';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'apps/mcrsers/src/buildings/entities/building.entity';
import { Repository } from 'typeorm';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private buildingsRepository: Repository<Building>,
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
    console.log(
      JSON.stringify({ name: 'My Workflow', buildingId } as CreateWorkflowDto),
    );

    const response = await fetch('http://workflow-service:3001/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'My Workflow', buildingId }),
    });

    const newWorkflow = await response.json();
    console.log({ newWorkflow });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return newWorkflow;
  }
}
