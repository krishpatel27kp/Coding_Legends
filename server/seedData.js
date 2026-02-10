const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function seed() {
    console.log('Starting seeding...')
    const email = `testuser_${Math.floor(Math.random() * 1000)}@datapulse.io`;
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });

    console.log(`User created: ${user.email}`);

    // Create 10 Projects
    for (let i = 1; i <= 10; i++) {
        const projectName = `Project Beta ${i}`;
        const apiKey = uuidv4();

        const project = await prisma.project.create({
            data: {
                name: projectName,
                apiKey,
                userId: user.id,
                formSchema: [
                    { id: '1', type: 'text', label: 'Name', required: true },
                    { id: '2', type: 'email', label: 'Email', required: true }
                ]
            }
        });

        console.log(`Created ${projectName}`);

        // Create 100 Submissions for each project
        const submissionsData = [];
        for (let j = 1; j <= 100; j++) {
            submissionsData.push({
                projectId: project.id,
                data: {
                    name: `Sample User ${j}`,
                    email: `user${j}@example.com`,
                    message: `This is submission number ${j} for ${projectName}`
                },
                metadata: {
                    ip: '127.0.0.1',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Seeder Script'
                }
            });
        }

        await prisma.submission.createMany({
            data: submissionsData
        });

        console.log(`  Added 100 submissions to ${projectName}`);
    }

    console.log('------------------');
    console.log('Seeding completed!');
    console.log(`EMAIL: ${email}`);
    console.log(`PASSWORD: ${password}`);
    console.log('------------------');

    await prisma.$disconnect();
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
