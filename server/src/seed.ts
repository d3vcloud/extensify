import { USER_DATA } from './data/users'
import { prisma } from './lib/prisma'

// Documentation: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries
async function main() {
  console.log(`Start seeding ...`)
  USER_DATA.forEach(async (user) => {
    console.log(`✅ Adding ${user.name} to DB...`)
    await prisma.user.create({
      data: {
        ...user
      }
    })
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
