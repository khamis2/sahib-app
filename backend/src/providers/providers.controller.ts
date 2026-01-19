import { Controller, Post, Get, Body, Param, Patch, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { VerificationStatus } from '../entities/ServiceProvider.entity';

@Controller('providers')
export class ProvidersController {
    constructor(private providersService: ProvidersService) { }

    @Post('apply')
    async apply(@Body() body: { userId: string; category: string }) {
        return this.providersService.create(body.userId, body.category);
    }

    @Patch(':id/verify')
    async verify(
        @Param('id') id: string,
        @Body() body: { status: VerificationStatus; ninBvnHash?: string },
    ) {
        return this.providersService.verifyProvider(id, body.status, body.ninBvnHash);
    }

    @Get('active')
    async getActive() {
        return this.providersService.findAllActive();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.providersService.findOne(id);
    }
}
