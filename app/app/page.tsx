'use client';

import React, { useState, useEffect } from 'react';
import { analyzeText } from '../actions/analyze';

interface AnalysisResult {
  clickbait: number;
  serious: number;
  reason: string;
  highlights: string[];
  triggers: string[];
}

interface HistoryItem {
  input: string;
  result: AnalysisResult;
}

export default function Home(): React.ReactElement {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved === 'dark' || (!saved && prefersDark) ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const analyze = async () => {
    if (!text && !url) {
      setError('Bitte Text oder URL eingeben.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Use Server Action instead of API route
      const data: AnalysisResult = await analyzeText(text, url || undefined);
      setResult(data);
      setHistory(prev => [{ input: text || url, result: data }, ...prev].slice(0, 10));
      setText('');
      setUrl('');
    } catch (err) {
      setError('Analyse fehlgeschlagen: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-color: #fafafa;
          --text-color: #111;
          --panel-bg: rgba(255, 255, 255, 0.85);
          --border-color: #ddd;
          --accent: #0077cc;
          --warning: #f0ad4e;
          --error: #d9534f;
          --success: #5cb85c;
        }
        .dark-mode {
          --bg-color: #121212;
          --text-color: #e0e0e0;
          --panel-bg: rgba(30, 30, 30, 0.85);
          --border-color: #333;
          --accent: #3399ff;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          min-height: 100vh;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          line-height: 1.5;
          background-image: url('/style/1.svg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          z-index: -1;
        }
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: var(--panel-bg);
          border-bottom: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
        }
        .logo h1 { font-size: 1.5rem; font-weight: 600; color: var(--accent); }
        #theme-toggle {
          background: transparent;
          border: 1px solid var(--border-color);
          padding: 0.375rem 0.5rem;
          font-size: 1.05rem;
          border-radius: 6px;
          cursor: pointer;
        }
        main { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .intro { text-align: center; margin-bottom: 2rem; }
        .analyzer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .analyzer textarea, .analyzer input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background-color: var(--panel-bg);
          color: var(--text-color);
          font-size: 1rem;
        }
        .analyzer textarea { min-height: 120px; resize: vertical; }
        .button-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          justify-content: flex-end;
        }
        .analyzer button {
          padding: 1rem 2.5rem;
          background: linear-gradient(90deg, #00C4CC, #7D2AE8);
          border: none;
          border-radius: 50px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          font-size: 1.1rem;
        }
        .analyzer button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 196, 204, 0.3);
        }
        .analyzer button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: linear-gradient(90deg, #666, #888);
        }
        .spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .results {
          background-color: var(--panel-bg);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        .scale-container {
          position: relative;
          height: 1.5rem;
          background-color: var(--border-color);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 1rem;
          display: flex;
        }
        .segment {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
          transition: width 0.8s ease-out;
        }
        .segment.clickbait { background-color: var(--error); }
        .segment.serious { background-color: var(--success); }
        .traffic-light {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .light {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background-color: var(--border-color);
        }
        .light.red.active { background-color: var(--error); }
        .light.yellow.active { background-color: var(--warning); }
        .light.green.active { background-color: var(--success); }
        .error { color: var(--error); font-weight: 600; text-align: center; }
        .history { background-color: var(--panel-bg); border: 1px solid var(--border-color); border-radius: 4px; padding: 1rem; backdrop-filter: blur(10px); }
        .history h3 { margin-bottom: 1rem; }
        .history ul { list-style: none; }
        .history li { padding: 0.5rem 0; border-bottom: 1px solid var(--border-color); }
        .examples { margin-top: 1rem; font-size: 0.9rem; }
        .examples ul { margin-left: 1.5rem; margin-top: 0.5rem; }
        footer { text-align: center; padding: 2rem; border-top: 1px solid var(--border-color); margin-top: 2rem; }
      `}</style>

      <header className="main-header">
        <div className="logo"><h1>Meganews</h1></div>
        <nav>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none', marginRight: '1rem' }}>Startseite</a>
          <button id="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </header>

      <main>
        <section className="intro">
          <h2>Wie funktioniert Meganews?</h2>
          <p>Gib eine Schlagzeile, einen Text oder eine URL ein. Unsere KI prüft die Informationen 
             sehr gründlich und liefert danach ein Ergebnis.</p>
        </section>

        <section className="analyzer">
          <textarea 
            placeholder="Schlagzeile oder Text hier einfügen..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); analyze(); } }}
          />
          <input 
            type="text" 
            placeholder="Optional: URL einfügen"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); analyze(); } }}
          />
          <div className="button-group">
            <button onClick={analyze} disabled={loading}>
              {loading ? 'Analysiert...' : 'Jetzt analysieren'}
            </button>
            {loading && <div className="spinner" />}
          </div>
          
          <div className="examples">
            <p><strong>Beispiele:</strong></p>
            <ul>
              <li>"Unglaubliche Entdeckung: Forscher finden Heilung für Krebs!"</li>
              <li>"Studie zeigt: Tägliches Spazieren reduziert Risiko für Herzkrankheiten"</li>
            </ul>
          </div>
        </section>

        {error && <p className="error">{error}</p>}

        {result && (
          <section className="results">
            <div className="scale-container">
              <div className="segment clickbait" style={{width: result.clickbait + '%'}}>
                {result.clickbait > 10 && `Clickbait ${result.clickbait}%`}
              </div>
              <div className="segment serious" style={{width: result.serious + '%'}}>
                {result.serious > 10 && `Seriös ${result.serious}%`}
              </div>
            </div>
            
            <div className="traffic-light">
              <div className={`light red ${result.clickbait > result.serious ? 'active' : ''}`} />
              <div className={`light yellow ${result.clickbait === result.serious ? 'active' : ''}`} />
              <div className={`light green ${result.clickbait < result.serious ? 'active' : ''}`} />
            </div>
            
            {result.clickbait >= 95 && (
              <p style={{
                background: 'linear-gradient(90deg, #ff4444, #ff6666)',
                color: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>
                🚨 {result.clickbait}%iger Clickbait! 🚨
              </p>
            )}
            
            {result.serious >= 95 && (
              <p style={{
                background: 'linear-gradient(90deg, #00C4CC, #5cb85c)',
                color: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '1.2rem',
                marginBottom: '1rem'
              }}>
                ✅ {result.serious}% Seriös! ✅
              </p>
            )}
            
            <p><strong>Begründung:</strong> {result.reason}</p>
            
            {result.highlights.length > 0 && (
              <p style={{marginTop: '0.5rem'}}>
                <strong>Mögliche Übertreibungen:</strong> {result.highlights.join(', ')}
              </p>
            )}
            
          </section>
        )}

        {history.length > 0 && (
          <section className="history">
            <h3>Letzte Analysen</h3>
            <ul>
              {history.map((item, i) => (
                <li key={i}>
                  {item.input.substring(0, 50)}... 
                  — Clickbait {item.result.clickbait}% / Seriös {item.result.serious}%
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2026 Meganews</p>
      </footer>
    </>
  );
}
