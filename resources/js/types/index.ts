export interface User {
    id: number;
    name: string;
    email: string;
}

export interface ContactTag {
    id: number;
    name: string;
    color: string;
}

export interface Contact {
    id: number;
    first_name: string;
    last_name?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    company?: string;
    status: 'lead' | 'customer' | 'hot_prospect' | 'churned';
    lead_score: number;
    notes?: string;
    custom_fields?: Record<string, any>;
    tags?: ContactTag[];
    opportunities?: Opportunity[];
    created_at: string;
    updated_at: string;
}

export interface PipelineStage {
    id: number;
    pipeline_id: number;
    name: string;
    position: number;
    color: string;
    opportunities?: Opportunity[];
}

export interface Pipeline {
    id: number;
    name: string;
    is_default: boolean;
    stages: PipelineStage[];
}

export interface Opportunity {
    id: number;
    pipeline_id: number;
    pipeline_stage_id: number;
    contact_id?: number;
    title: string;
    monetary_value: number;
    status: 'open' | 'won' | 'lost' | 'abandoned';
    priority: 'low' | 'medium' | 'high';
    expected_close_date?: string;
    notes?: string;
    contact?: Contact;
    created_at: string;
}

export interface FunnelStep {
    id: number;
    funnel_id: number;
    step_number: number;
    name: string;
    step_type: 'optin' | 'sales' | 'checkout' | 'thankyou';
    path: string;
    page_elements?: Record<string, any>;
    visitors: number;
    conversions: number;
}

export interface Funnel {
    id: number;
    name: string;
    slug: string;
    description?: string;
    status: 'active' | 'draft' | 'archived';
    custom_domain?: string;
    total_visitors: number;
    total_optins: number;
    total_revenue: number;
    conversion_rate?: number;
    steps?: FunnelStep[];
    created_at: string;
}

export interface WorkflowNodeData {
    id?: number;
    node_key: string;
    node_type: string;
    title: string;
    config?: Record<string, any>;
    position_x: number;
    position_y: number;
}

export interface WorkflowEdgeData {
    id?: number;
    edge_key: string;
    source_node_key: string;
    target_node_key: string;
    source_handle?: string;
    target_handle?: string;
}

export interface Workflow {
    id: number;
    name: string;
    description?: string;
    trigger_type: string;
    status: 'active' | 'draft' | 'paused';
    trigger_config?: Record<string, any>;
    total_enrolled: number;
    total_completed: number;
    nodes?: WorkflowNodeData[];
    edges?: WorkflowEdgeData[];
    executions?: any[];
    created_at: string;
}

export interface WebsiteAudit {
    id: number;
    url: string;
    domain: string;
    company_name?: string;
    status: 'pending' | 'scanning' | 'completed' | 'failed';
    title?: string;
    meta_description?: string;
    services?: string[];
    contact_info?: {
        emails: string[];
        phones: string[];
        socials: Record<string, string>;
    };
    tech_stack?: Record<string, string>;
    missing_tools?: Array<{
        tool: string;
        impact: 'High' | 'Medium' | 'Low';
        description: string;
    }>;
    audit_score: number;
    audit_summary?: string;
    generated_pitch?: string;
    redesign_data?: {
        feasibility: string;
        modernization_score: number;
        summary: string;
        critique_points: string[];
        recommended_additions: string[];
        funnel_blueprint: Array<{ step: string; action: string }>;
    };
    raw_data?: Record<string, any>;
    converted_contact_id?: number;
    converted_contact?: Contact;
    created_at: string;
}

export interface Campaign {
    id: number;
    name: string;
    type: 'email' | 'sms';
    status: 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled';
    subject?: string;
    content: string;
    total_recipients: number;
    sent_count: number;
    delivered_count: number;
    opened_count: number;
    clicked_count: number;
    scheduled_at?: string;
    created_at: string;
}

export interface Message {
    id: number;
    contact_id: number;
    type: 'email' | 'sms' | 'internal_note' | 'webchat';
    direction: 'outbound' | 'inbound';
    sender?: string;
    recipient?: string;
    subject?: string;
    body: string;
    status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
    provider_message_id?: string;
    created_at: string;
}

export interface IntegrationSetting {
    id: number;
    provider: 'twilio' | 'resend' | 'stripe' | 'openai' | 'calendly';
    name: string;
    category: string;
    is_active: boolean;
    is_sandbox: boolean;
    credentials?: Record<string, any>;
    last_tested_at?: string;
}
