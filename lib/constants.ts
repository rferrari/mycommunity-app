export const APP_NAME="SkateHive";
export const STORED_USERS_KEY = 'myc_users';


export const API_BASE____ = 'http://192.168.0.14:3000/api';
export const API_BASE_URL = 'http://192.168.0.14:3000/api/v1';

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || "1510572746cd80c0bb93e2115d44340f";

// LLM Available Models 
const llama3_8b_8192 = "llama3-8b-8192";
const llama32_90b_textpreview = "llama-3.2-90b-text-preview";
const llama32_3b_preview = "llama-3.2-3b-preview";
const llama3_70b_8192 = "llama3-70b-8192";
const llama32_90b_vision = "llama-3.2-90b-vision-preview";
const llama_32_11b_vision = "llama-3.2-11b-vision-preview";
const gpt_4o = "gpt-4o";
const gpt_4_turbo = "gpt-4-turbo";

export const RAG_API_URL = "https://docs-ai-wheat.vercel.app/api/rag"
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
export const GROQ_API_KEY="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"

// export const BotLLMModel = llama3_70b_8192;
export const BotLLMModel = process.env.BOT_LLM_MODEL || gpt_4_turbo;//gpt_4o;//llama3_8b_8192;
export const BotLLMModel_TEMP = 0.7;
export const ChatBackupLLMModel = llama3_8b_8192;
// export const ChatBackupLLMModel = llama3_70b_8192;
export const ChatClankersMModel = llama3_70b_8192;

export const RAGLLMModel = llama3_8b_8192;
export const JSONLLMModel = llama3_8b_8192;
export const AssistentModel = llama3_8b_8192;
export const VisionModel = llama32_90b_vision;

// export const GROQ_API_KEY = process.env.GROQ_API_KEY!;
// export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "";

export const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID!;
export const NOTION_INTEGRATION_TOKEN = process.env.NOTION_INTEGRATION_TOKEN!;
//export const NOTION_PAGE_IDS = (process.env.NOTION_PAGE_IDS as string).split(",");


export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};
