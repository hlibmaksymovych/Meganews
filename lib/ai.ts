interface AnalysisResult {
  clickbait: number;
  serious: number;
  emotion: 'neutral' | 'fearful' | 'happy' | 'sad' | 'angry';
  reason: string;
  highlights: string[];
  triggers: string[];
}

interface HFMessage {
  role: 'system' | 'user';
  content: string;
}

interface HFChoice {
  message: {
    content: string;
  };
}

interface HFResponse {
  choices: HFChoice[];
}

export async function checkWithAI(text: string, url?: string): Promise<AnalysisResult> {
  // First try local analysis as it's faster and more reliable
  const localResult = analyzeLocal(text);
  
  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "microsoft/Phi-3-mini-128k-instruct",
        messages: [
          {
            role: "system",
            content: `You are a news analyzer. Return JSON only: {"clickbait":0-100,"serious":100-value,"emotion":"neutral","reason":"brief","highlights":[],"triggers":[]}

Rules:
- clickbait + serious = 100
- betting/money on war = 90-100
- fake news/myths = 80-100
- factual news = 0-30
- NO other text`
          },
          {
            role: "user",
            content: text
          }
        ] as HFMessage[],
        temperature: 0.3,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`HF API error: ${response.status} - ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as HFResponse;
    const content = data.choices[0].message.content;

    console.log("AI Response:", content);

    return parseAIResponse(content, text);

  } catch (error) {
    console.warn("AI failed, using fallback:", (error as Error).message);
    return localResult;
  }
}

function parseAIResponse(content: string | null, originalText: string): AnalysisResult {
  // STRENGSTE VALIDIERUNG - ALLES WIRD GEPRUEFT UND KORRIGIERT
  try {
    // Handle null/empty responses
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      console.warn("Empty response, using fallback");
      return analyzeLocal(originalText);
    }

    console.log("AI Response:", content);

    let cleaned = content.trim();

    // ENTFERNE MARKDOWN UND ALLES NICHT-JSON
    // Remove markdown code blocks completely
    cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    // Try to find JSON object - look for first { and last }
    let jsonStart = cleaned.indexOf("{");
    let jsonEnd = cleaned.lastIndexOf("}");
    
    // If no braces found, try to find partial JSON
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
      // Try to find any clickbait-like pattern
      const clickbaitMatch = cleaned.match(/"clickbait"\s*:\s*(\d+)/);
      const seriousMatch = cleaned.match(/"serious"\s*:\s*(\d+)/);
      const emotionMatch = cleaned.match(/"emotion"\s*:\s*"(\w+)"/);
      const reasonMatch = cleaned.match(/"reason"\s*:\s*"([^"]+)"/);
      const highlightsMatch = cleaned.match(/"highlights"\s*:\s*\[([^\]]+)\]/);
      const triggersMatch = cleaned.match(/"triggers"\s*:\s*\[([^\]]+)\]/);
      
      // If we found at least clickbait, build a response
      if (clickbaitMatch) {
        console.log("Building from partial JSON match");
        const clickbait = Math.max(0, Math.min(100, parseInt(clickbaitMatch[1]) || 50));
        const serious = 100 - clickbait;
        const emotion = emotionMatch && ['neutral', 'fearful', 'happy', 'sad', 'angry'].includes(emotionMatch[1]) 
          ? emotionMatch[1] as AnalysisResult['emotion'] 
          : 'neutral';
        const reason = reasonMatch ? reasonMatch[1] : "Analyse abgeschlossen";
        
        // Parse arrays
        let highlights: string[] = [];
        if (highlightsMatch) {
          highlights = highlightsMatch[1].split(",").map(s => s.replace(/"/g, "").trim()).filter(s => s);
        }
        let triggers: string[] = [];
        if (triggersMatch) {
          triggers = triggersMatch[1].split(",").map(s => s.replace(/"/g, "").trim()).filter(s => s);
        }
        
        return {
          clickbait,
          serious,
          emotion,
          reason,
          highlights: highlights.slice(0, 3),
          triggers: triggers.slice(0, 5)
        };
      }
      
      console.warn("No valid JSON found, using fallback");
      return analyzeLocal(originalText);
    }
    
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

    // PARSE JSON
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      // JSON might be truncated - try to fix it
      console.warn("JSON parse error, attempting to fix:", e);
      
      // Try adding missing parts
      const fixed = tryFixJSON(cleaned);
      if (fixed) {
        try {
          parsed = JSON.parse(fixed);
        } catch {
          console.warn("Could not fix JSON, using fallback");
          return analyzeLocal(originalText);
        }
      } else {
        return analyzeLocal(originalText);
      }
    }

    // STRIKTE FELDER-PRUEFUNG
    
    // clickbait: Muss Zahl 0-100 sein
    let clickbait = 50;
    if (typeof parsed.clickbait === "number" && !isNaN(parsed.clickbait)) {
      clickbait = Math.round(parsed.clickbait);
    }
    clickbait = Math.max(0, Math.min(100, clickbait));

    // serious: IMMER 100 - clickbait
    let serious = 100 - clickbait;

    // emotion: Optional - default to neutral
    const validEmotions = ['neutral', 'fearful', 'happy', 'sad', 'angry'];
    let emotion: AnalysisResult['emotion'] = 'neutral';
    if (typeof parsed.emotion === "string" && validEmotions.includes(parsed.emotion)) {
      emotion = parsed.emotion as AnalysisResult['emotion'];
    }

    // reason: String auf Deutsch, nicht leer
    let reason = "Analyse abgeschlossen";
    if (typeof parsed.reason === "string" && parsed.reason.trim().length > 0) {
      reason = parsed.reason.trim();
      // Kuerze auf maximal 20 Woerter
      const words = reason.split(/\s+/);
      if (words.length > 20) {
        reason = words.slice(0, 20).join(" ") + "...";
      }
    }

    // highlights: Array von Strings
    let highlights: string[] = [];
    if (Array.isArray(parsed.highlights)) {
      highlights = parsed.highlights
        .filter((h): h is string => typeof h === "string" && h.length > 0)
        .slice(0, 3);
    }

    // triggers: Array von Strings
    let triggers: string[] = [];
    if (Array.isArray(parsed.triggers)) {
      triggers = parsed.triggers
        .filter((t): t is string => typeof t === "string" && t.length > 0)
        .slice(0, 5);
    }

    // FINALE VALIDIERUNG
    const result: AnalysisResult = {
      clickbait: Math.max(0, Math.min(100, Math.round(clickbait))),
      serious: Math.max(0, Math.min(100, Math.round(serious))),
      emotion,
      reason,
      highlights,
      triggers
    };

    // Nochmal garantieren dass Summe 100 ist
    if (result.clickbait + result.serious !== 100) {
      result.serious = 100 - result.clickbait;
    }

    console.log("Parsed result:", result);
    return result;

  } catch (error) {
    console.warn("Critical parse error, using fallback:", error);
    return analyzeLocal(originalText);
  }
}

// Hilfsfunktion um truncated JSON zu reparieren
function tryFixJSON(input: string): string | null {
  try {
    let fixed = input;
    
    // Check if missing closing brace
    if (!fixed.endsWith("}")) {
      fixed = fixed + "}";
    }
    
    // Check if missing quotes around values
    // Fix missing quotes in emotion
    fixed = fixed.replace(/"emotion"\s*:\s*(\w+)/g, '"emotion": "$1"');
    
    // Try to parse
    JSON.parse(fixed);
    return fixed;
  } catch {
    return null;
  }
}

interface Pattern {
  p: RegExp;
  w: number;
  n: string;
}

function analyzeLocal(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  let clickbait = 0;
  let serious = 0;
  let highlights: string[] = [];

  // Clickbait patterns
  const clickbaitPatterns: Pattern[] = [
    { p: /[!]{2,}/, w: 15, n: "Mehrfache Ausrufezeichen" },
    { p: /(unglaublich|schockierend|sensationell|geheim)/i, w: 25, n: "Sensationswörter" },
    { p: /(ärzte hassen|dieser trick|ohne grund)/i, w: 30, n: "Manipulative Phrasen" },
    { p: /(\d+.*trick|\d+.*grund)/i, w: 20, n: "Listicle-Stil" },
    { p: /(wett|gewinn|betting|wins \$)/i, w: 35, n: "Glücksspiel/Wetten" },
    { p: /(melone|kern|baum im bauch)/i, w: 40, n: "Mythen/Falschaussagen" },
    { p: /(behauptet|fake|gefälscht|propaganda)/i, w: 25, n: "Falschinformation" },
    { p: /(trump|erdogan|putin|iran|bomb)/i, w: 20, n: "Politische Trigger" }
  ];

  // Serious news patterns
  const seriousPatterns: Pattern[] = [
    { p: /(studie|forschung|wissenschaft|experte)/i, w: 25, n: "Fachbegriffe" },
    { p: /(laut|berichten|belegen|schätzungen)/i, w: 20, n: "Quellenhinweise" },
    { p: /(prozent|millionen|jahr|jubiläum)/i, w: 15, n: "Konkrete Daten" },
    { p: /(universität|institut|museum|parlament)/i, w: 20, n: "Institutionen" },
    { p: /(wiedereröffnet|gedachte|schweigeminute)/i, w: 20, n: "Förmliche Ereignisse" },
    { p: /(escalation|sperrung|flughäfen|konflikt)/i, w: 15, n: "Nachrichten-Terminologie" },
    { p: /(song contest|gewonnen|treten an)/i, w: 10, n: "Kulturevents" }
  ];

  clickbaitPatterns.forEach(m => {
    if (m.p.test(lower)) {
      clickbait += m.w;
      highlights.push(m.n);
    }
  });

  seriousPatterns.forEach(m => {
    if (m.p.test(lower)) {
      serious += m.w;
    }
  });

  if (clickbait + serious > 0) {
    const total = clickbait + serious;
    clickbait = Math.round((clickbait / total) * 100);
    serious = 100 - clickbait;
  } else {
    clickbait = 50;
    serious = 50;
  }

  // Emotion detection
  let emotion: AnalysisResult['emotion'] = 'neutral';
  
  // Fearful indicators
  if (/(unglück|tragisch|tote|krieg|angriff|bomb|missbrauch|gefährlich|blockiert)/i.test(lower)) {
    emotion = 'fearful';
  }
  // Happy indicators
  else if (/(gewonnen|jubiläum|song contest|eröffnet)/i.test(lower) && !/(unglück|tragisch)/i.test(lower)) {
    emotion = 'happy';
  }
  // Angry indicators
  else if (/(propaganda|gefälscht|hass)/i.test(lower)) {
    emotion = 'angry';
  }

  return {
    clickbait,
    serious,
    emotion,
    reason: "Lokale Analyse (KI nicht verfügbar)",
    highlights: highlights.slice(0, 3),
    triggers: []
  };
}
