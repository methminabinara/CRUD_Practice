import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
import { createUserSchema } from "@/lib/validation/user";

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return new Response("Invalid data", { status: 400 });
  }

  const user = await prisma.user.create({
    data: parsed.data,
  });

  return Response.json(user);
}
