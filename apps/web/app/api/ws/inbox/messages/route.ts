import { sendInboxMessage } from "@/server/domains/workspace/inbox/service";
import { toErrorResponse } from "@/server/contracts/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await sendInboxMessage(body);
    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
