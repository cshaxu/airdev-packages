/* "@airdev/next": "managed" */

/* eslint-disable airdev/no-specific-string */
import prisma from '../src/airdev/backend/lib/prisma';
import { airdevPublicConfig } from '../src/airdev/config/public';

// For instructions, see
// https://www.prisma.io/docs/guides/migrate/seed-database#how-to-seed-your-database-in-prisma
async function main() {
  const systemUser = await prisma.user.upsert({
    where: { id: 'system' },
    create: {
      id: 'system',
      name: airdevPublicConfig.app.name,
      email: airdevPublicConfig.app.email,
    },
    update: { email: airdevPublicConfig.app.email },
  });
  console.log({ systemUser });
}

main()
  .then(prisma.$disconnect)
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
