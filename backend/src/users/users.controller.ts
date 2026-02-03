import { Controller, Get, Post, Patch, Param, Body, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';
import { existsSync, mkdirSync } from 'fs';

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

    @Post(':id/avatar')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {
                const uploadPath = './uploads/avatars';
                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req: any, file: any, cb: any) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                cb(null, `${req.params.id}-${uniqueSuffix}${ext}`);
            }
        })
    }))
    async uploadAvatar(@Param('id') id: string, @UploadedFile() file: any) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            return { error: 'User not found' };
        }

        // Generate full URL for the avatar
        // Since we are running locally, we construct the URL based on the server host
        // In production, this might be a CDN URL
        const avatarUrl = `${process.env.APP_URL || 'http://localhost:3005'}/users/avatars/${file.filename}`;

        user.avatarUrl = avatarUrl;
        return this.usersService.save(user);
    }

    @Get('avatars/:filename')
    getAvatar(@Param('filename') filename: string, @Res() res: Response) {
        return res.sendFile(join(process.cwd(), 'uploads/avatars', filename));
    }
}
