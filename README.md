# Gemini MCP

This project is an MCP (Model Control Point) server for interacting with Google's Gemini Flash 2.0 generative AI model. It provides endpoints to generate detailed, step-by-step instructions for any given task and to create custom Markdown files from structured input.

## Features
- **/generate-instructions**: Accepts a task description and returns step-by-step instructions in both Markdown and HTML formats.
- **/create-md**: Accepts a structured JSON object and generates a Markdown file based on the provided structure.

## How It Works
- Uses the [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) package to access Gemini Flash 2.0.
- Converts AI-generated Markdown to HTML using [markdown-it](https://www.npmjs.com/package/markdown-it).
- Built with [Express](https://expressjs.com/) for easy API integration.

## Setup
1. **Clone the repository**
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Set your Gemini API key**:
   - Create a `.env` file in the project root:
     ```env
     GEMINI_API_KEY=your_google_generative_ai_key_here
     ```
   - Or set the environment variable in your shell before starting the server.
4. **Start the server**:
   ```sh
   npm start
   ```

## API Endpoints
### POST `/generate-instructions`
- **Body**: `{ "task": "Describe your task here" }`
- **Response**: `{ "markdown": "...", "html": "..." }`

### POST `/create-md`
- **Body**: `{ "filename": "example.md", "structure": { ... } }`
- **Response**: `{ "message": "Markdown file created", "file": "path/to/file" }`

## Security
- **Never commit your API key to source control.**
- The API key is now loaded from the `GEMINI_API_KEY` environment variable for safety.

## License
Apache 2.0
