import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  // seed user1
  await prisma.user.upsert({
    where: { email: 'user1@email.com' },
    update: {},
    create: {
      email: 'user1@email.com',
      name: 'user1',
      // pass 123456
      password: '$2b$10$66puH55yO18dYCWJc2g9ReLzF0TVaPrwQay0mmm7GPOURTLHpCXRe',
      tasks: {
        create: faker.helpers.multiple(createRandomTask, {
          count: 10,
        }),
      },
    },
  });
  // seed user2
  await prisma.user.upsert({
    where: { email: 'user2@email.com' },
    update: {},
    create: {
      email: 'user2@email.com',
      name: 'user2',
      // pass 123456
      password: '$2b$10$66puH55yO18dYCWJc2g9ReLzF0TVaPrwQay0mmm7GPOURTLHpCXRe',
      tasks: {
        create: faker.helpers.multiple(createRandomTask, {
          count: 10,
        }),
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export function createRandomTask() {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['open', 'inProgress', 'closed']),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
    dueDate: faker.date.future(),
  };
}
