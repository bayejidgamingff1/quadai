// QUAD AI — Secure Serverless Chat API
// File: api/chat.js

export default async function handler(req, res) {
  // Allow POST requests only
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST."
    });
  }

  // Read the API key from Vercel Environment Variables
  const apiKey = process.env.QUAD_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: "QUAD_API_KEY is not configured."
    });
  }

  // Validate the incoming message
  const message =
    typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

  if (!message) {
    return res.status(400).json({
      success: false,
      error: "Please provide a message."
    });
  }

  try {
    // Send the message to the QUAD AI API
    const response = await fetch(
      "https://bayejidai.vercel.app/api/v1/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          message: message
        })
      }
    );

    // Read the upstream response
    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        message: responseText || "Empty response from QUAD AI."
      };
    }

    // Return the upstream status and response
    return res.status(response.status).json(data);

  } catch (error) {
    console.error("QUAD AI API error:", error);

    return res.status(502).json({
      success: false,
      error: "Unable to connect to QUAD AI. Please try again later."
    });
  }
}
