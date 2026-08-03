// Multi-source vision detection for food recognition

import { VisionResult, ApiKeys } from './types';

const FOOD_PROMPT = `Analyze this food photo. Identify the main food or dish.
Recognize ANY cuisine — Indian (biryani, dal, paneer, dosa, etc.), Chinese, Mexican, Italian, Japanese, Thai, Middle Eastern, American, African, etc.
Estimate a typical single-serving portion.

Return a JSON object with ONLY these fields:
{
  "name": "specific dish name (e.g. 'chicken biryani', 'grilled salmon')",
  "confidence": 0.0 to 1.0,
  "serving_label": "1 plate" or "1 cup" or "1 piece" etc,
  "calories": estimated number per serving,
  "protein_g": grams per serving,
  "carbs_g": grams per serving,
  "fat_g": grams per serving
}

Only return the JSON object, no other text.`;

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// ========== WebLLM (On-Device) ==========

let webLLMEngine: any = null;

export async function initWebLLM(
  modelId: string,
  onProgress?: (progress: string) => void
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');

    webLLMEngine = await CreateMLCEngine(modelId, {
      initProgressCallback: (report: any) => {
        onProgress?.(report.text || `${Math.round(report.progress * 100)}%`);
      },
    });

    return true;
  } catch (error) {
    console.error('WebLLM init failed:', error);
    return false;
  }
}

async function detectWithWebLLM(imageBase64: string): Promise<VisionResult> {
  if (!webLLMEngine) {
    throw new Error('WebLLM not initialized');
  }

  const messages = [
    {
      role: 'user' as const,
      content: [
        { type: 'text' as const, text: FOOD_PROMPT },
        {
          type: 'image_url' as const,
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
        },
      ],
    },
  ];

  const response = await webLLMEngine.chat.completions.create({
    messages,
    max_tokens: 500,
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || '';
  return parseVisionResponse(content);
}

// ========== OpenRouter ==========

async function detectWithOpenRouter(
  imageBase64: string,
  apiKey: string,
  modelId: string = 'meta-llama/llama-3.2-11b-vision-instruct:free'
): Promise<VisionResult> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: FOOD_PROMPT },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter failed: ${response.status}`);
  }

  const data: ChatCompletionResponse = await response.json();
  return parseVisionResponse(data.choices[0]?.message?.content || '');
}

// ========== NVIDIA NIM ==========

async function detectWithNVIDIA(
  imageBase64: string,
  apiKey: string,
  modelId: string = 'meta/llama-3.2-11b-vision-instruct'
): Promise<VisionResult> {
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: FOOD_PROMPT },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA NIM failed: ${response.status}`);
  }

  const data: ChatCompletionResponse = await response.json();
  return parseVisionResponse(data.choices[0]?.message?.content || '');
}

// ========== Groq ==========

async function detectWithGroq(
  imageBase64: string,
  apiKey: string,
  modelId: string = 'llama-3.2-11b-vision-preview'
): Promise<VisionResult> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: FOOD_PROMPT },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq failed: ${response.status}`);
  }

  const data: ChatCompletionResponse = await response.json();
  return parseVisionResponse(data.choices[0]?.message?.content || '');
}

// ========== Custom Endpoint ==========

async function detectWithCustom(
  imageBase64: string,
  endpoint: string,
  apiKey: string,
  modelId?: string
): Promise<VisionResult> {
  const body: any = {
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: FOOD_PROMPT },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0.3,
  };

  if (modelId) {
    body.model = modelId;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Custom endpoint failed: ${response.status}`);
  }

  const data: ChatCompletionResponse = await response.json();
  return parseVisionResponse(data.choices[0]?.message?.content || '');
}

// ========== Parser ==========

function parseVisionResponse(content: string): VisionResult {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      name: 'Unknown',
      confidence: 0,
      servingLabel: '1 serving',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      name: parsed.name || 'Unknown',
      confidence: parsed.confidence || 0.5,
      servingLabel: parsed.serving_label || '1 serving',
      calories: parsed.calories || 0,
      protein: parsed.protein_g || 0,
      carbs: parsed.carbs_g || 0,
      fat: parsed.fat_g || 0,
    };
  } catch {
    // Try regex extraction as fallback
    const nameMatch = content.match(/"name"\s*:\s*"([^"]+)"/);
    const calMatch = content.match(/"calories"\s*:\s*([0-9.]+)/);
    const proteinMatch = content.match(/"protein_g"\s*:\s*([0-9.]+)/);
    const carbsMatch = content.match(/"carbs_g"\s*:\s*([0-9.]+)/);
    const fatMatch = content.match(/"fat_g"\s*:\s*([0-9.]+)/);

    return {
      name: nameMatch?.[1] || 'Unknown',
      confidence: 0.5,
      servingLabel: '1 serving',
      calories: parseFloat(calMatch?.[1] || '0'),
      protein: parseFloat(proteinMatch?.[1] || '0'),
      carbs: parseFloat(carbsMatch?.[1] || '0'),
      fat: parseFloat(fatMatch?.[1] || '0'),
    };
  }
}

// ========== URL Validation (SSRF protection) ==========

/**
 * Validate a custom endpoint URL to prevent SSRF / phishing.
 * Requires HTTPS, blocks loopback and private network ranges.
 */
export function isValidEndpoint(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;

    const host = u.hostname.toLowerCase();
    // Loopback / private / link-local / metadata addresses
    const blocked = [
      /^localhost$/,
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^169\.254\./,
      /^0\.0\.0\.0$/,
      /^::1$/,
      /^fc00:/i,
      /^fe80:/i,
    ];
    return !blocked.some(re => re.test(host));
  } catch {
    return false;
  }
}

// ========== Main Detection Function ==========

export interface DetectFoodOptions {
  source: string;
  imageBase64: string;
  apiKeys: ApiKeys;
  onProgress?: (status: string) => void;
}

export async function detectFood(options: DetectFoodOptions): Promise<VisionResult> {
  const { source, imageBase64, apiKeys, onProgress } = options;

  switch (source) {
    case 'webllm':
      onProgress?.('Running on-device model...');
      return await detectWithWebLLM(imageBase64);

    case 'openrouter':
      if (!apiKeys.openrouter) throw new Error('OpenRouter API key required');
      onProgress?.('Analyzing with OpenRouter...');
      return await detectWithOpenRouter(imageBase64, apiKeys.openrouter);

    case 'nvidia':
      if (!apiKeys.nvidia) throw new Error('NVIDIA API key required');
      onProgress?.('Analyzing with NVIDIA NIM...');
      return await detectWithNVIDIA(imageBase64, apiKeys.nvidia);

    case 'groq':
      if (!apiKeys.groq) throw new Error('Groq API key required');
      onProgress?.('Analyzing with Groq...');
      return await detectWithGroq(imageBase64, apiKeys.groq);

    case 'custom':
      if (!apiKeys.customEndpoint) throw new Error('Custom endpoint required');
      if (!isValidEndpoint(apiKeys.customEndpoint)) {
        throw new Error('Invalid endpoint URL — must be HTTPS and not a private network address');
      }
      if (!apiKeys.openrouter) throw new Error('API key required for custom endpoint');
      onProgress?.('Analyzing with custom endpoint...');
      return await detectWithCustom(
        imageBase64,
        apiKeys.customEndpoint,
        apiKeys.openrouter,
        apiKeys.customModel
      );

    default:
      throw new Error(`Unknown vision source: ${source}`);
  }
}
