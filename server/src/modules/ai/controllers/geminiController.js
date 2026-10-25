import { generateAIResponse } from "../services/geminiService.js";
export async function explainNote(req, res) {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Note content is required.",
      });
    }

    const explanation = await generateAIResponse(
      `Explain this project note in simple, clear English. Preserve important technical details.\n\n${content}`
    );

    return res.json({ result: explanation });
  } catch (error) {
    console.error("Explain note error:", error.message);
    return res.status(500).json({
      message: "Could not explain the note. Check the server configuration.",
    });
  }
}

export async function improveNote(req, res) {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Note content is required.",
      });
    }

    const suggestions = await generateAIResponse(
      `Review this software project note. Suggest specific improvements to its clarity, organization, technical accuracy, and missing details. Do not invent project facts.\n\n${content}`
    );

    return res.json({ result: suggestions });
  } catch (error) {
    console.error("Improve note error:", error.message);
    return res.status(500).json({
      message: "Could not suggest improvements. Check the server configuration.",
    });
  }
}

export async function generateDocs(req, res) {
  try {
    const { code } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({
        message: "Code is required.",
      });
    }

    const documentation = await generateAIResponse(
      `Generate clear technical documentation for the following code.
Explain its purpose, important functions, parameters, return values, and usage examples where applicable.
Do not invent behavior that the code does not support.

Code:
${code}`
    );

    return res.json({ result: documentation });
  } catch (error) {
    console.error("Generate docs error:", error.message);
    return res.status(500).json({
      message: "Could not generate documentation.",
    });
  }
}

export async function generateReadme(req, res) {
  try {
    const { description, code } = req.body;

    if (!description?.trim() && !code?.trim()) {
      return res.status(400).json({
        message: "Project description or code overview is required.",
      });
    }

    const readme = await generateAIResponse(
      `Generate a useful README.md in Markdown for this software project.
Include an appropriate title, overview, features, setup instructions where supported by the input, usage, and technologies.
Do not invent installation commands, environment variables, or project features.

Project description:
${description || "Not provided"}

Code overview:
${code || "Not provided"}`
    );

    return res.json({ result: readme });
  } catch (error) {
    console.error("Generate README error:", error.message);
    return res.status(500).json({
      message: "Could not generate README.",
    });
  }
}
