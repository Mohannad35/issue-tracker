import { faker } from '@faker-js/faker';
import { createIssueSchema } from './validationSchemas';

const status = ['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'];
const priority = ['LOW', 'MEDIUM', 'HIGH'];

const generateIssue = () => {
  return {
    title: faker.lorem.words(5),
    description: faker.lorem.paragraph(),
    status: status[faker.number.int({ min: 0, max: status.length - 1 })],
    priority: priority[faker.number.int({ min: 0, max: priority.length - 1 })],
  };
};

export async function seedIssues(url: string, noOfIssues: number = 10): Promise<void> {
  const res = await fetch(url, { method: 'DELETE' });
  console.log(await res.json());

  // Generate 10 issues
  const issues = Array.from({ length: noOfIssues }, generateIssue);

  // Validate each issue with the schema
  for (const issue of issues) {
    const result = createIssueSchema.safeParse(issue);
    if (!result.success) {
      console.error('Invalid issue data:', result.error);
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    if (!res.ok) {
      console.error('Failed to seed issue:', issue, res.statusText);
    }
    console.log('Seeded issue:', issue);
  }
}
