import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@crm.dev" },
    update: {},
    create: {
      name: "Alex Admin",
      email: "admin@crm.dev",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const rep = await prisma.user.upsert({
    where: { email: "rep@crm.dev" },
    update: {},
    create: {
      name: "Riley Rep",
      email: "rep@crm.dev",
      password: passwordHash,
      role: "REP",
    },
  });

  const acme = await prisma.account.create({
    data: {
      name: "Acme Corporation",
      website: "https://acme.example.com",
      industry: "Manufacturing",
      phone: "555-0100",
      billingAddress: "1 Acme Way, Springfield",
      description: "Global manufacturer of everything anvil-related.",
      ownerId: admin.id,
    },
  });

  const globex = await prisma.account.create({
    data: {
      name: "Globex Inc",
      website: "https://globex.example.com",
      industry: "Technology",
      phone: "555-0200",
      billingAddress: "42 Globex Plaza, Metropolis",
      description: "Innovative technology solutions provider.",
      ownerId: rep.id,
    },
  });

  const wayne = await prisma.contact.create({
    data: {
      firstName: "Bruce",
      lastName: "Wayne",
      email: "bruce@acme.example.com",
      phone: "555-0101",
      title: "CEO",
      accountId: acme.id,
      ownerId: admin.id,
    },
  });

  const kent = await prisma.contact.create({
    data: {
      firstName: "Clark",
      lastName: "Kent",
      email: "clark@globex.example.com",
      phone: "555-0201",
      title: "VP Engineering",
      accountId: globex.id,
      ownerId: rep.id,
    },
  });

  await prisma.opportunity.create({
    data: {
      name: "Acme - Enterprise License",
      amount: 85000,
      stage: "PROPOSAL",
      probability: 60,
      closeDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      description: "Annual enterprise licensing deal.",
      accountId: acme.id,
      contactId: wayne.id,
      ownerId: admin.id,
    },
  });

  await prisma.opportunity.create({
    data: {
      name: "Globex - Platform Rollout",
      amount: 42000,
      stage: "NEGOTIATION",
      probability: 75,
      closeDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      description: "Company-wide platform rollout.",
      accountId: globex.id,
      contactId: kent.id,
      ownerId: rep.id,
    },
  });

  await prisma.opportunity.create({
    data: {
      name: "Acme - Support Renewal",
      amount: 15000,
      stage: "CLOSED_WON",
      probability: 100,
      closeDate: new Date(),
      description: "Annual support contract renewal.",
      accountId: acme.id,
      contactId: wayne.id,
      ownerId: admin.id,
    },
  });

  await prisma.lead.createMany({
    data: [
      {
        firstName: "Diana",
        lastName: "Prince",
        company: "Themyscira Exports",
        email: "diana@themyscira.example.com",
        status: "NEW",
        source: "WEB",
        ownerId: rep.id,
      },
      {
        firstName: "Barry",
        lastName: "Allen",
        company: "Central City Labs",
        email: "barry@ccl.example.com",
        status: "QUALIFIED",
        source: "REFERRAL",
        ownerId: admin.id,
      },
      {
        firstName: "Hal",
        lastName: "Jordan",
        company: "Ferris Aircraft",
        email: "hal@ferris.example.com",
        status: "CONTACTED",
        source: "EVENT",
        ownerId: rep.id,
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Follow up on Acme proposal",
        status: "OPEN",
        priority: "HIGH",
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        assigneeId: admin.id,
        accountId: acme.id,
      },
      {
        title: "Send Globex rollout timeline",
        status: "IN_PROGRESS",
        priority: "NORMAL",
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        assigneeId: rep.id,
        accountId: globex.id,
      },
    ],
  });

  console.log("Seed complete:", { admin: admin.email, rep: rep.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
