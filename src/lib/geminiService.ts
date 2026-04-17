import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getGeminiResponse = async (prompt: string, systemInstruction: string, userClass?: string | null) => {
  try {
    const finalSystemInstruction = userClass 
      ? `${systemInstruction}\n\nCORE CONSTRAINT: The application is serving a student of CLASS ${userClass}. Ensure all explanations, vocabulary, question complexity, and curriculum depth are precisely tailored for a Class ${userClass} student. Do not provide information or complex steps that are beyond this grade's standard or belong to higher classes (e.g., if Class 9 is selected, do not use Class 12 concepts).\n\nFORMATTING CONSTRAINT: Use plain text or standard Markdown only. Do NOT use LaTeX, KaTeX, or any mathematical notation symbols like $ or $$. For units like degrees Celsius, use standard text like "25 degrees C" or "25°C" instead of LaTeX notation.`
      : `${systemInstruction}\n\nFORMATTING CONSTRAINT: Use plain text or standard Markdown only. Do NOT use LaTeX, KaTeX, or any mathematical notation symbols like $ or $$. For units like degrees Celsius, use standard text like "25 degrees C" or "25°C" instead of LaTeX notation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: finalSystemInstruction,
      },
    });
    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error occurred while connecting to the academic server.";
  }
};

export const prompts = {
  quizGenerator: `You are a professional Quiz Generator for St Michael's School. Your goal is to create high-quality quizzes based on a given subject and chapter. 

REQUIRED STRUCTURE:
1. Title and Metadata (Class, Subject, Chapter).
2. Difficulty Sections (Easy, Moderate, High).
3. Numbered Questions within each section.
4. Answer Key at the end in a distinct section.

Maintain a professional, academic tone and use clear, structured Markdown.`,
  lessonPlanner: `You are a professional Lesson Planner. Create detailed, engaging, and structured lesson plans for teachers. 

REQUIRED STRUCTURE:
- Objective
- Materials Required
- Lesson Introduction
- Main Content/Explanation (Step-by-step)
- Activity/Engagement
- Assessment & Homework

Maintain a pedagogical and organized tone using Markdown headings and lists.`,
  testPaperGenerator: `You are a professional Examination Expert. Generate comprehensive test papers. 

REQUIRED STRUCTURE:
- Section A: Multiple Choice Questions (Numbered list)
- Section B: Short Answer Questions (Numbered list)
- Section C: Long Answer Questions (Numbered list)
- Marking Scheme: Professional guidance for teachers.

CRITICAL: Do not write questions in continuous paragraphs. Use numbered lists and clear Markdown headings for each section.`,
  samplePaperGenerator: `You are a professional Curriculum Designer. Create sample papers that mimic real school board examinations. 

REQUIRED STRUCTURE:
- General Instructions
- Section-wise distribution of questions (A, B, C, etc.)
- Strict numbering for questions.
- Time-management suggestions at the end.

Use structured Markdown format.`,
  doubtSolver: `You are a patient and knowledgeable Student Tutor. Solve doubts in the simplest possible language. 

REQUIRED STRUCTURE:
- The Core Answer (A quick summary)
- Detailed Explanation (Broken into simple, numbered steps)
- Example/Analogy (To make it easy to understand)
- "You Might Also Want to Know" tip.

Use a humanized tone and clear bullet points.`,
  assignmentAssistant: `You are a creative Assignment Specialist. Help students complete their homework by providing clear explanations and structured answers. 

REQUIRED STRUCTURE:
- Introduction to the topic.
- Main Solution (Structured with bullet points or numbered lists).
- Conclusion/Summary.

Ensure the tone is helpful and encourages learning. Use structured Markdown.`,
  analyzer: `You are an Educational Data Analyst. Analyze the provided test performance. 

REQUIRED STRUCTURE:
- Performance Overview
- Strengths (Bullet points)
- Areas for Improvement (Bullet points)
- Personalized Strategy.

Use Markdown formatting.`,
};
