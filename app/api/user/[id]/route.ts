import { PrismaClient } from "@prisma/client";
import { updateUserSchema } from "@/lib/validation/user";

const prisma = new PrismaClient();

// GET /api/user/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("GET /api/user/[id] error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// PUT /api/user/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.errors }), {
        status: 400,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("PUT /api/user/[id] error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// DELETE /api/user/[id]
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: params.id },
    });

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error("DELETE /api/user/[id] error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
