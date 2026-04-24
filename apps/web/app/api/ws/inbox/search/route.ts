import { NextRequest } from "next/server";
import { searchInboxTargets } from "@/server/domains/workspace/inbox/service";
import { toErrorResponse } from "@/server/contracts/errors";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";
    if (!query) {
      return Response.json([]);
    }

    const results = await searchInboxTargets(query);
    return Response.json(results);
  } catch (error) {
    return toErrorResponse(error);
  }
}
