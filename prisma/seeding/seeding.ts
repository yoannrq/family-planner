import { assert } from 'console';
import seed from './seed.json' assert { type: 'json' };
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  const hachedPassword = await bcrypt.hash(password, 10);
  return hachedPassword;
}

async function main() {
  /* Seeding color */
  for (const color of seed.colors) {
    await prisma.color.upsert({
      where: { name: color.name },
      update: {
        hexCode: color.hexCode,
      },
      create: {
        name: color.name,
        hexCode: color.hexCode,
      },
    });
  }

  /* Seeding users */
  for (const user of seed.users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: await hashPassword(user.password),
      },
      create: {
        email: user.email,
        password: await hashPassword(user.password),
        name: user.name,
      },
    });
  }

  /* Seeding groups */
  for (const group of seed.groups) {
    await prisma.group.create({
      data: {
        name: group.name,
        color: {
          connect: {
            name: group.color,
          },
        },
        users: {
          connect: group.users.map((user) => {
            return { email: user };
          }),
        },
        owner: {
          connect: {
            email: group.owner,
          },
        },
      },
    });
  }

  /* Seeding contacts */
  for (const contact of seed.contacts) {
    await prisma.contact.create({
      data: {
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        phone: contact.phone,
        address: contact.address,
        type: contact.type,
        content: contact.content,
        groupId: contact.groupId,
      },
    });
  }

  /* Seeding calendarEntries */
  for (const entry of seed.calendarEntries) {
    const color = entry.colorName
      ? await prisma.color.findUnique({
          where: { name: entry.colorName },
          select: { id: true },
        })
      : null;

    const author = await prisma.user.findUnique({
      where: {
        email: entry.authorEmail,
      },
      select: { id: true },
    });

    await prisma.calendarEntry.create({
      data: {
        title: entry.title,
        date: new Date(entry.date),
        startTime: new Date(entry.startTime),
        endTime: entry.endTime ? new Date(entry.endTime) : null,
        location: entry.location,
        entireDay: entry.entireDay,
        colorId: color ? color.id : 1,
        groupId: entry.groupId,
        authorId: author ? author.id : 1,
      },
    });
  }

  /* Seeding messages */
  for (const message of seed.messages) {
    await prisma.message.create({
      data: {
        content: message.content,
        deleted: message.deleted ? message.deleted : false,
        sender: {
          connect: {
            email: message.senderEmail,
          },
        },
        group: {
          connect: {
            id: message.groupId,
          },
        },
      },
    });
  }

  /* Seeding listTypes */
  for (const listType of seed.listTypes) {
    await prisma.listType.upsert({
      where: { title: listType.title },
      update: {
        title: listType.title,
      },
      create: {
        title: listType.title,
      },
    });
  }

  /* Seeding listElementCategories */
  for (const category of seed.listElementCategories) {
    await prisma.listElementCategory.upsert({
      where: { title: category.title },
      update: {
        title: category.title,
      },
      create: {
        title: category.title,
      },
    });
  }

  /* Seeding lists */
  for (const list of seed.lists) {
    const color = list.colorName
      ? await prisma.color.findUnique({
          where: { name: list.colorName },
          select: { id: true },
        })
      : null;

    const type = await prisma.listType.findUnique({
      where: { title: list.typeTitle },
      select: { id: true },
    });

    await prisma.list.create({
      data: {
        title: list.title,
        typeId: type ? type.id : 1,
        groupId: list.groupId,
        colorId: color ? color.id : 1,
      },
    });
  }

  /* Seeding listElements */
  for (const element of seed.listElements) {
    const category = element.categoryTitle
      ? await prisma.listElementCategory.findUnique({
          where: { title: element.categoryTitle },
          select: { id: true },
        })
      : null;

    await prisma.listElement.create({
      data: {
        name: element.name,
        quantity: element.quantity,
        checked: element.checked,
        categoryId: category ? category.id : 1,
        listId: element.listId,
      },
    });
  }
}

main().catch((e) => {
  throw e;
});
