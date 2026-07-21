import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    private generateToken;
}
