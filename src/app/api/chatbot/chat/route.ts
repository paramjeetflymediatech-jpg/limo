import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { message } = data;

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const text = message.toLowerCase().trim();
    let reply = "";

    // Keywords matching
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
    else if (text.includes("fifa") || text.includes("world cup") || text.includes("stadium") || text.includes("bc place") || text.includes("bmo field")) {
      reply = "We provide special VIP transfers for the FIFA World Cup 2026! We serve stadium venues including BC Place (Vancouver) and BMO Field (Toronto). Bypass standard event traffic with our elite drop-offs. Would you like to reserve a VIP Executive Sprinter for a game?";
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

    return Response.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("Failed to process chatbot reply:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
