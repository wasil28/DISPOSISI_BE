import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../../../entities/utility/permission.entity';
import { Role } from '../../../../entities/utility/role.entity';
import { RolePermission } from '../../../../entities/utility/role-permission.entity';

@Injectable()
export class PermissionSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedPermissions();
  }

  private async seedPermissions() {
    const permissions = [
      { code: 'user.view', description: 'Melihat data user' },
      { code: 'user.create', description: 'Membuat user baru' },
      { code: 'user.update', description: 'Mengubah data user' },
      { code: 'user.delete', description: 'Menghapus data user' },
      // Add more as needed
    ];

    for (const p of permissions) {
      const exists = await this.permissionRepo.findOne({ where: { code: p.code } });
      if (!exists) {
        const newPerm = this.permissionRepo.create(p);
        await this.permissionRepo.save(newPerm);
        console.log(`Permission seeded: ${p.code}`);
      }
    }

    // Assign all to Super Admin (assuming ID 1 or code RL001)
    const superAdmin = await this.roleRepo.findOne({ where: { name: 'Super Admin' } }); 
    if (superAdmin) {
       const allPerms = await this.permissionRepo.find();
       for (const perm of allPerms) {
          const relationExists = await this.rolePermissionRepo.findOne({
             where: { roleId: superAdmin.id, permissionId: perm.id }
          });
          if (!relationExists) {
             await this.rolePermissionRepo.save(this.rolePermissionRepo.create({
                roleId: superAdmin.id,
                permissionId: perm.id
             }));
             console.log(`Assigned ${perm.code} to Super Admin`);
          }
       }
    }
  }
}
