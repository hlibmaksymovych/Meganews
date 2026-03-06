import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Wahrhet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #151514;
          color: #f8f3f1;
          min-height: 100vh;
          overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        nav {
          background: rgba(21, 21, 20, 0.95);
          padding: 1rem;
          border-bottom: 1px solid #333;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }
        nav ul {
          list-style: none;
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scrollbar-width: none;
        }
        nav ul::-webkit-scrollbar { display: none; }
        nav a {
          color: #fff;
          text-decoration: none;
          font-size: 0.9rem;
          white-space: nowrap;
          opacity: 0.8;
          transition: opacity 0.2s;
          cursor: pointer;
        }
        nav a:hover { opacity: 1; }
        section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
        
        /* SVG Background Styles */
        .bg-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          opacity: 0.6;
        }
        .bg-svg-contain {
          background-size: contain;
        }
        
        /* Page 1 - Hero with SVG 1 */
        .seite1 .bg-svg {
          background-image: url('/style/1.svg');
          opacity: 0.4;
        }
        
        /* Page 2 - Features with SVG 6 */
        .seite2 .bg-svg {
          background-image: url('/style/6.svg');
          background-position: right center;
          background-size: 50% auto;
          opacity: 0.3;
        }
        
        /* Page 3 - Updates with SVG 7 */
        .seite3 .bg-svg {
          background-image: url('/style/7.svg');
          opacity: 0.25;
        }
        
        /* Page 4 - About with SVG 8 */
        .seite4 .bg-svg {
          background-image: url('/style/8.svg');
          background-position: left center;
          background-size: 40% auto;
          opacity: 0.2;
        }
        
        /* Page 5 - Future with SVG 9 */
        .seite5 .bg-svg {
          background-image: url('/style/9.svg');
          opacity: 0.25;
        }
        
        /* Page 6 - Stats with SVG 4 */
        .seite6 .bg-svg {
          background-image: url('/style/4.svg');
          opacity: 0.15;
        }
        
        /* Page 7 - Team with SVG 5 */
        .seite7 .bg-svg {
          background-image: url('/style/5.svg');
          background-position: top right;
          background-size: 60% auto;
          opacity: 0.2;
        }
        
        .content {
          position: relative;
          z-index: 1;
        }
        
        .hero {
          text-align: center;
          max-width: 900px;
        }
        h1 {
          font-size: clamp(3rem, 12vw, 9rem);
          text-transform: uppercase;
          line-height: 0.9;
          margin-bottom: 0.5rem;
          color: #f8f3f1;
          font-weight: 400;
          letter-spacing: -0.03em;
          text-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }
        .subtitle {
          font-size: clamp(1.5rem, 6vw, 5rem);
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 2rem;
          color: #f8f3f1;
          letter-spacing: -0.03em;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }
        .description {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 2rem;
          color: #ccc;
          text-shadow: 0 1px 10px rgba(0,0,0,0.5);
        }
        .cta-button {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: linear-gradient(90deg, #00C4CC, #7D2AE8);
          color: #fff;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          z-index: 2;
          cursor: pointer;
          border: none;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 196, 204, 0.3);
        }
        .page-2 {
          background: #151514;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }
        .page-2 .left-content h2 {
          font-size: clamp(2rem, 5vw, 4rem);
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 1.5rem;
          color: #f8f3f1;
          letter-spacing: -0.03em;
        }
        .page-2 .left-content p {
          font-size: 1rem;
          line-height: 1.7;
          color: #ccc;
          max-width: 500px;
        }
        .page-2 .right-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .feature-item {
          font-size: clamp(1.5rem, 4vw, 3.5rem);
          text-transform: uppercase;
          color: #f8f3f1;
          letter-spacing: -0.03em;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .page-3 {
          flex-direction: column;
          text-align: center;
        }
        .page-3 h2 {
          font-size: clamp(1.5rem, 4vw, 3rem);
          text-transform: uppercase;
          margin-bottom: 2rem;
          color: #f8f3f1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .page-3 p {
          font-size: 1.1rem;
          line-height: 1.8;
          max-width: 800px;
          color: #ccc;
        }
        .page-4 {
          flex-direction: column;
        }
        .page-4 h2 {
          font-size: clamp(1.5rem, 4vw, 3rem);
          text-transform: uppercase;
          margin-bottom: 2rem;
          color: #f8f3f1;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .criteria-list {
          max-width: 900px;
          text-align: left;
          background: rgba(0,0,0,0.3);
          padding: 2rem;
          border-radius: 12px;
          backdrop-filter: blur(5px);
        }
        .criteria-list h3 {
          font-size: 1.3rem;
          color: #f8f3f1;
          margin: 2rem 0 1rem;
        }
        .criteria-list p, .criteria-list li {
          font-size: 1rem;
          line-height: 1.7;
          color: #ccc;
          margin-bottom: 0.5rem;
        }
        .criteria-list ul {
          margin-left: 2rem;
          color: #ccc;
        }
        .page-5 {
          flex-direction: column;
          text-align: center;
        }
        .page-5 h2 {
          font-size: clamp(1.5rem, 4vw, 3rem);
          text-transform: uppercase;
          margin-bottom: 2rem;
          color: #f8f3f1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .page-5 p {
          font-size: 1.1rem;
          line-height: 1.8;
          max-width: 800px;
          color: #ccc;
          background: rgba(0,0,0,0.3);
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          backdrop-filter: blur(5px);
        }
        .page-6 {
          flex-direction: column;
        }
        .page-6 h2 {
          font-size: clamp(1.5rem, 4vw, 3rem);
          text-transform: uppercase;
          margin-bottom: 3rem;
          color: #f8f3f1;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          width: 100%;
        }
        .team-member {
          text-align: center;
          background: rgba(0,0,0,0.3);
          padding: 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(5px);
          transition: transform 0.2s;
        }
        .team-member:hover {
          transform: translateY(-5px);
        }
        .team-member .avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff0000, #1500ff, #1aff00);
          border-radius: 50%;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #000000;
          box-shadow: 0 4px 15px rgba(0, 196, 204, 0.3);
        }
        .team-member h4 {
          font-size: 1.1rem;
          background: linear-gradient(90deg, #cc0000, #2f00ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #f8f3f1;
          margin-bottom: 0.3rem;
        }
        .team-member span {
          font-size: 0.9rem;
          color: #888;
        }
        .page-7 {
          flex-direction: column;
        }
        .page-7 h2 {
          font-size: clamp(1.5rem, 4vw, 3rem);
          text-transform: uppercase;
          margin-bottom: 2rem;
          color: #f8f3f1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .contact-box {
          background: rgba(255, 255, 255, 0.05);
          padding: 2rem 3rem;
          border-radius: 12px;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .contact-box p {
          font-size: 1.1rem;
          color: #ccc;
          margin-bottom: 1rem;
        }
        .contact-box a {
          color: #00C4CC;
          text-decoration: none;
          font-size: 1.2rem;
        }
        footer {
          background: rgba(0, 0, 0, 0.9);
          padding: 1rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }
        footer a {
          background: rgba(255,255,255,0.1);
          border: none;
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.85rem;
          text-decoration: none;
          transition: background 0.2s;
        }
        footer a:hover {
          background: rgba(255,255,255,0.2);
        }
        .footer-pill-primary {
          background: linear-gradient(90deg, #00C4CC, #7D2AE8) !important;
        }
        
        /* Decorative gradient overlay */
        .gradient-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to top, rgba(21,21,20,1), transparent);
          z-index: 1;
          pointer-events: none;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          text-align: center;
          max-width: 600px;
          background: rgba(0,0,0,0.3);
          padding: 2rem;
          border-radius: 12px;
          backdrop-filter: blur(5px);
        }
        .stat-value {
          font-size: 3rem;
          text-shadow: 0 0 20px;
        }
        .stat-label {
          color: #ccc;
        }
        
        @media (max-width: 768px) {
          .page-2 {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .page-2 .left-content p {
            margin: 0 auto;
          }
          section {
            padding: 6rem 1.5rem;
          }
          footer {
            position: relative;
          }
          .bg-svg {
            opacity: 0.15 !important;
            background-size: cover !important;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav>
        <ul>
          <li><a href="#seite1">Start</a></li>
          <li><a href="#seite2">Features</a></li>
          <li><a href="#seite4">Über uns</a></li>
          <li><a href="#seite5">Zukunft</a></li>
          <li><a href="#seite7">Team</a></li>
        </ul>
      </nav>

      <section id="seite1" className="seite1">
        <div className="bg-svg" />
        <div className="gradient-overlay" />
        <div className="hero content">
          <h1>Wahrhet</h1>
          <div className="subtitle">oder clickbait</div>
          <p className="description">
            Hier kannst du wissen ob es real oder fake ist.<br />
            Mit Quellenangaben und Prozentangaben.
          </p>
          <a href="/app" style={{
            display: 'inline-block',
            padding: '1rem 2.5rem',
            background: 'linear-gradient(90deg, #00C4CC, #7D2AE8)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: 600,
            fontSize: '1.1rem',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
            zIndex: 2,
            cursor: 'pointer',
            border: 'none'
          }}>Jetzt analysieren</a>
        </div>
      </section>

      <section id="seite2" className="seite2">
        <div className="bg-svg" />
        <div className="gradient-overlay" />
        <div className="content page-2">
          <div className="right-content">
            <div className="feature-item">fast</div>
            <div className="feature-item">reliable</div>
            <div className="feature-item">without money</div>
          </div>
          <div className="left-content">
            <p>Unsere Plattform überprüft, ob eine Aussage seriös oder Clickbait ist. Nutzer geben einen Satz in die Textbox ein und starten die Analyse mit Enter. Eine KI untersucht den Inhalt sprachlich und inhaltlich. Anschließend vergleicht sie die Aussage mit vertrauenswürdigen Online-Quellen. Dabei erkennt das System typische Clickbait-Muster und bewertet die Glaubwürdigkeit der Informationen. Am Ende erhalten Nutzer eine prozentuale Einschätzung zur Wahrscheinlichkeit von „wahr" oder „Clickbait". So entsteht eine schnelle und transparente Orientierungshilfe.</p>
          </div>
        </div>
      </section>

      <section id="seite3" className="seite3">
        <div className="bg-svg" />
        <div className="gradient-overlay" />
        <div className="content page-3">
          <h2>stay updated<br />know the truth</h2>
          <p>join mailing list to not miss any updates</p>
        </div>
      </section>

      <section id="seite4" className="seite4">
        <div className="bg-svg" />
        <div className="gradient-overlay" />
        <div className="content page-4">
          <h2>warum ist das uns wichtig?</h2>
          <div className="criteria-list">
            <p>Das Thema ist uns wichtig, weil sich Informationen heute schneller verbreiten als je zuvor. Falschmeldungen und Clickbait können Meinungen beeinflussen, Verunsicherung auslösen und das Vertrauen in seriöse Medien schwächen. Viele Menschen haben im Alltag nicht die Zeit, jede Aussage selbst zu überprüfen.</p>
            <p>Wir möchten dazu beitragen, Orientierung und Transparenz zu schaffen. Unser Ziel ist es, Nutzern ein einfaches Werkzeug an die Hand zu geben, mit dem sie Informationen kritisch hinterfragen können. Eine informierte Gesellschaft trifft bessere Entscheidungen. Deshalb setzen wir auf Technologie, um Faktenprüfung zugänglicher und verständlicher zu machen.</p>
          </div>
        </div>
      </section>

      <section id="seite5" className="seite5">
        <div className="bg-svg" />
        <div className="gradient-overlay" />
        <div className="content page-5">
          <h2>the future:</h2>
          <p>Unsere Plattform soll kontinuierlich weiterentwickelt werden, um die Erkennung von Clickbait und Fehlinformationen noch präziser und transparenter zu gestalten. In Zukunft planen wir, unsere KI-Modelle weiter zu optimieren und zusätzliche vertrauenswürdige Datenquellen einzubinden. Dadurch sollen Analysen schneller, genauer und nachvollziehbarer werden.</p>
          <p>Geplant ist außerdem eine Browser-Erweiterung, mit der Inhalte direkt beim Lesen überprüft werden können. Langfristig möchten wir auch eine mobile App anbieten, um Nutzern jederzeit und überall eine schnelle Faktenprüfung zu ermöglichen.</p>
          <p>Darüber hinaus arbeiten wir an erweiterten Transparenzfunktionen, die detaillierter zeigen, wie eine Bewertung zustande kommt. Unser Ziel ist es, Medienkompetenz zu stärken und einen aktiven Beitrag zu einer informierten und reflektierten Gesellschaft zu leisten.</p>
        </div>
      </section>

      <section id="seite6" className="seite6">
        <div className="bg-svg" />
        <div className="gradient-overlay" />
        <div className="content page-6">
          <h2>Einschätzung vom internet:</h2>
          <div className="stats-grid">
            <div>
              <div className="stat-value" style={{ color: '#59f74a', textShadow: '0 0 20px rgba(74,127,247,0.5)' }}>65%</div>
              <div className="stat-label">Seriöse Nachrichten</div>
            </div>
            <div>
              <div className="stat-value" style={{ color: '#ff0000', textShadow: '0 0 20px rgba(174,141,245,0.5)' }}>30%</div>
              <div className="stat-label">Clickbait-Artikel</div>
            </div>
            <div>
              <div className="stat-value" style={{ color: '#ff9100', textShadow: '0 0 20px rgba(243,184,107,0.5)' }}>5%</div>
              <div className="stat-label">Fake News</div>
            </div>
          </div>
        </div>
      </section>

      <section id="seite7" className="seite7">
        <div className="bg-svg" />
        <div className="gradient-overlay" />
        <div className="content page-6">
          <h2>Quellenangabe</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="avatar">H</div>
              <h4>Hlib</h4>
              <span>Haupt Coder</span>
            </div>
            <div className="team-member">
              <div className="avatar">E</div>
              <h4>Enes</h4>
              <span>Coder</span>
            </div>
            <div className="team-member">
              <div className="avatar">T</div>
              <h4>Thanus</h4>
              <span>Design</span>
            </div>
            <div className="team-member">
              <div className="avatar">M</div>
              <h4>Matthias, Daniel</h4>
              <span>Hilfe</span>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <a href="/app" style={{
          background: 'linear-gradient(90deg, #00ccad, #7c2ae8)',
          border: 'none',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          textDecoration: 'none'
        }}>zur App</a>
        <a href="#seite1">Start</a>
        <a href="#seite4">Über uns</a>
        <a href="#seite7">Team</a>
      </footer>
    </>
  );
};

export default LandingPage;
