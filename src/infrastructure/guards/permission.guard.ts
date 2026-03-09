import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../../entities/utility/role-permission.entity';
import { Permission } from '../../entities/utility/permission.entity';
import { UserRole } from '../../entities/utility/user-role.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(RolePermission)
    private rolePermissionRepo: Repository<RolePermission>,
     @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRoleRepo: Repository<UserRole>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // console.log(`API indentifikasi : `, context.switchToHttp().getRequest().url);

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
       throw new ForbiddenException('User not authenticated');
    }
    
    // Check if Permission exists
    const permissionDef = await this.permissionRepo.findOne({ where: { code: requiredPermission } });
    if (!permissionDef) {
        // console.log(`API ERROR Permission '${requiredPermission}' is required but not defined in database : `, context.switchToHttp().getRequest().url);
        console.warn(`Permission '${requiredPermission}' is required but not defined in database.`);
        
        throw new ForbiddenException({
          message: 'Konfigurasi Izin Hilang',
          permission: requiredPermission,
          detail: `Permission '${requiredPermission}' belum terdaftar di database. Hubungi Developer.`
        });
    }

    // Get Role IDs
    let roleIds: number[] = [];

    if (user.userRoles && user.userRoles.length > 0) {
        roleIds = user.userRoles.map((ur: any) => ur.idRole || ur.role?.id);
    } else {
        // Fallback: Fetch roles
        const userRoles = await this.userRoleRepo.find({ where: { idUserGeneral: user.id } });
        roleIds = userRoles.map(ur => ur.idRole);
    }

    if (roleIds.length === 0) {
        // console.log(`API ERROR User has no roles assigned : `, context.switchToHttp().getRequest().url);
        throw new ForbiddenException('User has no roles assigned');
    }
    
    // Check if any role has the permission
    const count = await this.rolePermissionRepo
      .createQueryBuilder('rp')
      .where('rp.permissionId = :permId', { permId: permissionDef.id })
      .andWhere('rp.roleId IN (:...roleIds)', { roleIds })
      .getCount();
    
      // console.log(`API DARI : `, context.switchToHttp().getRequest().url);
    console.log(`[PermissionGuard] Checking permission: ${requiredPermission} (ID: ${permissionDef.id})`);
    console.log(`[PermissionGuard] User Role IDs: ${JSON.stringify(roleIds)}`);
    console.log(`[PermissionGuard] Found Match Count: ${count}`);

    if (count > 0) return true;

    throw new ForbiddenException({
      message: 'Akses Ditolak',
      permission: requiredPermission,
      detail: `Anda tidak memiliki izin: ${requiredPermission}`
    });
  }
}
