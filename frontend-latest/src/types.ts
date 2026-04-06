// ============================
// UI-facing types (legacy compat)
// ============================

export type ModelFamily = 'GPT-4' | 'CLAUDE-3' | 'LLAMA-3';

export interface PromptProtocol {
  id: string;
  title: string;
  description: string;
  type: 'Verified_Protocol' | 'Standard_Protocol' | 'Experimental';
  tags: string[];
  model: string;
  status: string;
  statusValue?: string;
  systemPrompt: string;
  tokens: string;
  // additional backend fields
  worksCount?: number;
  doesntWorkCount?: number;
  category?: string;
  modelType?: string | null;
  createdAt?: string;
  createdBy?: string;
}

// ============================
// Backend API types (from Prisma schema)
// ============================

export interface BackendPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  exampleOutput?: string | null;
  category: string;
  tags: string[];
  worksCount: number;
  doesntWorkCount: number;
  forkedFrom?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  usageCount: number;
  modelType?: string | null;
  versions?: BackendPromptVersion[];
}

export interface BackendPromptVersion {
  id: string;
  promptId: string;
  content: string;
  createdAt: string;
}

export interface BackendUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendSession {
  id: string;
  userId: string;
  expiresAt: string;
  token: string;
}

// ============================
// Mapper: BackendPrompt → PromptProtocol
// ============================

function getWorksRate(p: BackendPrompt): string {
  const total = p.worksCount + p.doesntWorkCount;
  if (total === 0) return '';
  return `${Math.round((p.worksCount / total) * 100)}%`;
}

function getStatus(p: BackendPrompt): { status: string; statusValue?: string } {
  if (p.isVerified) {
    const rate = getWorksRate(p);
    return { status: 'Verified', statusValue: rate || undefined };
  }
  if (p.worksCount > 50) return { status: 'Elite' };
  if (p.worksCount > 20) return { status: 'Active', statusValue: `${p.worksCount}` };
  if (p.usageCount > 100) return { status: 'Popular' };
  return { status: 'Active' };
}

export function mapBackendPrompt(p: BackendPrompt): PromptProtocol {
  const { status, statusValue } = getStatus(p);
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    type: p.isVerified
      ? 'Verified_Protocol'
      : p.category === 'Experimental'
        ? 'Experimental'
        : 'Standard_Protocol',
    tags: p.tags,
    model: p.modelType || p.category || 'GPT-4',
    status,
    statusValue,
    systemPrompt: p.content,
    tokens: `${Math.ceil(p.content.length / 4)} tokens`,
    worksCount: p.worksCount,
    doesntWorkCount: p.doesntWorkCount,
    category: p.category,
    modelType: p.modelType,
    createdAt: p.createdAt,
    createdBy: p.createdBy,
  };
}

// Keep legacy PROMPTS for fallback (not exported, replaced by API)
export const PROMPTS: PromptProtocol[] = [];
