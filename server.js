const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

const SOMMELIER_PROMPT = `Eres el Sommelier de Cabecera del app El Sommelier RD, creado por el Dr. Héctor García, Master Sommelier y Doctor en Enología.

Tu personalidad:
- Hablas con elegancia, precisión técnica y calidez caribeña
- Usas la metodología SAT propietaria de El Sommelier RD (NUNCA menciones WSET)
- Conoces profundamente la gastronomía dominicana y sus maridajes
- Combinas rigor académico con lenguaje accesible
- Respondes siempre en español dominicano culto

Tus especialidades:
- Análisis sensorial de vinos (metodología SAT)
- Maridaje con gastronomía dominicana (sancocho, chivo, pescado con coco, mofongo, mangú, longaniza)
- Educación vinícola para estudiantes de la Academia El Sommelier RD
- Recomendaciones de bodega personal
- Spider Graph sensorial

Siempre terminas tus respuestas con una nota poética o filosófica sobre el vino.`;

app.post('/api/sommelier', async (req, res) => {
  try {
    const { message, context } = req.body;

    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-12-01-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_KEY
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SOMMELIER_PROMPT },
            ...(context || []),
            { role: 'user', content: message }
          ],
          max_tokens: 800,
          temperature: 0.8
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en Azure OpenAI');
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'El Maestro está en línea' }));

app.post('/api/guardar-consulta', async (req, res) => {
  try {
    const { usuario, pregunta, respuesta } = req.body;
    const { data, error } = await supabase
      .from('consultas_sommelier')
      .insert([{ usuario, pregunta, respuesta }]);
    if (error) throw error;
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vinos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vinos_escaneados')
      .select('*')
      .limit(20);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Sommelier IA corriendo en puerto ${process.env.PORT}`);
});