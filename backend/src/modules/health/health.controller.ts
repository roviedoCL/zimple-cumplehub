import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({ path: 'api/health', version: VERSION_NEUTRAL })
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Zimple CumpleHub API',
    };
  }
}
