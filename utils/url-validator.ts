export const isValidLink = (url: string): boolean => {
  try {
    // Auto-prefix with "https://" if missing, then validate
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

    new URL(formattedUrl);

    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;

    return urlPattern.test(formattedUrl);
  } catch (error) {
    return false;
  }
};

export function getInitials(fullName: string | null): string {
  if (!fullName) return "";
  const names = fullName?.trim().split(" ");
  if (names?.length === 0) return "";

  const firstInitial = names[0]?.[0] ?? "";
  const lastInitial = names[names.length - 1]?.[0] ?? "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}
