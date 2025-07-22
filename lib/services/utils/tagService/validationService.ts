import { profanityBlacklist } from "./profanityList";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  normalizedTag?: {
    name: string;
    slug: string;
  };
}

export class TagValidationService {
  private readonly profanityBlacklist: Set<string>;

  constructor() {
    this.profanityBlacklist = profanityBlacklist;
  }

  async createTag(pendingTag: string) {
    const validationResult = await this.validateAndNormalizeTag(pendingTag);

    if (!validationResult.isValid || !validationResult.normalizedTag) {
      throw new Error(
        `Tag validation failed: ${validationResult.errors.join(", ")}`
      );
    }

    return {
      name: validationResult.normalizedTag.name,
      slug: validationResult.normalizedTag.slug,
    };
  }

   async validateAndNormalizeTag(
    tag: string
  ): Promise<ValidationResult> {
    const errors: string[] = [];

    // Basic validation
    if (!tag || typeof tag !== "string") {
      errors.push("Tag must be a non-empty string");
      return { isValid: false, errors };
    }

    const trimmedTag = tag.trim();

    if (trimmedTag.length === 0) {
      errors.push("Tag cannot be empty or only whitespace");
      return { isValid: false, errors };
    }

    if (trimmedTag.length > 50) {
      errors.push("Tag cannot exceed 50 characters");
      return { isValid: false, errors };
    }

    if (trimmedTag.length < 2) {
      errors.push("Tag must be at least 2 characters long");
      return { isValid: false, errors };
    }

    const profanityErrors = this.checkProfanity(trimmedTag);
    errors.push(...profanityErrors);

    const spamErrors = this.checkSpammyPatterns(trimmedTag);
    errors.push(...spamErrors);

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    const normalizedTag = this.normalizeTag(trimmedTag);

    return {
      isValid: true,
      errors: [],
      normalizedTag,
    };
  }

  /**
   * Checks for profanity in the tag
   */
  private checkProfanity(tag: string): string[] {
    const errors: string[] = [];
    const lowerTag = tag.toLowerCase();

    // Check direct matches
    for (const badWord of Array.from(this.profanityBlacklist)) {
      if (lowerTag.includes(badWord)) {
        errors.push("Tag contains inappropriate language");
        break; // Only report once
      }
    }

    // Check for l33t speak variations (basic)
    const l33tVariations = lowerTag
      .replace(/3/g, "e")
      .replace(/1/g, "i")
      .replace(/0/g, "o")
      .replace(/4/g, "a")
      .replace(/5/g, "s")
      .replace(/7/g, "t");

    for (const badWord of Array.from(this.profanityBlacklist)) {
      if (l33tVariations.includes(badWord)) {
        errors.push("Tag contains inappropriate language");
        break;
      }
    }

    return errors;
  }

  private checkSpammyPatterns(tag: string): string[] {
    const errors: string[] = [];

    // Check for repeated characters
    if (/(.)\1{3,}/.test(tag)) {
      errors.push("Tag contains too many repeated characters");
    }

    // Check for emojis
    if (
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu.test(
        tag
      )
    ) {
      errors.push("Tag cannot contain emojis");
    }

    // Check for special characters (except allowed ones)
    if (/[^\w\s\-\.#\+]/g.test(tag)) {
      errors.push("Tag contains invalid special characters");
    }

    // Check for spammy words
    if (
      /\b(free|win|click|now|urgent|limited|offer|deal|bonus)\b/gi.test(tag)
    ) {
      errors.push("Tag contains spammy language");
    }

    // Check if only numbers
    if (/^\d+$/.test(tag)) {
      errors.push("Tag cannot contain only numbers");
    }

    // Check if no letters
    if (/^[^a-zA-Z]*$/.test(tag)) {
      errors.push("Tag must contain at least one letter");
    }

    // Check for excessive special characters
    const specialCharCount = (tag.match(/[^\w\s]/g) || []).length;
    if (specialCharCount > tag.length * 0.3) {
      errors.push("Tag contains too many special characters");
    }

    return errors;
  }

  private normalizeTag(tag: string): { name: string; slug: string } {
    const name = tag.trim().replace(/\s+/g, " ");

    const slug = tag
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\-\.#\+]/g, "") // Remove special chars except allowed ones
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/\-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    return { name, slug };
  }

  async isTagValid(pendingTag: string): Promise<boolean> {
    const result = await this.validateAndNormalizeTag(pendingTag);
    return result.isValid;
  }

  previewNormalization(tag: string): { name: string; slug: string } | null {
    if (!tag || typeof tag !== "string" || tag.trim().length === 0) {
      return null;
    }
    return this.normalizeTag(tag.trim());
  }
}
