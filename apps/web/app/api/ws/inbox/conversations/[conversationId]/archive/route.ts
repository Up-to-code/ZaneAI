import { setInboxConversationArchived } from "@/server/domains/workspace/inbox/service";
import { toErrorResponse } from "@/server/contracts/errors";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const { archived } = (await request.json()) as { archived: boolean };
    const { conversationId } = await params;
    await setInboxConversationArchived({ conversationId, archived });
    return Response.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
