import { USER_DATA } from './data/users'
import { prisma } from './lib/prisma'

async function main() {
  console.log(`Start seeding ...`)
  await prisma.user.createMany({
    data: USER_DATA
  })
  console.log(`Seeding finished.`)
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
