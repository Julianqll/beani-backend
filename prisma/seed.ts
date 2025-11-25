import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.device.upsert({
    where: { id: 'device-demo-soya' },
    update: {},
    create: {
      id: 'device-demo-soya',
      name: 'Campo Soja Demo',
      apiKey: process.env.API_KEY_ESP8266 ?? null,
    },
  });

  console.info('Seed completed: device-demo-soya');
}

main()
  .catch((err) => {
    console.error('Seed error', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

