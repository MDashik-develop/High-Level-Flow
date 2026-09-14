import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import {
    ArrowLeft,
    Save,
    Monitor,
    Tablet,
    Smartphone,
    Undo,
    Redo,
    Eye,
    EyeOff,
    Layers,
    Sliders,
    Sparkles,
    CheckCircle2,
    Sun,
    Moon,
    Code,
    Trash2,
    Copy,
    Check,
    X,
    LayoutTemplate,
} from 'lucide-react';
import { Funnel, FunnelStep } from '../../types';

interface Props {
    funnel: Funnel;
    step: FunnelStep;
}

// Preset High-Converting Funnel Templates
const TEMPLATES: Record<string, { name: string; desc: string; html: string }> = {
    optin: {
        name: 'Lead Magnet Opt-In',
        desc: 'High-converting opt-in page with lead capture form and privacy badge.',
        html: `
            <section style="padding: 60px 20px; text-align: center; background: linear-gradient(180deg, #090d16 0%, #0f172a 100%); color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">
                <div style="max-width: 800px; margin: 0 auto;">
                    <span style="display: inline-block; padding: 6px 14px; background: rgba(79, 70, 229, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #818cf8; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 20px;">
                        Exclusive Lead Generation System
                    </span>
                    <h1 style="font-size: 42px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; color: #ffffff;">
                        Double Your Inbound Client Consultations in 30 Days
                    </h1>
                    <p style="font-size: 18px; color: #94a3b8; max-width: 600px; margin: 0 auto 32px auto; line-height: 1.6;">
                        Eliminate phone tag with 24/7 automated booking and instant 2-way SMS speed-to-lead follow-up.
                    </p>
                    
                    <div style="background: #0b1120; border: 1px solid #1e293b; padding: 32px; border-radius: 6px; max-width: 440px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Claim Your Custom Strategy Walkthrough</h3>
                        <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">Enter your details below to get instant access.</p>
                        
                        <div style="margin-bottom: 12px; text-align: left;">
                            <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: 600;">Full Name</label>
                            <input type="text" placeholder="John Doe" style="width: 100%; box-sizing: border-box; background: #070a12; border: 1px solid #334155; padding: 10px 14px; border-radius: 4px; color: #ffffff; font-size: 13px;" />
                        </div>
                        <div style="margin-bottom: 12px; text-align: left;">
                            <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: 600;">Business Email</label>
                            <input type="email" placeholder="john@company.com" style="width: 100%; box-sizing: border-box; background: #070a12; border: 1px solid #334155; padding: 10px 14px; border-radius: 4px; color: #ffffff; font-size: 13px;" />
                        </div>
                        <div style="margin-bottom: 20px; text-align: left;">
                            <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: 600;">Direct Cell Phone (For SMS)</label>
                            <input type="tel" placeholder="+1 (555) 000-0000" style="width: 100%; box-sizing: border-box; background: #070a12; border: 1px solid #334155; padding: 10px 14px; border-radius: 4px; color: #ffffff; font-size: 13px;" />
                        </div>
                        
                        <button type="button" style="width: 100%; background: #4f46e5; color: #ffffff; padding: 14px 20px; font-size: 14px; font-weight: 700; border: none; border-radius: 4px; cursor: pointer; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); transition: 0.2s;">
                            Confirm My Consultation Now →
                        </button>
                        <p style="font-size: 11px; color: #64748b; margin-top: 12px;">🔒 256-bit encryption • No spam guarantee</p>
                    </div>
                </div>
            </section>
        `,
    },
    vsl_booking: {
        name: 'VSL & Strategy Booking Funnel',
        desc: 'Video sales letter paired with an automated appointment booking calendar.',
        html: `
            <section style="padding: 60px 20px; text-align: center; background: #0b1120; color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">
                <div style="max-width: 900px; margin: 0 auto;">
                    <span style="display: inline-block; padding: 6px 14px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 16px;">
                        CASE STUDY & LIVE DEMONSTRATION
                    </span>
                    <h1 style="font-size: 38px; font-weight: 800; line-height: 1.25; margin-bottom: 24px;">
                        How We Added $38,000 In Retainer Revenue Using HighLevel Automation
                    </h1>
                    
                    <!-- 16:9 VSL Player Container -->
                    <div style="max-width: 800px; margin: 0 auto 40px auto; background: #070a12; border: 2px solid #334155; border-radius: 8px; aspect-ratio: 16/9; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
                        <div style="width: 70px; height: 70px; border-radius: 50%; background: #4f46e5; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; cursor: pointer; box-shadow: 0 0 30px rgba(79, 70, 229, 0.6);">
                            <span style="color: #ffffff; font-size: 24px; margin-left: 4px;">▶</span>
                        </div>
                        <p style="font-size: 14px; color: #cbd5e1; font-weight: 600;">Click to Play 12-Minute Breakdown (Sound On)</p>
                    </div>

                    <!-- GHL Strategy Call Booking Embed Widget -->
                    <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 32px; max-width: 650px; margin: 0 auto; text-align: left;">
                        <h3 style="font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 6px;">Select Date & Time For Strategy Call</h3>
                        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px;">30-Minute 1-on-1 Agency Architecture Session with Lead Specialist.</p>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                            <button style="padding: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center;">
                                Tomorrow<br/><span style="font-size: 11px; color: #818cf8;">10:00 AM EST</span>
                            </button>
                            <button style="padding: 12px; background: #4f46e5; border: 1px solid #6366f1; border-radius: 4px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center;">
                                Tomorrow<br/><span style="font-size: 11px; color: #e0e7ff;">02:30 PM EST</span>
                            </button>
                            <button style="padding: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center;">
                                Thursday<br/><span style="font-size: 11px; color: #818cf8;">04:00 PM EST</span>
                            </button>
                        </div>
                        
                        <button style="width: 100%; background: #10b981; color: #ffffff; padding: 14px; font-size: 15px; font-weight: 700; border: none; border-radius: 4px; cursor: pointer; transition: 0.2s;">
                            Confirm Appointment Booking →
                        </button>
                    </div>
                </div>
            </section>
        `,
    },
    retainer_sales: {
        name: 'High-Ticket Retainer Sales Page',
        desc: 'Full sales page with service breakdown, client review, and pricing table.',
        html: `
            <section style="padding: 60px 20px; background: #070a12; color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">
                <div style="max-width: 960px; margin: 0 auto; text-align: center;">
                    <h1 style="font-size: 40px; font-weight: 800; margin-bottom: 16px;">
                        The Complete Client Acquisition & CRM Operating System
                    </h1>
                    <p style="font-size: 17px; color: #94a3b8; max-width: 650px; margin: 0 auto 40px auto; line-height: 1.6;">
                        Replace ClickFunnels, ActiveCampaign, Calendly, and Zapier with one unified, high-performing platform.
                    </p>

                    <!-- 3 Feature Pillars -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 50px; text-align: left;">
                        <div style="background: #0f172a; border: 1px solid #1e293b; padding: 24px; border-radius: 6px;">
                            <h4 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px;">1. Smart Funnels & Pages</h4>
                            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Drag-and-drop builder with built-in speed optimization and responsive mobile views.</p>
                        </div>
                        <div style="background: #0f172a; border: 1px solid #1e293b; padding: 24px; border-radius: 6px;">
                            <h4 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px;">2. SMS Speed-to-Lead</h4>
                            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Automated 60-second follow-ups over SMS and Email when new prospects opt in.</p>
                        </div>
                        <div style="background: #0f172a; border: 1px solid #1e293b; padding: 24px; border-radius: 6px;">
                            <h4 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px;">3. Kanban CRM Pipeline</h4>
                            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Visual deal tracking with monetary stage totals and automatic stage progressions.</p>
                        </div>
                    </div>

                    <!-- Pricing Table Card -->
                    <div style="max-width: 420px; margin: 0 auto 40px auto; background: #0b1120; border: 2px solid #4f46e5; border-radius: 8px; padding: 36px; box-shadow: 0 10px 40px rgba(79, 70, 229, 0.25);">
                        <span style="background: #4f46e5; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase;">Most Popular Retainer</span>
                        <h3 style="font-size: 24px; font-weight: 800; margin: 16px 0 8px 0;">All-In-One Agency Plan</h3>
                        <div style="font-size: 42px; font-weight: 800; color: #818cf8; margin-bottom: 20px;">
                            $1,500 <span style="font-size: 15px; color: #64748b; font-weight: normal;">/ month</span>
                        </div>
                        <ul style="text-align: left; padding: 0; list-style: none; font-size: 13px; color: #cbd5e1; line-height: 2.4; margin-bottom: 28px;">
                            <li>✓ Unlimited Funnels & Landing Pages</li>
                            <li>✓ 2-Way Unified Inbox (SMS, Email, Notes)</li>
                            <li>✓ Automated Workflow Builder & Triggers</li>
                            <li>✓ Website Audit & Crawler Lead Generator</li>
                            <li>✓ Dedicated Client Pipeline Boards</li>
                        </ul>
                        <button style="width: 100%; background: #4f46e5; color: #fff; padding: 14px; font-size: 15px; font-weight: 700; border: none; border-radius: 4px; cursor: pointer;">
                            Start Retainer Now →
                        </button>
                    </div>
                </div>
            </section>
        `,
    },
    blank: {
        name: 'Blank Canvas',
        desc: 'Clean empty canvas to build your custom funnel page from scratch.',
        html: `
            <section style="padding: 80px 20px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
                <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 12px;">Start Building Your Funnel</h1>
                <p style="color: #64748b; font-size: 16px;">Drag blocks from the left panel onto this canvas to create your page.</p>
            </section>
        `,
    },
};

