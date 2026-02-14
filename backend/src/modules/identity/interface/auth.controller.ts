import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, AuthResponse } from '../application/auth.service';
import { UserService } from '../application/user.service';
import { LoginDto } from '../application/dto/login.dto';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedUser } from '../infrastructure/strategies/jwt.strategy';

interface RequestWithUser {
  user: AuthenticatedUser;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user (public)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    // Crear usuario con tenant por defecto para pruebas
    const tenantId = '00000000-0000-0000-0000-000000000001';
    const user = await this.userService.create(createUserDto, tenantId);
    
    // Hacer login automático después del registro
    const loginDto: LoginDto = {
      email: createUserDto.email,
      password: createUserDto.password,
      tenantId,
    };
    
    return this.authService.login(loginDto, ipAddress);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account not active or locked' })
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    return this.authService.login(loginDto, ipAddress);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 204, description: 'Logout successful' })
  async logout(@Request() req: RequestWithUser) {
    await this.authService.logout(req.user.userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user info' })
  @ApiResponse({ status: 200, description: 'Current user info' })
  getMe(@Request() req: RequestWithUser) {
    return {
      userId: req.user.userId,
      email: req.user.email,
      tenantId: req.user.tenantId,
      roles: req.user.roles,
      permissions: req.user.permissions,
    };
  }
}