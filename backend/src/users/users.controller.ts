import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            return { error: 'User not found' };
        }
        return user;
    }

    @Post('fund')
    async fundWallet(@Body() body: { userId: string; amount: number }) {
        const user = await this.usersService.findOne(body.userId);
        if (!user) {
            return { error: 'User not found' };
        }

        // Add the amount to user's balance
        user.balance = Number(user.balance) + Number(body.amount);
        const updatedUser = await this.usersService.save(user);

        return {
            success: true,
            balance: updatedUser.balance,
            message: `₦${body.amount.toLocaleString()} added to wallet`
        };
    }

    @Get(':id/transactions')
    async getTransactions(@Param('id') id: string) {
        return this.usersService.getTransactions(id);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() body: { fullName?: string; email?: string }) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            return { error: 'User not found' };
        }

        if (body.fullName) user.fullName = body.fullName;
        if (body.email) user.email = body.email;

        const updatedUser = await this.usersService.save(user);
        return updatedUser;
    }
}
