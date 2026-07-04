import randomNumber from "./randomForHandle.js";
import { prisma } from "../lib/prisma.js";

export default async function generateHandle(username: string): Promise<string> {
  const base = username.toLowerCase().trim().replace(/\s+/g, "");

  while (true) {
    const handle = `${base}_${randomNumber(1000, 9999)}`;
    const handleExists = await prisma.user.findUnique({
      where: {
        handle: handle,
      },
    });

    if (!handleExists) return handle;
  }
}
