import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser } from '../../infrastructure/strategies/jwt.strategy';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: string[]) => {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(PERMISSIONS_KEY, permissions, descriptor.value);
    } else {
      Reflect.defineMetadata(PERMISSIONS_KEY, permissions, target);
    }
    return descriptor || target;
  };
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    const { user } = request;

    if (!user || !user.permissions) {
      throw new ForbiddenException('Access denied. Insufficient permissions.');
    }

    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}