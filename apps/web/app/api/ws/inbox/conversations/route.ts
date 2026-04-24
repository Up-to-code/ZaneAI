import { NextRequest } from "next/server";
import { listInboxConversations } from "@/server/domains/workspace/inbox/service";
import { toErrorResponse } from "@/server/contracts/errors";

export async function GET(request: NextRequest) {
  try {
    const archived = request.nextUrl.searchParams.get("archived") === "true";
    const conversations = await listInboxConversations(archived);
    return Response.json(conversations);
  } catch (error) {
    return toErrorResponse(error);
  }
}
