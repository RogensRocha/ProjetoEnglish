import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.contentItemTag.deleteMany();
  await prisma.habitLog.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany({ where: { email: "demo@learnit.app" } });

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12);
  const user = await prisma.user.create({
    data: {
      email: "demo@learnit.app",
      name: "Demo User",
      password: hashedPassword,
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: { userId: user.id, name: "Grammar", color: "#6366f1" },
    }),
    prisma.tag.create({
      data: { userId: user.id, name: "Listening", color: "#8b5cf6" },
    }),
    prisma.tag.create({
      data: { userId: user.id, name: "Vocabulary", color: "#06b6d4" },
    }),
    prisma.tag.create({
      data: { userId: user.id, name: "Speaking", color: "#10b981" },
    }),
    prisma.tag.create({
      data: { userId: user.id, name: "Reading", color: "#f59e0b" },
    }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // Create content items
  const items = await Promise.all([
    prisma.contentItem.create({
      data: {
        userId: user.id,
        url: "https://www.youtube.com/watch?v=VlE7NZBkNUU",
        title: "How to Improve Your English Listening Skills",
        type: "video",
        thumbnailUrl: "https://i.ytimg.com/vi/VlE7NZBkNUU/maxresdefault.jpg",
        notes: "Excellent tips on shadowing technique. Watch at 0.75x speed first.",
        status: "done",
        level: "B1",
        tags: {
          create: [
            { tag: { connect: { id: tags[1].id } } },
            { tag: { connect: { id: tags[2].id } } },
          ],
        },
      },
    }),
    prisma.contentItem.create({
      data: {
        userId: user.id,
        url: "https://www.bbc.com/learning-english",
        title: "BBC Learning English — Daily Grammar Lessons",
        type: "site",
        thumbnailUrl: "https://www.bbc.co.uk/staticarchive/a3a95f2a94d4d06c8cff1fa2a98cba1b34ee3a10.png",
        notes: "Do one lesson every morning. Currently on Unit 4 - Conditionals.",
        status: "in_progress",
        level: "B2",
        tags: {
          create: [
            { tag: { connect: { id: tags[0].id } } },
            { tag: { connect: { id: tags[4].id } } },
          ],
        },
      },
    }),
    prisma.contentItem.create({
      data: {
        userId: user.id,
        url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
        title: "The Power of Vulnerability — Brené Brown TED Talk",
        type: "video",
        thumbnailUrl: "https://pi.tedcdn.com/r/talkstar-photos.s3.amazonaws.com/uploads/72bda89f-9bbf-4685-910a-2f151c4f3a8a/BreneBrown_2010X-embed.jpg",
        notes: "Great natural American English. Use subtitles first, then without.",
        status: "todo",
        level: "C1",
        tags: {
          create: [
            { tag: { connect: { id: tags[1].id } } },
            { tag: { connect: { id: tags[3].id } } },
          ],
        },
      },
    }),
    prisma.contentItem.create({
      data: {
        userId: user.id,
        url: "https://www.economist.com/technology-quarterly",
        title: "The Economist — Technology Quarterly",
        type: "article",
        thumbnailUrl: "https://www.economist.com/img/b/1280/720/90/sites/default/files/images/2024/03/10/20240309_TQD000.jpg",
        notes: "Advanced vocabulary. Keep a word list while reading.",
        status: "todo",
        level: "C2",
        tags: {
          create: [
            { tag: { connect: { id: tags[2].id } } },
            { tag: { connect: { id: tags[4].id } } },
          ],
        },
      },
    }),
    prisma.contentItem.create({
      data: {
        userId: user.id,
        url: "https://www.englishclub.com/grammar/verbs-modal.php",
        title: "Modal Verbs — EnglishClub Complete Guide",
        type: "article",
        thumbnailUrl: null,
        notes: "Great reference for can, could, would, should, may, might, must.",
        status: "done",
        level: "A2",
        tags: {
          create: [
            { tag: { connect: { id: tags[0].id } } },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${items.length} content items`);

  // Create habit logs for the last 20 days (with some gaps)
  const studiedDays = [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14, 15, 17, 18, 19, 20];
  
  for (const daysAgo of studiedDays) {
    const date = subDays(new Date(), daysAgo);
    date.setHours(0, 0, 0, 0);
    await prisma.habitLog.create({
      data: {
        userId: user.id,
        date: date,
        completed: true,
      },
    });
  }

  console.log(`✅ Created ${studiedDays.length} habit log entries`);
  console.log("\n🎉 Seed complete!");
  console.log("📧 Login: demo@learnit.app");
  console.log("🔑 Password: demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
