import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "../styles/Chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = "AIzaSyCqk30w0DADu_s6UI1l9xTlwn72ZXR1bos"; 
  const MODEL_NAME = "gemini-2.0-flash";

  const systemInstructionText = `
  You are MealConnect Assistant 🍲🤖.
  Your job is to answer ONLY about the MealConnect platform and its features:
  - How people in need can find nearby food shelters, community kitchens, and donation points
  - How shelters can update real-time food availability and resources
  - How volunteers can sign up, get assigned, and track their contributions
  - How donors can contribute (money, food, essentials) and track their impact
  - How the platform helps coordinate shelters and avoid food waste
  - How real-time maps and notifications keep users informed
  - How admins use the dashboard (resource tracking, reporting, volunteer management)

  If the user asks anything outside these topics (like weather, movies, coding, or unrelated queries), reply:
  "⚠ I only help with the MealConnect platform. Please ask about shelters, donations, volunteers, or food services."
  `;

  const askAI = async () => {
    if (!question.trim()) {
      setAnswer("⚠ Please enter your MealConnect question!");
      return;
    }

    setLoading(true);
    setAnswer("");

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: question }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] },
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "API request failed");
      }

      const data = await res.json();
      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠ No response from AI";

      setAnswer(text);
    } catch (err) {
      setAnswer("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="chatbot-button"
        aria-label="Open chatbot"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <h3>🍲 MealConnect Assistant</h3>
              <p className="chatbot-subtitle">Ask me anything about MealConnect</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="chatbot-body">
            <div className="chatbot-input-area">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about MealConnect..."
                className="chatbot-input"
                onKeyDown={(e) => e.key === "Enter" && askAI()}
                disabled={loading}
              />
              <button
                onClick={askAI}
                disabled={loading || !question.trim()}
                className="chatbot-send"
              >
                <Send size={18} />
              </button>
            </div>
            
            {answer && (
              <div className="chatbot-answer">
                <div className="answer-text">{answer}</div>
              </div>
            )}
            
            {loading && (
              <div className="chatbot-loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
