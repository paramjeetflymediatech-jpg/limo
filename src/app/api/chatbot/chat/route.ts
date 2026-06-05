import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are the elite AI Concierge for FantasticLimo, a premium chauffeur and limousine service.
Your goal is to assist clients with luxury travel planning, booking inquiries, fleet information, pricing, and diplomatic protection packages.

FantasticLimo Key Information:
1. Fleet Options & Hourly Rates:
   - Rolls-Royce Phantom VIII: Ultra-luxury sedan, whisper-quiet, hand-crafted leather. Rate: $350/hr.
   - Mercedes-Benz S-Class (W223): Executive sedan, active ambient lighting, reclining seats. Rate: $180/hr.
   - Bentley Flying Spur: High-performance British luxury. Rate: $280/hr.
   - Cadillac Escalade ESV: Bold road presence, large cargo. Rate: $180/hr.
   - Super Stretch Limousine: Classic stretch, private bar, star roof. Rate: $220/hr.
   - VIP Executive Sprinter: Mobile lounge, face-to-face chairs, starlight ceiling. Rate: $250/hr.
2. Special Services:
   - Airport VIP Meet & Greet: Flight tracking, terminal nameplate greeting, luggage handling.
   - FIFA World Cup 2026 Transfers: VIP stadium transfers to BC Place (Vancouver) and Lumen Field (Seattle).
   - Diplomatic Protection: Armored vehicles (B6/B7 class Mercedes/Escalades), motorcade escorts, armed/unarmed bodyguards.
3. Contact Details:
   - Phone: +1 (306) 240-4000
   - Email: info@fantasticlimo.ca
   - Dispatch availability: 24/7.

Response Guidelines:
- Keep your answers highly professional, formal, helpful, and elegant.
- Be concise and answer in a maximum of 2 to 3 sentences.
- If the client wants to connect with a dispatcher or live agent, tell them they can type "Live" at any time.`;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { message, history } = data;

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const text = message.toLowerCase().trim();
    let reply = "";

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const contents: any[] = [];
        if (history && Array.isArray(history) && history.length > 0) {
          for (const turn of history) {
            if (turn.role && turn.text) {
              contents.push({
                role: turn.role === "model" ? "model" : "user",
                parts: [{ text: turn.text }],
              });
            }
          }
        }

        // Ensure the history starts with a "user" turn to conform to Gemini API specification
        while (contents.length > 0 && contents[0].role !== "user") {
          contents.shift();
        }

        const cleanContents: any[] = [];
        for (const turn of contents) {
          if (cleanContents.length === 0) {
            cleanContents.push(turn);
          } else {
            const lastTurn = cleanContents[cleanContents.length - 1];
            if (lastTurn.role === turn.role) {
              lastTurn.parts[0].text += "\n" + turn.parts[0].text;
            } else {
              cleanContents.push(turn);
            }
          }
        }

        if (cleanContents.length === 0) {
          cleanContents.push({
            role: "user",
            parts: [{ text: message }],
          });
        }

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: SYSTEM_PROMPT,
                  },
                ],
              },
              contents: cleanContents,
              generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.5,
              },
            }),
          }
        );

        if (geminiResponse.ok) {
          const resData = await geminiResponse.json();
          reply = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        } else {
          const errText = await geminiResponse.text();
          console.error(`Gemini API returned error status ${geminiResponse.status}: ${errText}`);
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to keywords:", geminiError);
      }
    }

    // Fallback keyword matcher if Gemini API is offline or key is missing
    if (!reply) {
      if (text.includes("hello") || text.includes("hi ") || text.includes("hey") || text.includes("greetings")) {
        reply = "Hello! I am your FantasticLimo AI Assistant. How can I assist you with your luxury travel planning today?";
      } 
      else if (text.includes("fleet") || text.includes("car") || text.includes("vehicle") || text.includes("limo") || text.includes("sprinter") || text.includes("rolls") || text.includes("mercedes") || text.includes("cadillac")) {
        reply = "Our premium fleet includes the Rolls-Royce Phantom, Mercedes S-Class, Bentley Flying Spur, Cadillac Escalade, Stretch Limousines, and VIP Executive Sprinters. All vehicles are climate-controlled and equipped with refreshments and connectivity tools. Which vehicle matches your style?";
      } 
      else if (text.includes("price") || text.includes("cost") || text.includes("rate") || text.includes("hour") || text.includes("charge")) {
        reply = "Our rates are competitive for elite travel and start from $180/hr (Airport/Executive Mercedes) up to $450/hr (Royalty/Security Escort). Let me know your routing details (pickup, drop-off, date, and duration) so I can help customize a quote for you.";
      } 
      else if (text.includes("airport") || text.includes("meet") || text.includes("greet") || text.includes("transfer") || text.includes("flight")) {
        reply = "We offer premium VIP Airport Meet & Greet services. Your chauffeur tracks your flight in real-time, greets you in the terminal with an electronic nameplate, assists with luggage, and ensures a seamless transition. Would you like to check airport routing?";
      } 
      else if (text.includes("fifa") || text.includes("world cup") || text.includes("stadium") || text.includes("bc place") || text.includes("lumen field") || text.includes("seattle")) {
        reply = "We provide special VIP transfers for the FIFA World Cup 2026! We serve stadium venues including BC Place (Vancouver) and Lumen Field (Seattle). Bypass standard event traffic with our elite drop-offs. Would you like to reserve a VIP Executive Sprinter for a game?";
      } 
      else if (text.includes("security") || text.includes("diplomat") || text.includes("escort") || text.includes("armored") || text.includes("bodyguard")) {
        reply = "FantasticLimo specializes in Diplomatic Protection Escorts. We coordinate armed or unarmed bodyguards, threat assessments, and certified armored vehicles (B6/B7 class Mercedes S-Class and Cadillac Escalades) for absolute security.";
      } 
      else if (text.includes("book") || text.includes("reserve") || text.includes("rent") || text.includes("schedule") || text.includes("hire")) {
        reply = "You can book directly using the reservation form on our website! Alternatively, you can give me your pickup location, drop-off location, preferred vehicle, passenger count, and date/time right here, and I will submit it as a priority booking request.";
      } 
      else if (text.includes("contact") || text.includes("phone") || text.includes("email") || text.includes("number") || text.includes("support")) {
        reply = "You can contact our VIP Concierge Desk 24/7 at +1 (306) 240-4000 or by email at Info@fantasticlimo.ca. Our coordinators are always standing by.";
      } 
      else {
        reply = "I understand you have an inquiry. I can assist you with booking details, explaining our luxury fleet, detailing security escort options, or scheduling airport transfers. What details can I provide for you? You can also type 'Live' to talk directly to a human representative.";
      }
    }

    return Response.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("Failed to process chatbot reply:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
