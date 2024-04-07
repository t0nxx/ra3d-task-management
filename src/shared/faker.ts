import { faker } from '@faker-js/faker';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

export function createRandomTasks(): CreateTaskDto {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['open', 'inProgress', 'closed']),
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
    dueDate: faker.date.future(),
  };
}
