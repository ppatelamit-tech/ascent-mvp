// Status 27 — the Guide's voice. POST { text } → audio/mpeg from ElevenLabs (Alex, the adventures' narrator).
// Requires ELEVENLABS_API_KEY. Short texts only; the client falls back to the device voice on any failure.
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "POST only" };
  let body; try { body = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400, body: "bad json" }; }
  const text = String(body.text || "").trim(); if (!text || text.length > 600) return { statusCode: 400, body: "text 1-600 chars" };
  const key = process.env.ELEVENLABS_API_KEY; if (!key) return { statusCode: 503, body: JSON.stringify({ error: "no_key" }) };
  const voice = process.env.GUIDE_VOICE_ID || "qkEGWkCMgKgN6hNFFX4p";
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_22050_32`, { method: "POST", headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" }, body: JSON.stringify({ text, model_id: process.env.GUIDE_TTS_MODEL || "eleven_flash_v2_5", voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.2, use_speaker_boost: true } }) });
    if (!r.ok) return { statusCode: 502, body: JSON.stringify({ error: "upstream", status: r.status }) };
    const buf = Buffer.from(await r.arrayBuffer());
    return { statusCode: 200, headers: { "content-type": "audio/mpeg", "cache-control": "private, max-age=86400" }, body: buf.toString("base64"), isBase64Encoded: true };
  } catch (e) { return { statusCode: 502, body: JSON.stringify({ error: String(e.message || e) }) }; }
};
