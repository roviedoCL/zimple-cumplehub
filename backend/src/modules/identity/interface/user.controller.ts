import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../application/user.service';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { User } from '../domain/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard, Roles } from './guards/roles.guard';
import { PermissionsGuard, RequirePermissions } from './guards/permissions.guard';
import { AuthenticatedUser } from '../infrastructure/strategies/jwt.strategy';

interface RequestWithUser {
  user: AuthenticatedUser;
}

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('tenant_admin', 'hr_manager')
  @RequirePermissions('user:create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    return this.userService.create(createUserDto, req.user.tenantId);
  }

  @Get()
  @Roles('tenant_admin', 'hr_manager', 'compliance_officer')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Get all users for the tenant' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  async findAll(@Request() req: RequestWithUser): Promise<User[]> {
    return this.userService.findAll(req.user.tenantId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile', type: User })
  async getProfile(@Request() req: RequestWithUser): Promise<User> {
    return this.userService.findOne(req.user.userId, req.user.tenantId);
  }

  @Get(':id')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    return this.userService.findOne(id, req.user.tenantId);
  }

  @Put(':id')
  @RequirePermissions('user:update')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto, req.user.tenantId);
  }

  @Delete(':id')
  @Roles('tenant_admin')
  @RequirePermissions('user:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    return this.userService.remove(id, req.user.tenantId, req.user.userId);
  }

  @Post(':id/activate')
  @Roles('tenant_admin', 'hr_manager')
  @RequirePermissions('user:activate')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiResponse({ status: 200, description: 'User activated successfully', type: User })
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    return this.userService.activate(id, req.user.tenantId);
  }

  @Post(':id/roles/:roleId')
  @Roles('tenant_admin')
  @RequirePermissions('user:manage_roles')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully', type: User })
  async assignRole(
    @Param('id', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    return this.userService.assignRole(userId, roleId, req.user.tenantId);
  }

  @Delete(':id/roles/:roleId')
  @Roles('tenant_admin')
  @RequirePermissions('user:manage_roles')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiResponse({ status: 204, description: 'Role removed successfully' })
  async removeRole(
    @Param('id', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    return this.userService.removeRole(userId, roleId, req.user.tenantId);
  }
}