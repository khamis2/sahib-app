import { Controller, Post, Get, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Priority } from '../entities/ServiceRequest.entity';

@Controller('requests')
export class RequestsController {
    constructor(private requestsService: RequestsService) { }

    @Post()
    async create(@Body() body: { userId: string; price: number; priority: Priority; location: any }) {
        return this.requestsService.createRequest(body.userId, body.price, body.priority, body.location);
    }

    @Get()
    async findAll() {
        return this.requestsService.getAllRequests();
    }

    @Get('available')
    async findAvailable() {
        return this.requestsService.getAvailableRequests();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.requestsService.getRequestById(id);
    }

    @Patch(':id/accept')
    async accept(@Param('id') id: string, @Body() body: { providerId: string }) {
        return this.requestsService.acceptRequest(id, body.providerId);
    }

    @Patch(':id/complete')
    async complete(@Param('id') id: string) {
        return this.requestsService.completeRequest(id);
    }

    @Post(':id/cancel')
    async cancel(@Param('id') id: string) {
        return this.requestsService.cancelRequest(id);
    }

    @Post(':id/rate')
    async rate(@Param('id') id: string, @Body() body: { rating: number; review?: string }) {
        return this.requestsService.rateRequest(id, body.rating, body.review);
    }
}
