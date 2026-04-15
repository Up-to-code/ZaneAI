import { notFound } from "next/navigation";

/**
 * WHY:   This route is temporarily deactivated and should return an architectural 404.
 * WHAT:  Renders a 404 Not Found error for the AI Assistant route.
 * HOW:   Immediately calls notFound() in a Server Component context.
 */
export default function AiAssistantPage() {
  return notFound();
}
