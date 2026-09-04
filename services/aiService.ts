/**
 * AI Service integrating Nano Banana / Imagen for 9:16 aspect ratio mystical,
 * cosmological, and auric images themed around Sundanese occult and cosmic motifs.
 */

export async function generateSundaneseMysticalVisual(contextTitle: string, description: string): Promise<string | null> {
  try {
    const prompt = `A vertical 9:16 aspect ratio cinematic mystical masterpiece, Sundanese occult and cosmic philosophy, sacred Kujang Kencana aura geometry, glowing astral light ornaments, ancient Isim talisman symbols, hidden spiritual wealth (harta rezeki), golden celestial rays, deep astral twilight gradients, sacred art masterpiece. Subject: ${contextTitle} - ${description}`;

    const res = await fetch('/api/gemini/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    return data.image || null;
  } catch (e) {
    console.error("AI Service image generation error:", e);
    return null;
  }
}

export async function generateCardVisual(cardName: string): Promise<string | null> {
  return generateSundaneseMysticalVisual("Tarot Karsa Pasundan", `A vertical 9:16 professional esoteric Tarot card design, ornate mystical gold filigree border, classic Tarot card framing, central sacred Sundanese archetype illustration for ${cardName}, mysterious divine symbols, glowing aura, deep twilight gradients, masterpiece`);
}

export async function generateKhodamEntityVisual(entityName: string, traits: string): Promise<string | null> {
  return generateSundaneseMysticalVisual("Khodam Guardian Entity", `Ethereal spirit guardian ${entityName} with characteristics: ${traits}, surrounded by golden divine light`);
}

export async function generateRajahTalismanVisual(talismanName: string, prayer: string): Promise<string | null> {
  return generateSundaneseMysticalVisual("Rajah & Isim Kasepuhan", `Sacred talisman ${talismanName} with mystic Sundanese script and protection aura: ${prayer}`);
}

export async function generateMysticalVisual(base64Image: string, textResult: string): Promise<string | null> {
  return generateSundaneseMysticalVisual("Analisis Aura & Kosmologi", textResult);
}

export async function generateIsimZimatVisual(title: string, details: string): Promise<string | null> {
  const customPrompt = `A vertical 9:16 aspect ratio luxurious ornate Sundanese collector card style, intricate antique gold filigree borders and ancient script banners, central mystical artwork depicting: ${title}, incorporating elements: ${details}, golden celestial rays, divine light ornaments, spiritual fortune, masterpiece occult art.`;
  try {
    const res = await fetch('/api/gemini/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: customPrompt })
    });
    const data = await res.json();
    return data.image || null;
  } catch (e) {
    console.error("AI Service image generation error:", e);
    return null;
  }
}

export async function generateResultIllustration(text: string, title: string): Promise<string | null> {
  return generateIsimZimatVisual(title, text);
}
