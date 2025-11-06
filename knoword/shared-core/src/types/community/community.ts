import { Tag } from "./communityTag";

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  banner: string | null;
  isPrivate: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tags: Tag[];
  memberCount: number;
  isOwner?: boolean;
  isMember?: boolean;
}

export interface CommunityCreateData {
  name: string;
  description: string;
  avatar?: string | null;
  banner?: string | null;
  isPrivate: boolean;
  tags: string[];
}

export interface CommunityUpdateData {
  name?: string;
  description?: string;
  avatar?: string | null;
  banner?: string | null;
  isPrivate?: boolean;
  tags?: { name: string }[];
}