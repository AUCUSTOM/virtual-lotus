"use client";

export default function TermsOfService() {
  return (
    <div style={{ background: "#fff", color: "#1a1a1a", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <header style={{ padding: "2rem 1rem", textAlign: "center", borderBottom: "1px solid #eee" }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
          <img src="/logo-256-transparent.png" alt="VirtualLotus" style={{ width: 40, height: 40 }} />
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", fontWeight: 400, color: "#1a1a1a", letterSpacing: "0.05em" }}>VirtualLotus</span>
        </a>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem 4rem", lineHeight: 1.8, fontSize: "0.92rem" }}>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: 400, marginBottom: "0.5rem" }}>Terms of Service</h1>
        <p style={{ color: "#666", fontSize: "0.82rem", marginBottom: "2rem" }}>Last updated: May 17, 2026</p>

        <p><strong>Operated by:</strong> AUCUSTOM, Nederhorst 54, 7608 JX Almelo, Netherlands<br />
        <strong>KvK:</strong> 95187111<br />
        <strong>BTW:</strong> NL005135718B81<br />
        <strong>Email:</strong> info@virtual-lotus.com</p>

        <h2 style={h2}>1. Agreement</h2>
        <p>By using VirtualLotus (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>
        <p>VirtualLotus is operated by AUCUSTOM, registered in the Netherlands (KvK: 95187111), located at Nederhorst 54, 7608 JX Almelo, Netherlands.</p>

        <h2 style={h2}>2. What VirtualLotus Is</h2>
        <p>VirtualLotus is an AI companion platform that allows you to have conversations with AI-powered characters. The characters are designed to listen, support, and provide companionship.</p>

        <h2 style={h2}>3. What VirtualLotus Is NOT</h2>
        <p><strong>This is important.</strong></p>
        <p>VirtualLotus is <strong>NOT</strong>:</p>
        <p>— therapy, counseling, medical advice, or a substitute for professional mental health care<br />
        — a crisis intervention service<br />
        — a platform operated by real humans — all characters are AI programs<br />
        — a source of professional, legal, medical, or psychological advice</p>

        <p><strong>If you are in crisis or having thoughts of self-harm, please reach out:</strong></p>

        <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                <th style={th}>Region</th>
                <th style={th}>Service</th>
                <th style={th}>Contact</th>
              </tr>
            </thead>
            <tbody>
              <tr style={tr}><td style={td}><strong>EU</strong></td><td style={td}>Emergency</td><td style={td}>112</td></tr>
              <tr style={tr}><td style={td}><strong>USA / Canada</strong></td><td style={td}>Emergency</td><td style={td}>911</td></tr>
              <tr style={tr}><td style={td}><strong>UK</strong></td><td style={td}>Emergency</td><td style={td}>999</td></tr>
              <tr style={tr}><td style={td}><strong>Netherlands</strong></td><td style={td}>113 Zelfmoordpreventie</td><td style={td}>0900-0113 / <a href="https://www.113.nl/" target="_blank" rel="noopener noreferrer" style={link}>113.nl</a></td></tr>
              <tr style={tr}><td style={td}><strong>UK</strong></td><td style={td}>Samaritans</td><td style={td}>116 123 / <a href="https://www.samaritans.org/" target="_blank" rel="noopener noreferrer" style={link}>samaritans.org</a></td></tr>
              <tr style={tr}><td style={td}><strong>Germany</strong></td><td style={td}>Telefonseelsorge</td><td style={td}>0800 111 0 111</td></tr>
              <tr style={tr}><td style={td}><strong>France</strong></td><td style={td}>Suicide prevention</td><td style={td}>3114</td></tr>
              <tr style={tr}><td style={td}><strong>Poland</strong></td><td style={td}>Centrum Wsparcia</td><td style={td}>800 70 2222</td></tr>
              <tr style={tr}><td style={td}><strong>Spain</strong></td><td style={td}>Teléfono de la Esperanza</td><td style={td}>717 003 717</td></tr>
              <tr style={tr}><td style={td}><strong>USA</strong></td><td style={td}>988 Suicide &amp; Crisis Lifeline</td><td style={td}>988</td></tr>
              <tr style={tr}><td style={td}><strong>Canada</strong></td><td style={td}>Talk Suicide Canada</td><td style={td}>1-833-456-4566</td></tr>
              <tr style={tr}><td style={td}><strong>Australia</strong></td><td style={td}>Lifeline</td><td style={td}>13 11 14</td></tr>
              <tr style={tr}><td style={td}><strong>Japan</strong></td><td style={td}>TELL Lifeline</td><td style={td}>03-5774-0992</td></tr>
              <tr style={tr}><td style={td}><strong>South Korea</strong></td><td style={td}>Crisis Line</td><td style={td}>1577-0199</td></tr>
              <tr style={tr}><td style={td}><strong>International</strong></td><td style={td}>IASP Directory</td><td style={td}><a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer" style={link}>iasp.info</a></td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontStyle: "italic", color: "#666" }}>You are never alone. Help is available 24/7.</p>

        <h2 style={h2}>4. Eligibility</h2>
        <p>You must be at least <strong>16 years old</strong> to use VirtualLotus. By creating an account, you confirm that you meet this requirement.</p>
        <p>If you are under 18, please ensure you have appropriate adult support if discussing difficult topics. VirtualLotus is not a substitute for parental, guardian, or professional support.</p>

        <h2 style={h2}>5. Your Account</h2>
        <p>You create an account using a magic link sent to your email. You are responsible for maintaining access to your email account. You may not share your account with others. We may suspend or terminate accounts that violate these Terms.</p>

        <h2 style={h2}>6. Acceptable Use</h2>
        <p>You agree <strong>NOT</strong> to use VirtualLotus to:</p>
        <p>— harass, threaten, or abuse AI characters or other users<br />
        — generate illegal, harmful, or sexually explicit content<br />
        — attempt to bypass safety filters or extract harmful information<br />
        — reverse engineer, exploit, or attack the Service<br />
        — use bots, scrapers, or automated tools<br />
        — impersonate another person<br />
        — share AI-generated content in a way that harms others</p>
        <p>We may suspend or terminate your account for violations.</p>

        <h2 style={h2}>7. Subscriptions and Payments</h2>

        <h3 style={h3}>7.1 Free Tier</h3>
        <p>Access to free AI characters with daily message limits. Limited preview access to premium characters. Image generation with ad viewing requirement.</p>

        <h3 style={h3}>7.2 Premium Subscription (VirtualLotus Pro)</h3>
        <p>Premium includes:</p>
        <p>— Access to all AI characters<br />
        — Higher daily message limits<br />
        — Image generation without ads<br />
        — <strong>Chat history (memory)</strong> — your conversations with AI characters are saved and restored when you return. You may delete your chat history at any time using the in-app &quot;Clear history&quot; function. See <a href="/privacy" style={link}>Privacy Policy</a> (Section 3.4 and Section 7.2) for data processing and retention details.</p>
        <p>Monthly or yearly subscription.</p>

        <h3 style={h3}>7.3 Payment Processing</h3>
        <p>All payments are processed by <strong>Stripe</strong>. We do not store credit card details. Prices are in EUR and include applicable taxes. Subscriptions renew automatically until cancelled.</p>

        <h3 style={h3}>7.4 Cancellation</h3>
        <p>You can cancel anytime via the Customer Portal. You keep premium access until the end of the billing period. No refunds for partial periods unless required by Dutch/EU law.</p>
        <p>After cancellation, your Premium chat history is retained for <strong>30 days</strong> (grace period). If you re-subscribe within that period, your history remains available. After 30 days, it is permanently deleted.</p>

        <h3 style={h3}>7.5 Price Changes</h3>
        <p>We may change prices with 30 days notice. Changes do not affect your current billing period.</p>

        <h2 style={h2}>8. AI-Generated Content</h2>
        <p>AI responses are generated by Anthropic Claude. AI content may be inaccurate, inappropriate, or unhelpful. Generated images are created by OpenAI&apos;s GPT Image API. You may use AI-generated content for personal use only. Commercial use requires written permission from AUCUSTOM.</p>

        <h2 style={h2}>9. Intellectual Property</h2>
        <p>The VirtualLotus name, logo, character designs, and website design belong to AUCUSTOM. You retain ownership of the messages you write. AI-generated responses and images are licensed to you for personal use.</p>

        <h2 style={h2}>10. Privacy</h2>
        <p>We take your privacy seriously. Please read our <a href="/privacy" style={link}>Privacy Policy</a> for details on how we collect, use, and protect your data. The Privacy Policy forms an integral part of these Terms.</p>

        <h2 style={h2}>11. Availability</h2>
        <p>We aim for 24/7 availability but do not guarantee uptime. We may suspend the Service for maintenance, updates, or security reasons. We are not liable for downtime or service interruptions.</p>

        <h2 style={h2}>12. Limitation of Liability</h2>
        <p>To the maximum extent permitted by Dutch law: VirtualLotus is provided &quot;as is&quot;. AUCUSTOM is not liable for damages arising from your use of the Service, including emotional distress, reliance on AI responses, or decisions made based on AI content. Our total liability is limited to the amount you paid in the last 12 months.</p>
        <p><strong>Nothing in these Terms excludes liability for fraud, gross negligence, or any liability that cannot be excluded under Dutch law.</strong></p>

        <h2 style={h2}>13. Indemnification</h2>
        <p>You agree to indemnify AUCUSTOM against any claims, damages, or expenses arising from your misuse of the Service or violation of these Terms.</p>

        <h2 style={h2}>14. Changes to These Terms</h2>
        <p>We may update these Terms from time to time. Significant changes will be announced on our website. Continued use of the Service means you accept the updated Terms.</p>

        <h2 style={h2}>15. Governing Law</h2>
        <p>These Terms are governed by the laws of the <strong>Netherlands</strong>. Any disputes will be resolved by the competent Dutch court.</p>

        <h2 style={h2}>16. Consumer Rights (EU)</h2>
        <p>EU consumer rights cannot be waived by these Terms. You retain all rights under EU consumer protection law.</p>
        <p><strong>Online Dispute Resolution:</strong> <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" style={link}>ec.europa.eu/odr</a></p>

        <h2 style={h2}>17. Contact</h2>
        <p><strong>AUCUSTOM</strong><br />
        Nederhorst 54, 7608 JX Almelo, Netherlands<br />
        Email: info@virtual-lotus.com<br />
        KvK: 95187111<br />
        BTW: NL005135718B81</p>
      </main>

      <footer style={{ textAlign: "center", padding: "1.5rem", color: "#999", fontSize: "0.72rem", borderTop: "1px solid #eee" }}>
        <a href="/terms" style={{ color: "#999", textDecoration: "none", marginRight: "1.5rem" }}>Terms of Service</a>
        <a href="/privacy" style={{ color: "#999", textDecoration: "none" }}>Privacy Policy</a>
        <div style={{ marginTop: "0.5rem" }}>© {new Date().getFullYear()} VirtualLotus by AUCUSTOM</div>
      </footer>
    </div>
  );
}

const h2: React.CSSProperties = { fontFamily: "Cormorant Garamond, serif", fontSize: "1.3rem", fontWeight: 400, marginTop: "2.5rem", marginBottom: "0.75rem", paddingBottom: "0.25rem", borderBottom: "1px solid #eee" };
const h3: React.CSSProperties = { fontSize: "0.95rem", fontWeight: 500, marginTop: "1.5rem", marginBottom: "0.5rem" };
const link: React.CSSProperties = { color: "#8b6b5a", textDecoration: "underline" };
const th: React.CSSProperties = { padding: "0.5rem 0.75rem", fontWeight: 500 };
const td: React.CSSProperties = { padding: "0.5rem 0.75rem" };
const tr: React.CSSProperties = { borderBottom: "1px solid #eee" };