export default function GrapesBuilder({ funnel, step }: Props) {
    const editorRef = useRef<Editor | null>(null);
    const [saving, setSaving] = useState(false);
    const [savedNotice, setSavedNotice] = useState(false);
    const [activeTab, setActiveTab] = useState<'blocks' | 'styles'>('blocks');
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isPreview, setIsPreview] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [codeOutput, setCodeOutput] = useState({ html: '', css: '' });
    const [copied, setCopied] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const next = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        localStorage.setItem('hl_theme', next);
        if (next === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    useEffect(() => {
        if (editorRef.current) return;

        // Default initial HTML if none exists
        const initialHtml = step.page_elements?.grapes_html || TEMPLATES.optin.html;

        const editor = grapesjs.init({
            container: '#gjs-canvas',
            height: '100%',
            width: 'auto',
            fromElement: false,
            storageManager: false,
            canvas: {
                styles: [
                    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap',
                ],
                scripts: [],
            },
            deviceManager: {
                devices: [
                    { id: 'desktop', name: 'Desktop', width: '' },
                    { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
                    { id: 'mobile', name: 'Mobile', width: '375px', widthMedia: '480px' },
                ],
            },
            blockManager: {
                appendTo: '#gjs-blocks',
                blocks: [
                    // 1. Hero Header Block
                    {
                        id: 'section-hero',
                        label: '<b>Hero Header</b>',
                        category: 'Conversion',
                        content: `
                            <section style="padding: 80px 20px; text-align: center; background: #0b1120; color: #ffffff;">
                                <span style="display: inline-block; padding: 4px 12px; background: rgba(79, 70, 229, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #818cf8; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 4px; margin-bottom: 16px;">
                                    HIGH-CONVERTING FUNNEL
                                </span>
                                <h1 style="font-size: 42px; font-weight: 800; margin-bottom: 16px;">Scale Your Agency On Autopilot</h1>
                                <p style="font-size: 18px; color: #94a3b8; max-width: 600px; margin: 0 auto 28px auto; line-height: 1.6;">
                                    Automated sales funnels, CRM pipelines and unified 2-way messaging in one seamless system.
                                </p>
                                <button style="background: #4f46e5; color: #ffffff; padding: 14px 32px; font-size: 15px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; box-shadow: 0 4px 14px rgba(79,70,229,0.4);">
                                    Claim Strategy Session Now →
                                </button>
                            </section>
                        `,
                    },
                    // 2. Lead Capture Box
                    {
                        id: 'optin-form',
                        label: '<b>Lead Capture Box</b>',
                        category: 'Conversion',
                        content: `
                            <div style="background: #0f172a; border: 1px solid #334155; padding: 28px; border-radius: 6px; max-width: 420px; margin: 24px auto; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                                <h3 style="font-size: 18px; margin-bottom: 6px; font-weight: bold;">Get Instant Access</h3>
                                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Enter your business details below:</p>
                                <input type="text" placeholder="Full Name" style="width: 100%; box-sizing: border-box; background: #070a12; border: 1px solid #334155; padding: 10px; margin-bottom: 10px; border-radius: 4px; color: #fff;" />
                                <input type="email" placeholder="Work Email" style="width: 100%; box-sizing: border-box; background: #070a12; border: 1px solid #334155; padding: 10px; margin-bottom: 10px; border-radius: 4px; color: #fff;" />
                                <input type="tel" placeholder="Mobile Phone (For SMS)" style="width: 100%; box-sizing: border-box; background: #070a12; border: 1px solid #334155; padding: 10px; margin-bottom: 16px; border-radius: 4px; color: #fff;" />
                                <button style="width: 100%; background: #10b981; color: #fff; padding: 12px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                                    Submit & Schedule Call
                                </button>
                            </div>
                        `,
                    },
                    // 3. Strategy Booking Calendar (GHL Signature Feature)
                    {
                        id: 'calendar-widget',
                        label: '<b>Booking Calendar</b>',
                        category: 'Conversion',
                        content: `
                            <div style="background: #0b1120; border: 1px solid #1e293b; border-radius: 6px; padding: 28px; max-width: 580px; margin: 24px auto; color: #fff;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 12px;">
                                    <h4 style="font-size: 16px; font-weight: 700; margin: 0;">Select Appointment Slot</h4>
                                    <span style="font-size: 11px; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: bold;">30 MIN ZOOM</span>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                                    <div style="padding: 10px; background: #070a12; border: 1px solid #334155; border-radius: 4px; text-align: center; cursor: pointer;">
                                        <div style="font-size: 12px; font-weight: bold;">Tomorrow</div>
                                        <div style="font-size: 11px; color: #818cf8;">11:00 AM</div>
                                    </div>
                                    <div style="padding: 10px; background: #4f46e5; border: 1px solid #6366f1; border-radius: 4px; text-align: center; cursor: pointer;">
                                        <div style="font-size: 12px; font-weight: bold; color: #fff;">Tomorrow</div>
                                        <div style="font-size: 11px; color: #e0e7ff;">02:00 PM</div>
                                    </div>
                                    <div style="padding: 10px; background: #070a12; border: 1px solid #334155; border-radius: 4px; text-align: center; cursor: pointer;">
                                        <div style="font-size: 12px; font-weight: bold;">Thursday</div>
                                        <div style="font-size: 11px; color: #818cf8;">04:30 PM</div>
                                    </div>
                                </div>
                                <button style="width: 100%; background: #4f46e5; color: #fff; padding: 12px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer;">
                                    Confirm Strategy Booking
                                </button>
                            </div>
                        `,
                    },
                    // 4. Video Player (VSL)
                    {
                        id: 'vsl-video',
                        label: '<b>VSL Video Player</b>',
                        category: 'Media',
                        content: `
                            <div style="padding: 24px 20px; text-align: center;">
                                <div style="max-width: 720px; margin: 0 auto; background: #070a12; border: 2px solid #334155; border-radius: 6px; aspect-ratio: 16/9; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                                    <div style="width: 60px; height: 60px; border-radius: 50%; background: #4f46e5; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; margin-bottom: 8px;">
                                        ▶
                                    </div>
                                    <span style="font-size: 14px; font-weight: 600; color: #cbd5e1;">Watch Video Overview (16:9)</span>
                                </div>
                            </div>
                        `,
                    },
                    // 5. Pricing Table
                    {
                        id: 'pricing-table',
                        label: '<b>Pricing Card</b>',
                        category: 'Conversion',
                        content: `
                            <div style="max-width: 380px; margin: 24px auto; padding: 32px; background: #0b1120; border: 2px solid #4f46e5; border-radius: 6px; text-align: center; color: #fff;">
                                <h3 style="font-size: 22px; font-weight: bold; margin-bottom: 8px;">Agency Pro Retainer</h3>
                                <div style="font-size: 36px; font-weight: 800; color: #818cf8; margin: 16px 0;">$1,500 <span style="font-size: 14px; color: #64748b;">/ mo</span></div>
                                <ul style="text-align: left; padding: 0; list-style: none; font-size: 13px; color: #cbd5e1; line-height: 2.2; margin-bottom: 24px;">
                                    <li>✓ High-Converting Sales Funnel</li>
                                    <li>✓ Speed-to-Lead SMS & Email Engine</li>
                                    <li>✓ Kanban CRM Pipeline Management</li>
                                    <li>✓ Automated Website Audit Crawling</li>
                                </ul>
                                <button style="width: 100%; background: #4f46e5; color: #fff; padding: 12px; font-weight: bold; border: none; border-radius: 4px; cursor: pointer;">
                                    Lock In Retainer
                                </button>
                            </div>
                        `,
                    },
                    // 6. Urgency Countdown Banner
                    {
                        id: 'countdown-timer',
                        label: '<b>Urgency Countdown</b>',
                        category: 'Conversion',
                        content: `
                            <div style="background: #ef4444; color: #ffffff; padding: 12px 20px; text-align: center; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 12px;">
                                <span>⚠️ Limited Availability: Current Onboarding Window Closes In:</span>
                                <span style="background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 16px;">14:59</span>
                            </div>
                        `,
                    },
                    // 7. 2 Columns Layout
                    {
                        id: 'two-cols',
                        label: '<b>2 Columns</b>',
                        category: 'Layout',
                        content: `
                            <div style="display: flex; gap: 20px; padding: 40px 20px; max-width: 1000px; margin: 0 auto; flex-wrap: wrap;">
                                <div style="flex: 1; min-width: 280px; padding: 24px; background: #0f172a; border-radius: 4px; border: 1px solid #1e293b;">
                                    <h3 style="font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 8px;">Automated 2-Way SMS</h3>
                                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">Follow up with incoming leads in under 60 seconds automatically before they look for another provider.</p>
                                </div>
                                <div style="flex: 1; min-width: 280px; padding: 24px; background: #0f172a; border-radius: 4px; border: 1px solid #1e293b;">
                                    <h3 style="font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 8px;">Visual Deal Pipeline</h3>
                                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">Drag opportunities across custom pipeline stages with real-time conversion metrics and deal value totals.</p>
                                </div>
                            </div>
                        `,
                    },
                    // 8. 3 Cards Grid
                    {
                        id: 'three-cards',
                        label: '<b>3 Column Grid</b>',
                        category: 'Layout',
                        content: `
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 40px 20px; max-width: 1000px; margin: 0 auto;">
                                <div style="background: #0b1120; border: 1px solid #1e293b; padding: 20px; border-radius: 4px;">
                                    <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 6px;">Feature 1</h4>
                                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">Automated lead scoring and contact tagging based on client interactions.</p>
                                </div>
                                <div style="background: #0b1120; border: 1px solid #1e293b; padding: 20px; border-radius: 4px;">
                                    <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 6px;">Feature 2</h4>
                                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">Visual node workflow canvas for multi-branch automation triggers.</p>
                                </div>
                                <div style="background: #0b1120; border: 1px solid #1e293b; padding: 20px; border-radius: 4px;">
                                    <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 6px;">Feature 3</h4>
                                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">Website crawler with instant audit reports and pre-written pitch emails.</p>
                                </div>
                            </div>
                        `,
                    },
                    // 9. Client Review
                    {
                        id: 'testimonial-card',
                        label: '<b>Client Review</b>',
                        category: 'Social Proof',
                        content: `
                            <div style="padding: 24px; background: #0f172a; border-left: 4px solid #10b981; border-radius: 4px; max-width: 600px; margin: 20px auto; color: #fff;">
                                <div style="color: #f59e0b; margin-bottom: 8px; font-size: 14px;">★★★★★</div>
                                <p style="font-style: italic; color: #cbd5e1; font-size: 14px; margin-bottom: 12px; line-height: 1.6;">
                                    "We recovered over 20 lost dental inquiries in our first two weeks simply by having the automated booking calendar and instant SMS follow-up running."
                                </p>
                                <span style="font-weight: bold; font-size: 13px; color: #f8fafc;">— Dr. Marcus Vance, Apex Dental Group</span>
                            </div>
                        `,
                    },
                    // 10. FAQ Accordion
                    {
                        id: 'faq-block',
                        label: '<b>FAQ Accordion</b>',
                        category: 'Conversion',
                        content: `
                            <div style="max-width: 700px; margin: 30px auto; padding: 20px; color: #fff;">
                                <h3 style="text-align: center; font-size: 22px; font-weight: 700; margin-bottom: 24px;">Frequently Asked Questions</h3>
                                <div style="border-bottom: 1px solid #1e293b; padding: 16px 0;">
                                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 6px; color: #818cf8;">How quickly can we launch this funnel?</h4>
                                    <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Our pre-built templates and GrapesJS drag-and-drop editor allow you to deploy in under 24 hours.</p>
                                </div>
                                <div style="border-bottom: 1px solid #1e293b; padding: 16px 0;">
                                    <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 6px; color: #818cf8;">Are SMS and Email fees included?</h4>
                                    <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">You can connect your own Twilio and Resend keys directly with zero markup or use our built-in simulator.</p>
                                </div>
                            </div>
                        `,
                    },
                    // 11. Footer Block
                    {
                        id: 'footer-links',
                        label: '<b>Compliant Footer</b>',
                        category: 'Legal',
                        content: `
                            <footer style="padding: 40px 20px; background: #070a12; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 12px;">
                                <p style="margin-bottom: 8px;">© ${new Date().getFullYear()} HighLevel Flow Automation. All rights reserved.</p>
                                <p style="margin: 0;">
                                    <a href="#" style="color: #94a3b8; text-decoration: none; margin: 0 10px;">Privacy Policy</a> |
                                    <a href="#" style="color: #94a3b8; text-decoration: none; margin: 0 10px;">Terms of Service</a> |
                                    <a href="#" style="color: #94a3b8; text-decoration: none; margin: 0 10px;">Earnings Disclaimer</a>
                                </p>
                            </footer>
                        `,
                    },
                ],
            },
            styleManager: {
                appendTo: '#gjs-styles',
                sectors: [
                    {
                        name: 'Typography',
                        open: true,
                        buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align'],
                    },
                    {
                        name: 'Dimensions & Spacing',
                        open: false,
                        buildProps: ['width', 'max-width', 'height', 'padding', 'margin'],
                    },
                    {
                        name: 'Colors & Backgrounds',
                        open: false,
                        buildProps: ['background-color', 'background'],
                    },
                    {
                        name: 'Borders & Geometry',
                        open: false,
                        buildProps: ['border', 'border-radius', 'box-shadow'],
                    },
                    {
                        name: 'Flex Layout',
                        open: false,
                        buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'gap'],
                    },
                ],
            },
        });

        // Set initial HTML content
        editor.setComponents(initialHtml);
        if (step.page_elements?.grapes_css) {
            editor.setStyle(step.page_elements.grapes_css);
        }

        editorRef.current = editor;

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    const setDeviceMode = (dev: 'desktop' | 'tablet' | 'mobile') => {
        setDevice(dev);
        if (editorRef.current) {
            editorRef.current.setDevice(dev);
        }
    };

    const togglePreview = () => {
        if (!editorRef.current) return;
        if (isPreview) {
            editorRef.current.stopCommand('preview');
            setIsPreview(false);
        } else {
            editorRef.current.runCommand('preview');
            setIsPreview(true);
        }
    };

    const handleOpenCode = () => {
        if (!editorRef.current) return;
        setCodeOutput({
            html: editorRef.current.getHtml(),
            css: editorRef.current.getCss() || '',
        });
        setShowCodeModal(true);
        setCopied(false);
    };

    const handleCopyCode = () => {
        const fullCode = `<style>\n${codeOutput.css}\n</style>\n${codeOutput.html}`;
        navigator.clipboard.writeText(fullCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClearCanvas = () => {
        if (!editorRef.current) return;
        if (window.confirm('Are you sure you want to clear the canvas? All unsaved blocks will be removed.')) {
            editorRef.current.DomComponents.clear();
        }
    };

    const handleLoadTemplate = (key: string) => {
        if (!editorRef.current) return;
        const selected = TEMPLATES[key];
        if (!selected) return;

        if (window.confirm(`Load template: "${selected.name}"? This will replace current canvas content.`)) {
            editorRef.current.setComponents(selected.html);
            setShowTemplateModal(false);
        }
    };

    const handleSave = async () => {
        if (!editorRef.current) return;
        setSaving(true);

        const html = editorRef.current.getHtml();
        const css = editorRef.current.getCss() || '';

        try {
            // Obtain CSRF token from document meta if available
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

            const response = await fetch(`/funnels/${funnel.id}/steps/${step.id}/builder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ html, css }),
            });

            if (response.ok) {
                setSaving(false);
                setSavedNotice(true);
                setTimeout(() => setSavedNotice(false), 3000);
            } else {
                setSaving(false);
                alert('Save encountered an error. Please try again.');
            }
        } catch {
            setSaving(false);
            alert('Network error while saving. Please check your connection.');
        }
    };

    return (
        <div className="h-screen flex flex-col dark:bg-[#090d16] bg-slate-100 text-slate-100 antialiased overflow-hidden select-none">
            <Head title={`GrapesJS Builder - ${step.name}`} />

            {/* Top GrapesJS Builder Control Toolbar */}
            <header className="h-14 border-b dark:border-slate-800 border-slate-300 dark:bg-[#0b1120] bg-white px-4 flex items-center justify-between flex-shrink-0 z-30 shadow-sm transition-colors">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/funnels/${funnel.id}`}
                        className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 hover:scale-105 transition"
                        title="Back to Funnel Overview"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm dark:text-white text-slate-900">
                                {step.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20 uppercase">
                                GrapesJS Visual Builder
                            </span>
                        </div>
                        <span className="text-[11px] dark:text-slate-400 text-slate-500 font-mono">
                            {step.path}
                        </span>
                    </div>
                </div>

                {/* Device Manager (Desktop, Tablet, Mobile) */}
                <div className="flex items-center gap-1 p-1 rounded-sm dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-300">
                    <button
                        type="button"
                        onClick={() => setDeviceMode('desktop')}
                        className={`p-1.5 rounded-sm text-xs font-semibold flex items-center gap-1 transition ${
                            device === 'desktop'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'dark:text-slate-400 text-slate-600 hover:text-white'
                        }`}
                        title="Desktop View (Full Width)"
                    >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Desktop</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeviceMode('tablet')}
                        className={`p-1.5 rounded-sm text-xs font-semibold flex items-center gap-1 transition ${
                            device === 'tablet'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'dark:text-slate-400 text-slate-600 hover:text-white'
                        }`}
                        title="Tablet View (768px)"
                    >
                        <Tablet className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Tablet</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeviceMode('mobile')}
                        className={`p-1.5 rounded-sm text-xs font-semibold flex items-center gap-1 transition ${
                            device === 'mobile'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'dark:text-slate-400 text-slate-600 hover:text-white'
                        }`}
                        title="Mobile View (375px)"
                    >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Mobile</span>
                    </button>
                </div>

                {/* Center / Right: Builder Actions */}
                <div className="flex items-center gap-1.5">
                    {/* Templates Button */}
                    <button
                        type="button"
                        onClick={() => setShowTemplateModal(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition"
                        title="Choose Ready-Made Funnel Template"
                    >
                        <LayoutTemplate className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="hidden md:inline">Templates</span>
                    </button>

                    {/* Preview Button */}
                    <button
                        type="button"
                        onClick={togglePreview}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border text-xs font-semibold transition ${
                            isPreview
                                ? 'bg-amber-500 text-slate-900 border-amber-600 shadow-sm'
                                : 'dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title={isPreview ? 'Exit Preview' : 'Preview Page (No Guidelines)'}
                    >
                        {isPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span className="hidden md:inline">{isPreview ? 'Exit Preview' : 'Preview'}</span>
                    </button>

                    {/* View Code Button */}
                    <button
                        type="button"
                        onClick={handleOpenCode}
                        className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        title="View / Export HTML & CSS Code"
                    >
                        <Code className="w-3.5 h-3.5" />
                    </button>

                    {/* Clear Canvas */}
                    <button
                        type="button"
                        onClick={handleClearCanvas}
                        className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-rose-400 text-rose-600 hover:bg-rose-500/10 transition"
                        title="Clear Canvas"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Undo / Redo */}
                    <button
                        type="button"
                        onClick={() => editorRef.current?.runCommand('core:undo')}
                        className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        title="Undo"
                    >
                        <Undo className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editorRef.current?.runCommand('core:redo')}
                        className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                        title="Redo"
                    >
                        <Redo className="w-3.5 h-3.5" />
                    </button>

                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-100 dark:text-amber-400 text-slate-700 transition"
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                    </button>

                    {/* Save Button */}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition ml-1"
                    >
                        {savedNotice ? (
                            <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                                <span>Saved!</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                <span>{saving ? 'Saving...' : 'Save Page'}</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Editor Work Area: Left Sidebar (Blocks & Styles) + Canvas */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Drag & Drop Tooling Palette */}
                <div className="w-80 flex-shrink-0 border-r dark:border-slate-800 border-slate-300 dark:bg-[#0a0f1d] bg-white flex flex-col transition-colors z-20">
                    {/* Tabs */}
                    <div className="flex border-b dark:border-slate-800 border-slate-300">
                        <button
                            type="button"
                            onClick={() => setActiveTab('blocks')}
                            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${
                                activeTab === 'blocks'
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:bg-slate-900/50 bg-slate-50'
                                    : 'border-transparent dark:text-slate-400 text-slate-600 hover:text-white'
                            }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Drag Blocks</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('styles')}
                            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition ${
                                activeTab === 'styles'
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:bg-slate-900/50 bg-slate-50'
                                    : 'border-transparent dark:text-slate-400 text-slate-600 hover:text-white'
                            }`}
                        >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Style Manager</span>
                        </button>
                    </div>

                    {/* Blocks Palette Container */}
                    <div className={`flex-1 p-3 overflow-y-auto ${activeTab === 'blocks' ? 'block' : 'hidden'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] dark:text-slate-400 text-slate-500 font-semibold">
                                Drag components onto the page:
                            </span>
                            <span className="text-[10px] text-indigo-500 font-bold">11+ Blocks</span>
                        </div>
                        <div id="gjs-blocks" className="space-y-2"></div>
                    </div>

                    {/* Styles Manager Container */}
                    <div className={`flex-1 p-3 overflow-y-auto ${activeTab === 'styles' ? 'block' : 'hidden'}`}>
                        <div className="text-[11px] dark:text-slate-400 text-slate-500 mb-2 font-semibold">
                            Select any element on the canvas to inspect & edit styles:
                        </div>
                        <div id="gjs-styles" className="space-y-2"></div>
                    </div>
                </div>

                {/* Center Canvas Area */}
                <div className="flex-1 dark:bg-[#070a12] bg-slate-200 relative overflow-hidden flex items-center justify-center">
                    <div
                        id="gjs-canvas"
                        className="w-full h-full"
                    ></div>
                </div>
            </div>

            {/* Template Selector Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="dark:bg-[#0f172a] bg-white border dark:border-slate-800 border-slate-300 rounded-md max-w-xl w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4 border-b dark:border-slate-800 border-slate-200 pb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-indigo-500" />
                                <h3 className="font-bold text-base dark:text-white text-slate-900">
                                    Choose Funnel Starter Template
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTemplateModal(false)}
                                className="dark:text-slate-400 text-slate-600 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs dark:text-slate-400 text-slate-600 mb-4">
                            Select a high-converting agency template to populate your canvas immediately:
                        </p>

                        <div className="space-y-3 mb-6">
                            {Object.entries(TEMPLATES).map(([key, tpl]) => (
                                <div
                                    key={key}
                                    onClick={() => handleLoadTemplate(key)}
                                    className="p-3.5 rounded-sm border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-slate-50 hover:border-indigo-500 dark:hover:bg-indigo-950/20 cursor-pointer transition flex items-center justify-between group"
                                >
                                    <div>
                                        <div className="text-sm font-bold dark:text-white text-slate-900 group-hover:text-indigo-400 transition">
                                            {tpl.name}
                                        </div>
                                        <div className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
                                            {tpl.desc}
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition">
                                        Load →
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowTemplateModal(false)}
                                className="px-4 py-2 text-xs font-semibold rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View / Export Code Modal */}
            {showCodeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="dark:bg-[#0f172a] bg-white border dark:border-slate-800 border-slate-300 rounded-md max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between mb-4 border-b dark:border-slate-800 border-slate-200 pb-3">
                            <div className="flex items-center gap-2">
                                <Code className="w-5 h-5 text-indigo-500" />
                                <h3 className="font-bold text-base dark:text-white text-slate-900">
                                    Export Funnel Page Code
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCodeModal(false)}
                                className="dark:text-slate-400 text-slate-600 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs dark:text-slate-400 text-slate-600 mb-2">
                            Clean HTML and CSS generated by GrapesJS:
                        </p>

                        <div className="flex-1 overflow-y-auto dark:bg-[#070a12] bg-slate-900 p-3 rounded-sm font-mono text-xs text-emerald-400 border dark:border-slate-800 border-slate-700 mb-4 whitespace-pre-wrap select-text max-h-96">
                            {codeOutput.css ? `<style>\n${codeOutput.css}\n</style>\n\n` : ''}
                            {codeOutput.html}
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-emerald-300" />
                                        <span>Copied to Clipboard!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copy Full HTML/CSS</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowCodeModal(false)}
                                className="px-4 py-2 text-xs font-semibold rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
