import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/client";

const pgAdapter = new PrismaPg({
  connectionString: process.env["DATABASE_URL"],
});

const prismaClient = new PrismaClient({
  adapter: pgAdapter,
});

export default prismaClient;
