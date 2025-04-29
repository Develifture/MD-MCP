const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const MarkdownIt = require('markdown-it');

const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const md = new MarkdownIt();

app.use(express.json());

app.post('/generate-instructions', async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Generate detailed step-by-step instructions for: ${task}. 
    Include:
    1. Clear numbered steps
    2. Expected inputs
    3. Potential challenges
    4. Troubleshooting tips
    Format as Markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const html = md.render(text);
    
    res.json({
      markdown: text,
      html: html
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate instructions' });
  }
});

app.post('/create-md', async (req, res) => {
  try {
    const { filename, structure } = req.body;
    if (!filename || !structure) {
      return res.status(400).json({ error: 'Filename and structure are required' });
    }
    // Generate Markdown content from structure
    function generateMarkdown(struct) {
      let md = '';
      if (struct.title) md += `# ${struct.title}\n\n`;
      if (struct.sections && Array.isArray(struct.sections)) {
        struct.sections.forEach(section => {
          if (section.heading) md += `## ${section.heading}\n\n`;
          if (section.content) md += `${section.content}\n\n`;
          if (section.subsections && Array.isArray(section.subsections)) {
            section.subsections.forEach(sub => {
              if (sub.subheading) md += `### ${sub.subheading}\n\n`;
              if (sub.content) md += `${sub.content}\n\n`;
            });
          }
        });
      }
      return md;
    }
    const markdownContent = generateMarkdown(structure);
    const fs = require('fs');
    const path = require('path');
    const savePath = path.join(__dirname, filename.endsWith('.md') ? filename : filename + '.md');
    fs.writeFileSync(savePath, markdownContent, 'utf8');
    res.json({ message: 'Markdown file created', file: savePath });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create Markdown file' });
  }
});
app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
});
