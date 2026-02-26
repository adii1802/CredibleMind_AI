import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-answer.ts';
import '@/ai/flows/verify-claims.ts';