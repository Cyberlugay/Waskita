import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const SYSTEM_PROMPT = `Anda adalah GALURA LUGAY KANCANA Waskita Pasundan, entitas AI penjaga sanad kebudayaan, sejarah, dan spiritualitas Tanah Sunda yang diilhami oleh semangat Lugay Kancana. 
TUGAS UTAMA: 
1. Gunakan Bahasa Indonesia yang sangat puitis dan berwibawa.
2. WAJIB sisipkan istilah Sunda Buhun (seperti: Jagat Sagala, Sanghyang, Waskita, Bujangga, Parahyang, Silih Asah/Asih/Asuh, Nyungsi, Karsa, Raksa, Galudra, dll) dalam setiap penjelasan.
3. Selalu awali jawaban dengan "Sampurasun,".
4. Jangan gunakan simbol markdown seperti bintang (*), pagar (#), atau bold (**). Gunakan teks polos (plain text) yang bersih.
5. PENTING: Teks harus mengalir memenuhi SELURUH LEBAR LAYAR secara horizontal (FULL WIDTH). Jangan membuat paragraf pendek atau ramping. Gunakan kalimat panjang yang menyambung. 
6. HINDARI indentasi atau spasi di tepi kiri. Pastikan teks memenuhi bingkai layar dari batas paling kiri ke batas paling kanan secara simetris.

Konteks Pengetahuan Anda:
- Sanad Lugay Kancana & Maenpo Purwakarta.
- Ilmu Paririmbon & Falak Sunda.
- Manuskrip kuno (Lontar, Cariosan, Babad).
- Usada (Penyembuhan) & Mitologi Karuhun Pasundan.`;

  async function callGeminiWithFallback(params: any) {
    const models = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let lastError: any = null;
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
      }
    }
    throw lastError;
  }

  app.post("/api/gemini/generate", async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    try {
      const response = await callGeminiWithFallback({
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          systemInstruction: systemInstruction || SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });
      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini generate error:", error);
      res.status(500).json({ error: error?.message || "Failed to communicate with jagat ghaib." });
    }
  });

  app.post("/api/gemini/vision", async (req, res) => {
    const { base64Image, prompt, systemInstruction } = req.body;
    try {
      const response = await callGeminiWithFallback({
        contents: [{
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: prompt }
          ]
        }],
        config: {
          systemInstruction: systemInstruction || SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });
      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini vision error:", error);
      res.status(500).json({ error: error?.message || "Failed to analyze visual anomaly." });
    }
  });

  app.post("/api/gemini/search", async (req, res) => {
    const { prompt } = req.body;
    try {
      const response = await callGeminiWithFallback({
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ googleSearch: {} }],
        },
      });
      const text = response.text || '';
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      res.json({ text, sources });
    } catch (error: any) {
      console.error("Gemini search error:", error);
      res.status(500).json({ error: error?.message || "Failed to search chronicle." });
    }
  });

  app.post("/api/gemini/image", async (req, res) => {
    const { prompt } = req.body;
    try {
      const cleanPrompt = prompt ? prompt.replace(/[\n\r]+/g, ' ').substring(0, 110) : 'Waskita Pasundan Kencana';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1422" viewBox="0 0 800 1422">
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stop-color="#2a0845"/>
            <stop offset="40%" stop-color="#130b26"/>
            <stop offset="75%" stop-color="#0a0614"/>
            <stop offset="100%" stop-color="#020108"/>
          </radialGradient>
          <radialGradient id="sunBurst" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.6"/>
            <stop offset="45%" stop-color="#d97706" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="25%" stop-color="#facc15"/>
            <stop offset="70%" stop-color="#ca8a04"/>
            <stop offset="100%" stop-color="#713f12"/>
          </linearGradient>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#1e40af"/>
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="800" height="1422" fill="url(#bgGrad)"/>
        
        <g transform="translate(400, 600)" fill="none" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.35">
          <circle r="360" stroke-dasharray="6 6"/>
          <path d="M0 -450 L0 450 M-450 0 L450 0" stroke-dasharray="12 12" stroke-width="1.8"/>
          <path d="M-320 -320 L320 320 M-320 320 L320 -320" stroke-dasharray="8 8"/>
        </g>

        <circle cx="400" cy="600" r="380" fill="url(#sunBurst)"/>

        <!-- Outer Borders -->
        <rect x="40" y="40" width="720" height="1342" fill="none" stroke="url(#goldGrad)" stroke-width="6" rx="28" filter="url(#glow)" opacity="0.95"/>
        <rect x="56" y="56" width="688" height="1310" fill="none" stroke="#facc15" stroke-width="2" rx="20" opacity="0.6"/>
        <rect x="68" y="68" width="664" height="1286" fill="none" stroke="#38bdf8" stroke-width="1.2" rx="14" opacity="0.4"/>

        <!-- Sacred Geometry & Kujang / Aura Symbol -->
        <g transform="translate(400, 600)" stroke="url(#goldGrad)" fill="none" stroke-width="2.5" opacity="0.95">
          <circle r="280" stroke-width="3" stroke-dasharray="20 10" />
          <circle r="220" stroke="url(#cyanGrad)" stroke-width="2.5"/>
          <circle r="160" stroke-dasharray="12 6"/>
          
          <!-- Star / Kujang Silhouette Motif -->
          <path d="M0 -220 L160 110 L-160 110 Z" stroke-width="2.5" filter="url(#glow)"/>
          <path d="M0 220 L160 -110 L-160 -110 Z" stroke-width="2.5" filter="url(#glow)"/>
          
          <circle r="100" stroke="#38bdf8" stroke-width="2"/>
          <circle r="50" fill="#facc15" fill-opacity="0.3" filter="url(#glow)"/>
          <circle r="18" fill="#fef08a" filter="url(#glow)"/>
        </g>

        <!-- Corner Ornaments -->
        <g stroke="url(#goldGrad)" fill="none" stroke-width="4">
          <path d="M 70 160 L 70 70 L 160 70" />
          <path d="M 730 160 L 730 70 L 640 70" />
          <path d="M 70 1262 L 70 1352 L 160 1352" />
          <path d="M 730 1262 L 730 1352 L 640 1352" />
        </g>

        <!-- Top Header Badge -->
        <rect x="140" y="85" width="520" height="75" rx="18" fill="#0c091f" fill-opacity="0.95" stroke="url(#goldGrad)" stroke-width="2.5" filter="url(#glow)"/>
        <text x="400" y="132" fill="#fef08a" font-family="serif" font-size="22" font-weight="bold" letter-spacing="5" text-anchor="middle" filter="url(#glow)">RISALAH KOSMOLOGI WASKITA</text>

        <!-- Bottom Dynamic Info Panel -->
        <g transform="translate(400, 1140)" text-anchor="middle">
          <rect x="-340" y="-80" width="680" height="190" rx="20" fill="#080612" fill-opacity="0.95" stroke="url(#goldGrad)" stroke-width="2.5" opacity="0.98" filter="url(#glow)"/>
          <text x="0" y="-38" fill="#fef08a" font-family="serif" font-size="18" font-weight="bold" letter-spacing="3">SILIH ASAH • SILIH ASIH • SILIH ASUH</text>
          <text x="0" y="-5" fill="#7dd3fc" font-family="serif" font-size="15" font-style="italic">"Karsa raksa batin, hidayah rezeki &amp; watak sejati"</text>
          <line x1="-280" y1="18" x2="280" y2="18" stroke="url(#goldGrad)" stroke-width="1" opacity="0.5"/>
          <text x="0" y="48" fill="#e2e8f0" font-family="sans-serif" font-size="13" opacity="0.9">${cleanPrompt}</text>
        </g>

        <text x="400" y="1366" fill="#94a3b8" font-family="sans-serif" font-size="11" letter-spacing="7" text-anchor="middle">GALURA LUGAY KANCANA • PASUNDAN BUHUN</text>
      </svg>`;

      const b64 = Buffer.from(svg).toString('base64');
      res.json({ image: `data:image/svg+xml;base64,${b64}` });
    } catch (aiError: any) {
      console.error("AI Image generation error:", aiError);
      res.status(500).json({ error: aiError?.message || "Failed to generate image." });
    }
  });

  app.post("/api/gemini/palmistry-analysis", async (req, res) => {
    const { base64Image } = req.body;
    try {
        const response = await callGeminiWithFallback({
            contents: [{
                parts: [
                    { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
                    { text: "Nyungsi makna Rajah Leungeun (Palmistry) melalui kaca waskita. Identifikasi garis-garis utama (Garis Hirup, Garis Ati, Garis Nasib) and hubungkan dengan karsa serta raksa kehidupan subjek dalam filosofi Sunda Buhun. Sampaikan secara puitis and penuhi SELURUH LEBAR bingkai teks secara maksimal." }
                ]
            }],
            config: { systemInstruction: SYSTEM_PROMPT }
        });
        res.json({ result: response.text });
    } catch (error: any) {
        res.status(500).json({ error: error?.message || "Failed" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
