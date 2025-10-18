import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Create a new room
app.post('/make-server-b107cdc9/rooms', async (c) => {
  try {
    const { roomId, roomName, teacherName } = await c.req.json();

    if (!roomId || !roomName) {
      return c.json({ error: 'Room ID and name are required' }, 400);
    }

    // Check if room already exists
    const existing = await kv.get(`room:${roomId}`);
    if (existing) {
      return c.json({ error: 'Room ID already exists' }, 400);
    }

    const room = {
      id: roomId,
      name: roomName,
      teacherName: teacherName || 'Anonymous Teacher',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`room:${roomId}`, room);
    console.log(`Room created successfully: ${roomId}`);
    return c.json({ success: true, room });
  } catch (error) {
    console.error('Error creating room:', error);
    return c.json({ error: `Failed to create room: ${error.message}` }, 500);
  }
});

// Get room details
app.get('/make-server-b107cdc9/rooms/:roomId', async (c) => {
  try {
    const roomId = c.req.param('roomId');
    const room = await kv.get(`room:${roomId}`);

    if (!room) {
      return c.json({ error: 'Room not found' }, 404);
    }

    return c.json({ success: true, room });
  } catch (error) {
    console.error('Error fetching room:', error);
    return c.json({ error: `Failed to fetch room: ${error.message}` }, 500);
  }
});

// Submit confusion
app.post('/make-server-b107cdc9/confusions', async (c) => {
  try {
    const { roomId, topic, details } = await c.req.json();

    if (!roomId || !topic) {
      return c.json({ error: 'Room ID and topic are required' }, 400);
    }

    // Verify room exists
    const room = await kv.get(`room:${roomId}`);
    if (!room) {
      return c.json({ error: 'Room not found' }, 404);
    }

    const timestamp = Date.now();
    const confusionId = crypto.randomUUID();
    const confusion = {
      id: confusionId,
      roomId,
      topic,
      details: details || '',
      timestamp: new Date(timestamp).toISOString(),
    };

    await kv.set(`confusion:${roomId}:${timestamp}:${confusionId}`, confusion);
    console.log(`Confusion submitted for room ${roomId}: ${topic}`);
    return c.json({ success: true, confusion });
  } catch (error) {
    console.error('Error submitting confusion:', error);
    return c.json({ error: `Failed to submit confusion: ${error.message}` }, 500);
  }
});

// Get all confusions for a room
app.get('/make-server-b107cdc9/rooms/:roomId/confusions', async (c) => {
  try {
    const roomId = c.req.param('roomId');
    
    // Verify room exists
    const room = await kv.get(`room:${roomId}`);
    if (!room) {
      return c.json({ error: 'Room not found' }, 404);
    }

    const confusions = await kv.getByPrefix(`confusion:${roomId}:`);
    
    // Sort by timestamp descending (newest first)
    confusions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    console.log(`Fetched ${confusions.length} confusions for room ${roomId}`);
    return c.json({ success: true, confusions });
  } catch (error) {
    console.error('Error fetching confusions:', error);
    return c.json({ error: `Failed to fetch confusions: ${error.message}` }, 500);
  }
});

// Get AI summary of confusions
app.post('/make-server-b107cdc9/rooms/:roomId/summarize', async (c) => {
  try {
    const roomId = c.req.param('roomId');
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      return c.json({ error: 'Gemini API key not configured' }, 500);
    }

    // Get all confusions for this room
    const confusions = await kv.getByPrefix(`confusion:${roomId}:`);

    if (confusions.length === 0) {
      return c.json({ 
        success: true, 
        summary: 'No confusion submissions yet for this room.' 
      });
    }

    // Prepare data for AI
    const confusionTexts = confusions.map((c, i) => 
      `${i + 1}. Topic: ${c.topic}${c.details ? `\n   Details: ${c.details}` : ''}`
    ).join('\n\n');

    const prompt = `You are an educational assistant helping a teacher understand student confusion patterns. 

Below are ${confusions.length} anonymous confusion submissions from students in a class:

${confusionTexts}

Please analyze these submissions and provide:
1. Main themes or topics students are confused about (group similar confusions together)
2. The most common areas of confusion
3. A brief summary for the teacher on what to focus on

Format your response in a clear, actionable way that helps the teacher address student needs.`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return c.json({ error: `Gemini API error: ${response.statusText}` }, 500);
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';

    // Store the summary
    const timestamp = Date.now();
    await kv.set(`summary:${roomId}:${timestamp}`, {
      summary,
      confusionCount: confusions.length,
      timestamp: new Date(timestamp).toISOString(),
    });

    console.log(`Generated AI summary for room ${roomId} with ${confusions.length} confusions`);
    return c.json({ success: true, summary, confusionCount: confusions.length });
  } catch (error) {
    console.error('Error generating summary:', error);
    return c.json({ error: `Failed to generate summary: ${error.message}` }, 500);
  }
});

// Delete a specific confusion (for teacher moderation)
app.delete('/make-server-b107cdc9/confusions/:confusionKey', async (c) => {
  try {
    const confusionKey = c.req.param('confusionKey');
    await kv.del(confusionKey);
    console.log(`Deleted confusion: ${confusionKey}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting confusion:', error);
    return c.json({ error: `Failed to delete confusion: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
