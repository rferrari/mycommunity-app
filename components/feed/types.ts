export interface Post {
  title: string;
  body: string;
  author: string;
  permlink: string;
  created: string;
  last_edited: string | null;
  cashout_time: string;
  last_payout: string;
  tags: string[];
  json_metadata: {
    app: string;
    tags: string[];
    image?: string;
  };
  pending_payout_value: string;
  author_rewards: string;
  author_rewards_in_hive: string;
  total_payout_value: string;
  curator_payout_value: string;
  total_vote_weight: number;
  allow_votes: boolean;
  deleted: boolean;
  votes: {
    voter: string;
    weight: number;
    rshares: number;
    timestamp: string;
    pending_payout: number;
    pending_payout_symbol: string;
  }[];
  user_json_metadata?: {
    extensions?: {
      level?: number;
      staticXp?: number;
      eth_address?: string;
      video_parts?: any[];
    }
  };
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