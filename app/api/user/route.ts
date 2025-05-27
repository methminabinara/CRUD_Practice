import { PrismaClient } from "@prisma/client";
import { createUserSchema } from "@/lib/validation/user";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.errors }), {
        status: 400,
      });
    }

    const { name, email } = parsed.data;

    // Save to DB
    const newUser = await prisma.user.create({
      data: { name, email },
    });

    return new Response(JSON.stringify(newUser), {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/user error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("GET /api/user error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
