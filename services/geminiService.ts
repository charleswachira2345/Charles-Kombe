import { GoogleGenAI, Type } from "@google/genai";
import { Service } from '../types';

const apiKey = process.env.API_KEY || ''; 
// Ideally we handle the missing key gracefully in the UI, but for this structure we assume it's there.

const ai = new GoogleGenAI({ apiKey });

export const aiSearchServices = async (query: string, services: Service[]): Promise<string[]> => {
  if (!query.trim()) return [];

  // Create a lightweight index for the model to analyze
  const serviceIndex = services.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    location: s.location,
    tags: s.tags
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are a smart search engine for a services marketplace in Africa called "SkillSwap".
        User Query: "${query}"
        
        Here is the list of available services:
        ${JSON.stringify(serviceIndex)}
        
        Analyze the query and the services. Return a list of Service IDs that best match the user's intent. 
        Consider semantic meaning (e.g., "fix sink" matches "plumbing").
        Return an empty array if no matches found.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini Search Error:", error);
    // Fallback to basic text match if AI fails
    const lowerQuery = query.toLowerCase();
    return services
      .filter(s => 
        s.title.toLowerCase().includes(lowerQuery) || 
        s.category.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery)
      )
      .map(s => s.id);
  }
};

export const enhanceServiceDescription = async (title: string, roughNotes: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are a professional copywriter for "SkillSwap Africa".
        Help a user write a compelling service description.
        
        Service Title: ${title}
        User's Rough Notes: ${roughNotes}
        
        Output a clean, professional, and inviting paragraph (max 50 words) describing this service. 
        Focus on value and trust.
      `,
    });
    return response.text || roughNotes;
  } catch (error) {
    console.error("Gemini Description Error:", error);
    return roughNotes;
  }
};