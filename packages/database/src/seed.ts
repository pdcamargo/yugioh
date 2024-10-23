import type { User } from "@prisma/client";
import { prisma } from "./client";

import { hashPassword } from "./password";

const DEFAULT_USERS = [
  // Add your own user to pre-populate the database with
  {
    name: "Admin",
    email: "admin@mail.com",
    emailVerified: new Date(),
    password: hashPassword("123"),
    gems: 10000,
  },
  {
    name: "Patrick",
    email: "patrick@mail.com",
    emailVerified: new Date(),
    password: hashPassword("123"),
    gems: 99999,
  },
] as Array<Partial<User>>;

(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            email: user.email!,
          },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        }),
      ),
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

// cm214mbng00003tqswsvqvo2y
