import { getInboxConversation } from "@/server/domains/workspace/inbox/service";
import { toErrorResponse } from "@/server/contracts/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const { conversationId } = await params;
    const conversation = await getInboxConversation(conversationId);
    return Response.json(conversation);
  } catch (error) {
    return toErrorResponse(error);
  }
}
