const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL;
  const ownerUsername = process.env.OWNER_USERNAME;
  const ownerPassword = process.env.OWNER_PASSWORD;

  // Check if the environment variables are set
  if (!ownerEmail || !ownerUsername || !ownerPassword) {
    throw new Error(
      "OWNER_EMAIL, OWNER_USERNAME, and OWNER_PASSWORD must be set in environment variables."
    );
  }

  const existingOwner = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });

  if (!existingOwner) {
    const hashPassword = await bcrypt.hash(ownerPassword, 10);

    await prisma.user.create({
      data: {
        email: ownerEmail,
        username: ownerUsername,
        password: hashPassword,
      },
    });

    console.log("Owner account created");
  } else {
    console.log("Owner account already exists");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
