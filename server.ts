import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/music/compose', async (req, res) => {
    try {
      const promptText =
        typeof req.body?.promptText === 'string' && req.body.promptText.trim()
          ? req.body.promptText.trim()
          : 'Hầm ngục Hắc Thạch kịch tính';

      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Bạn là nhạc sĩ sáng tác bài hát nhạc game Roguelike hành động (như Soul Knight / Hades).
Hãy sáng tác một bài hát hoàn chỉnh gồm 5 phân đoạn (Intro, Verse A, Verse B, Chorus, Climax) dựa trên yêu cầu: "${promptText}".
Trả về JSON theo đúng cấu trúc yêu cầu.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              songTitle: { type: Type.STRING },
              style: {
                type: Type.STRING,
                enum: [
                  'heroic_minor',
                  'samurai_pentatonic',
                  'cyber_synth',
                  'boss_phrygian',
                  'arcade_major',
                ],
              },
              bpm: { type: Type.INTEGER },
              verseMotif: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER },
                description:
                  '16 scale degree integers between -1 and 10 (-1 means rest)',
              },
              chorusMotif: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER },
                description:
                  '16 scale degree integers between 2 and 12 for the high-energy chorus hook',
              },
              lyrics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Exactly 5 poetic Vietnamese lyric lines for [Intro, Verse A, Verse B, Chorus, Climax]',
              },
            },
            required: [
              'songTitle',
              'style',
              'bpm',
              'verseMotif',
              'chorusMotif',
              'lyrics',
            ],
          },
        },
      });

      const jsonText = (response.text ?? '{}').trim();
      const data = JSON.parse(jsonText);
      res.json(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to compose AI song';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
