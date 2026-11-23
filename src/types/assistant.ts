export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  scientificReasoning?: string;
  environmentalImpact?: string;
  isStreaming?: boolean;
}

export interface AssistantContext {
  city: string;
  usAqi: number;
  category: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  userLifestyle?: {
    commute?: string;
    exerciseTime?: string;
    hasVulnerableFamily?: boolean;
    hasPurifier?: boolean;
  };
}

