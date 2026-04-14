export function jsonToolResult(data: unknown) {
  return { data: JSON.stringify(data, null, 2) };
}
