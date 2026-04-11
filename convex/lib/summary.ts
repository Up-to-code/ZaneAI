export function chunkSummary(summary: string, chunkSize = 24) {
  const words = summary.split(" ");
  const chunks: string[] = [];

  for (let index = 0; index < words.length; index += chunkSize) {
    chunks.push(words.slice(0, index + chunkSize).join(" "));
  }

  return chunks;
}
