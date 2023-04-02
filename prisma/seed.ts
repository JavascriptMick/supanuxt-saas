import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const freeTrial = await prisma.plan.upsert({
    where: { name: 'Free Trial' },
    update: {},
    create: {
      name: 'Free Trial',
      features: ['ADD_NOTES', 'EDIT_NOTES', 'VIEW_NOTES'],
      max_notes: 10,
      max_members: 1,
    },
  });
  const individualPlan = await prisma.plan.upsert({
    where: { name: 'Individual Plan' },
    update: {},
    create: {
      name: 'Individual Plan',
      features: ['ADD_NOTES', 'EDIT_NOTES', 'VIEW_NOTES', 'SPECIAL_FEATURE'],
      max_notes: 100,
      max_members: 1,
      stripe_product_id: 'prod_NQR7vwUulvIeqW'
    },
  });
  const teamPlan = await prisma.plan.upsert({
    where: { name: 'Team Plan' },
    update: {},
    create: {
      name: 'Team Plan',
      features: ['ADD_NOTES', 'EDIT_NOTES', 'VIEW_NOTES', 'SPECIAL_FEATURE', 'SPECIAL_TEAM_FEATURE'],
      max_notes: 200,
      max_members: 10,
      stripe_product_id: 'prod_NQR8IkkdhqBwu2'
    },
  });

  console.log({ freeTrial, individualPlan, teamPlan })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })