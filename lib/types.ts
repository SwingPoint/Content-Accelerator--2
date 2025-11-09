export interface PackInput {
  seedUrl?: string;
  seedText?: string;
  angle?: string;
  mustInclude?: string;
  offLimits?: string;
  business: {
    businessName: string;
    region: string;
    website: string;
    valueProp: string;
    voice: 'professional' | 'friendly' | 'witty' | 'authoritative';
  };
  offer: {
    ctaText: string;
    ctaUrl: string;
  };
  keywords: string;
  timezone: string;
  slug: string;
}

export interface GeneratedPack {
  slug: string;
  files: Record<string, string>;
}

export interface PackFile {
  path: string;
  content: string;
}

