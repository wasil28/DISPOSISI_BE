import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { internalServerError, unauthorizedError } from '../utils/exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) return true;
    const {
      user: {
        group: {
          level: { name },
        },
      },
    } = context.getArgs()[2].session;

    const rolePermission = () => roles.some((role) => role === name);
    if (!rolePermission())
      unauthorizedError('Anda tidak memiliki akses ke Fasilitas ini.');
    return rolePermission();
  }
}
