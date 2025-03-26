export interface Post {
  title: string;
  body: string;
  author: string;
  permlink: string;
  parent_author: string;
  parent_permlink: string;
  created: string;
  last_edited: string | null;
  cashout_time: string;
  remaining_till_cashout: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  last_payout: string;
  tags: string[];
  category: string;
  post_json_metadata: {
    app: string;
    tags: string[];
    description?: string;
    format?: string;
  };
  root_author: string;
  root_permlink: string;
  pending_payout_value: string;
  author_rewards: string;
  author_rewards_in_hive: string;
  total_payout_value: string;
  curator_payout_value: string;
  beneficiary_payout_value: string;
  total_rshares: string;
  net_rshares: string;
  total_vote_weight: number;
  beneficiaries: string;
  max_accepted_payout: string;
  percent_hbd: number;
  allow_votes: boolean;
  allow_curation_rewards: boolean;
  deleted: boolean;
  user_json_metadata: {
    extensions: {
      level: number;
      staticXp: number;
      eth_address: string;
      video_parts: Array<{
        url: string;
        name: string;
        year: string;
        friends: string[];
        filmmaker: string[];
      }>;
      cumulativeXp: number;
    };
  };
  reputation: string;
  followers: string;
  followings: string;
  votes: Array<{
    id: number;
    timestamp: string;
    voter: string;
    weight: number;
    rshares: number;
    total_vote_weight: number;
    pending_payout: number;
    pending_payout_symbol: string;
  }>;
}

export interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface MagazineResponse {
  success: boolean;
  data: Post[];
  pagination: PaginationData;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export function extractMediaFromBody(body: string): Media[] {
  const media: Media[] = [];

  // Extract images
  const imageMatches = body.match(/!\[.*?\]\((.*?)\)/g);
  if (imageMatches) {
    imageMatches.forEach(match => {
      const url = match.match(/\((.*?)\)/)?.[1];
      if (url) media.push({ type: 'image', url });
    });
  }

  // Extract videos from iframes with IPFS links
  const iframeMatches = body.match(/<iframe.*?src="(.*?)".*?><\/iframe>/g);
  if (iframeMatches) {
    iframeMatches.forEach(match => {
      const url = match.match(/src="(.*?)"/)?.[1];
      if (url && url.includes('ipfs.skatehive.app')) {
        media.push({ type: 'video', url });
      }
    });
  }

  return media;
}