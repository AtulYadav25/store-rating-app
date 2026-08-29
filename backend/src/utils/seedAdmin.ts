import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { ROLES } from '../constants/ROLES.js';

export const seedAdmin = async (): Promise<void> => {
    try {
        const adminEmail = 'vasudev@gmail.com';

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            return;
        }

        const hashedPassword = await bcrypt.hash('Vasudev@123', 10);

        const newUser = await prisma.user.create({
            data: {
                name: 'Vasudev',
                email: adminEmail,
                password: hashedPassword,
                address: 'Vaikunth'
            }
        });

        await prisma.user.update({
            where: { id: newUser.id },
            data: {
                role: ROLES.ADMIN
            }
        });

        console.log('Admin user seeded successfully with role ADMIN.');
    } catch (error) {
        console.error('Failed to seed admin user:', error);
    }
};
