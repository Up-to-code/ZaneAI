import {
  createInboxPrivateOfferInConversation,
  publishInboxConversationOffer,
  respondToInboxConversationOffer,
  shareInboxDealInConversation,
  shareInboxFileInConversation,
  shareInboxProjectInConversation,
} from "@/server/domains/workspace/inbox/service";
import { DomainError, toErrorResponse } from "@/server/contracts/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const intent = body?.intent;

    switch (intent) {
      case "shareFile":
        return Response.json(await shareInboxFileInConversation(body));
      case "shareProject":
        return Response.json(await shareInboxProjectInConversation(body));
      case "shareDeal":
        return Response.json(await shareInboxDealInConversation(body));
      case "createPrivateOfferDraft":
        return Response.json(await createInboxPrivateOfferInConversation(body));
      case "publishConversationOffer":
        return Response.json(await publishInboxConversationOffer(body));
      case "respondToConversationOffer":
        return Response.json(await respondToInboxConversationOffer(body));
      default:
        throw new DomainError({
          code: "INVALID_ARGUMENT",
          message: "Unsupported inbox intent.",
          status: 400,
        });
    }
  } catch (error) {
    return toErrorResponse(error);
  }
}
