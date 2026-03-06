'use server';

import { checkWithAI } from '../../lib/ai';

interface AnalysisResult {
  clickbait: number;
  serious: number;
  emotion: 'neutral' | 'fearful' | 'happy' | 'sad' | 'angry';
  reason: string;
  highlights: string[];
  triggers: string[];
}

async function fetchUrlContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
    });
    if (!response.ok) return null;

    const text = await response.text();
    const cleaned = text
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned.substring(0, 5000);
  } catch (e) {
    console.warn('URL-Fetch fehlgeschlagen:', url, (e as Error).message);
    return null;
  }
}

async function analyzeTextServer(text: string, url?: string): Promise<AnalysisResult> {
  let contentToAnalyze = text;

  if (url && !contentToAnalyze) {
    contentToAnalyze = await fetchUrlContent(url) || '';
    if (!contentToAnalyze) {
      return {
        clickbait: 0,
        serious: 0,
        emotion: 'neutral',
        reason: 'URL konnte nicht geladen werden.',
        highlights: [],
        triggers: []
      };
    }
  }

  try {
    return await checkWithAI(contentToAnalyze, url);
  } catch (e) {
    console.warn('KI-Aufruf fehlgeschlagen, benutze Fallback:', (e as Error).message);
  }

  // Fallback
  const lower = (contentToAnalyze || '').toLowerCase();
  let click = 0;
  let serious = 0;
  const reasons: string[] = [];
  const highlights: string[] = [];
  const triggers: string[] = [];

  if (lower.includes("!")) {
    click += 20;
    highlights.push("Ausrufezeichen");
  }
  if (lower.match(/(unglaublich|schockierend|geheim)/i)) {
    click += 30;
    reasons.push("Übertriebene Wortwahl erkannt.");
  }
  if (lower.match(/(studie|expert|berichten)/i)) {
    serious += 25;
    reasons.push("Faktenbegriffe gefunden.");
  }

  click = Math.min(100, click);
  serious = Math.min(100, serious);
  if (click + serious > 100) {
    const total = click + serious;
    click = Math.round((click / total) * 100);
    serious = 100 - click;
  }

  const reasonText = reasons.join(" ") || "Keine spezifischen Muster erkannt.";

  return {
    clickbait: click,
    serious: serious,
    emotion: 'neutral',
    reason: reasonText,
    highlights: highlights,
    triggers: triggers
  };
}

export async function analyzeText(text: string, url?: string): Promise<AnalysisResult> {
  if (!text && !url) {
    throw new Error('text oder url erforderlich');
  }
  return analyzeTextServer(text || url || '', url);
}
