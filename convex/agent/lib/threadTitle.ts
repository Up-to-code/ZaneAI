const MAX_TITLE_LENGTH = 48;

const LEADING_FILLERS = [
  "hey",
  "hi",
  "hello",
  "please",
  "can you",
  "could you",
  "i want to",
  "i need to",
  "عايز",
  "عاوز",
  "ممكن",
  "لو سمحت",
  "من فضلك",
];

export function isPlaceholderThreadTitle(title: string | null | undefined) {
  if (!title) return true;
  const normalized = title.trim().toLowerCase();
  return normalized === "new thread" || normalized === "recovered thread";
}

function stripLeadingFiller(value: string) {
  let next = value.trim();
  for (const filler of LEADING_FILLERS) {
    const pattern = new RegExp(`^${filler.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b[\\s,:-]*`, "i");
    next = next.replace(pattern, "").trim();
  }
  return next || value.trim();
}

export function buildThreadTitleFromPrompt(prompt: string) {
  const compact = prompt
    .replace(/\s+/g, " ")
    .replace(/^[\s"'`“”‘’.,!?؟،؛:;-]+/, "")
    .trim();

  const withoutFiller = stripLeadingFiller(compact);
  const phrase = withoutFiller.split(/[.!?؟\n]/)[0]?.trim() || withoutFiller;
  const words = phrase.split(/\s+/).filter(Boolean);
  let title = words.slice(0, 9).join(" ");

  if (title.length > MAX_TITLE_LENGTH) {
    title = `${title.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`;
  }

  return title || "New thread";
}
