export function slugFromTitle(title: string): string {
  const slug = title.trim().replace(/\s+/g, '-');
  return slug || 'untitled';
}

export function generateDraftSlug(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function resolveReleasedAt(isTemp: boolean): Date | null {
  return isTemp ? null : new Date();
}
