import axios from 'axios';

export interface AiRequestOptions {
    provider?: 'huggingface' | 'openai' | 'groq';
    token?: string;
    model?: string;
    prompt?: string;
    systemPrompt?: string;
    audit_id?: number;
    custom_instruction?: string;
}

export interface AiResponse {
    status: number;
    success: boolean;
    content?: string;
    message?: string;
    provider?: string;
    model?: string;
    is_sandbox?: boolean;
    notice?: string;
}

/**
 * Direct 200 OK JSON API Call for AI Connection Testing
 * (Zero 302/303 Redirects in DevTools!)
 */
export async function testAiConnectionDirect(options: AiRequestOptions): Promise<AiResponse> {
    try {
        const response = await axios.post<AiResponse>('/api/ai/test-connection', options);
        return response.data;
    } catch (error: any) {
        return {
            status: error.response?.status || 500,
            success: false,
            message: error.response?.data?.message || error.message || 'API connection test failed.',
        };
    }
}

/**
 * Direct 200 OK JSON API Call for AI Cold Pitch Generation
 */
export async function generateAiPitchDirect(options: AiRequestOptions): Promise<AiResponse> {
    try {
        const response = await axios.post<AiResponse>('/api/ai/generate-pitch', options);
        return response.data;
    } catch (error: any) {
        return {
            status: error.response?.status || 500,
            success: false,
            message: error.response?.data?.message || error.message || 'AI Pitch generation failed.',
        };
    }
}

/**
 * Direct 200 OK JSON API Call for Deep AI Audit & Redesign Blueprint
 */
export async function runAiAuditDirect(options: AiRequestOptions): Promise<any> {
    try {
        const response = await axios.post('/api/ai/run-audit', options);
        return response.data;
    } catch (error: any) {
        return {
            status: error.response?.status || 500,
            success: false,
            message: error.response?.data?.message || error.message || 'Deep AI Audit failed.',
        };
    }
}

/**
 * Direct Call to Standalone Node.js Microservice (http://localhost:3001/api/ai/generate)
 */
export async function callNodeJsAiService(options: AiRequestOptions): Promise<AiResponse> {
    try {
        const response = await axios.post<AiResponse>('http://localhost:3001/api/ai/generate', options);
        return response.data;
    } catch (error: any) {
        return {
            status: error.response?.status || 500,
            success: false,
            message: error.response?.data?.error || error.message || 'Node.js AI microservice unreachable at http://localhost:3001.',
        };
    }
}
