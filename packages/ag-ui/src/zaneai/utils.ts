type ClassValue = string | number | boolean | null | undefined | ClassValue[];

function flattenClasses(inputs: ClassValue[]): string[] {
  const result: string[] = [];
  for (const input of inputs) {
    if (!input) {
      continue;
    }
    if (Array.isArray(input)) {
      result.push(...flattenClasses(input));
      continue;
    }
    result.push(String(input));
  }
  return result;
}

export function cn(...inputs: ClassValue[]) {
  return flattenClasses(inputs).join(" ");
}
