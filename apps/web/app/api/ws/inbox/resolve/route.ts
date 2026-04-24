import { resolveInboxConversation } from "@/server/domains/workspace/inbox/service";
import { toErrorResponse } from "@/server/contracts/errors";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { targetUserId: string };
    const conversationId = await resolveInboxConversation({ targetUserId: body.targetUserId });
    return Response.json({ conversationId });
  } catch (error) {
    return toErrorResponse(error);
  }
}
