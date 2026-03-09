import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Permission } from 'src/entities/utility/permission.entity';
import {
  CreatePermissionDto,
  PermissionFilterPageableDto,
  UpdatePermissionDto,
} from 'src/dto/utility/permissions.dto';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from 'src/infrastructure/decorators/require-permission.decorator';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  async syncPermissions() {
    console.log('Starting Permission Sync...');
    const controllers = this.discoveryService.getControllers();
    const permissions = new Set<string>();

    for (const wrapper of controllers) {
      const { instance } = wrapper;
      if (!instance || !Object.getPrototypeOf(instance)) continue;

      const prototype = Object.getPrototypeOf(instance);
      const methods = this.metadataScanner.getAllMethodNames(prototype);

      for (const methodName of methods) {
        const permission = this.reflector.get<string>(
          PERMISSION_KEY,
          instance[methodName],
        );

        if (permission) {
          permissions.add(permission);
        }
      }
    }

    const permissionList = Array.from(permissions);
    console.log(`Found ${permissionList.length} unique permissions:`, permissionList);

    const savedPermissions = [];
    for (const code of permissionList) {
      // Check if exists
      let perm = await this.permissionRepository.findOne({ where: { code } });
      if (!perm) {
        perm = this.permissionRepository.create({
          code,
          description: `Auto-generated permission for ${code}`,
        });
        await this.permissionRepository.save(perm);
        savedPermissions.push(perm);
        console.log(`Created permission: ${code}`);
      }
    }

    return {
      message: 'Permission sync completed',
      totalFound: permissionList.length,
      newCreated: savedPermissions.length,
      permissions: permissionList,
    };
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll(filter: PermissionFilterPageableDto) {
    const { start, offset, keyword, orderBy, order } = filter;
    
    const query = this.permissionRepository.createQueryBuilder('permission');

    if (keyword) {
      query.where('LOWER(permission.code) LIKE :keyword OR LOWER(permission.description) LIKE :keyword', {
        keyword: `%${keyword.toLowerCase()}%`,
      });
    }

    if (orderBy) {
      query.orderBy(`permission.${orderBy}`, order || 'DESC');
    } else {
        query.orderBy('permission.id', 'ASC');
    }

    if (offset) {
      query.take(offset);
    }
    
    if (start) {
      query.skip((start - 1) * (offset || 10));
    }

    const [data, totalItems] = await query.getManyAndCount();
    const totalPages = Math.ceil(totalItems / (offset || 10));

    return {
      data,
      totalItems,
      totalPages,
      page: start || 1,
    };
  }

  async findOne(id: number): Promise<Permission> {
    return await this.permissionRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    await this.permissionRepository.update(id, updatePermissionDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.permissionRepository.delete(id);
    return result.affected > 0;
  }
}
