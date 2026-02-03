## Relevant Files

## Relevant Files

- `backend/src/services/ai-service.js` - Service to communicate with External AI Provider.
- `backend/src/routes/chatbot.js` - API route handler for chatbot interactions.
- `frontend/src/components/Chatbot.jsx` - Main React component for the chat interface.
- `frontend/src/pages/Materias.jsx` - Subject detail page where chatbot will be integrated.
- `tasks/prd.md` - Product Requirements Document reference.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Ensure Ollama is running locally during development and testing.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 1.0 Setup Backend Services (Google Gemini Integration)
  - [x] 1.1 Install Google AI SDK (`@google/generative-ai`).
  - [x] 1.2 Get API Key from [Google AI Studio](https://aistudio.google.com/) and add to `backend/.env` as `GEMINI_API_KEY`.
  - [x] 1.3 Create `backend/src/services/ai-service.js` to handle Gemini API requests.

- [x] 2.0 Implement Backend API (Context & Endpoint)
  - [x] 2.1 Create `backend/src/routes/chatbot.js`.
  - [x] 2.2 Implement `POST /:subjectId/ask` endpoint structure.
  - [x] 2.3 Implement logic to fetch Syllabus and Notes from Database for the given `subjectId`.
  - [x] 2.4 Construct the System Prompt: "You are an academic assistant... Answer ONLY based on the following context...".
  - [x] 2.5 Integrate `aiService.generateResponse` to get the answer from Gemini.
  - [x] 2.6 Register the new route in `backend/src/index.js`.

  - [x] 6.3 Deploy Frontend (Pages) via GitHub Push / Wrangler Deploy (Fixed API URL)Interface
- [x] 3.0 Develop Frontend Chat Interface
  - [x] 3.1 Create `frontend/src/components/Chatbot.css` for chat UI styles.
  - [x] 3.2 Create `frontend/src/components/Chatbot.jsx`.
    - [x] 3.2.1 Implement UI: Chat window, Minimize/Expand button, Message list, Input field.
    - [x] 3.2.2 Implement functionality: Send message, Display loading state, Display User/Bot messages.
  - [x] 3.3 Add API call method in `frontend/src/services/api.js` (or local fetch) to hit the backend endpoint.

- [x] 4.0 Integrate Chatbot into Study Platform
  - [x] 4.1 Update `frontend/pages/Chatbot.jsx` to use the `Chatbot` component.
  - [x] 4.2 Add logic to select a Subject (Materia) context within the page.
  - [x] 4.3 Ensure the page layout matches the design system.
  - [x] 4.4 Redesign UI to match clean white theme (User Feedback).

- [ ] 5.0 Testing & Documentation
  - [ ] 5.1 Manual Test: Ask a question strictly related to a syllabus topic. Verify correct answer.
  - [ ] 5.2 Manual Test: Ask a question unrelated (e.g., "General knowledge"). Verify refusal.
  - [ ] 5.3 Manual Test: Verify behavior when Ollama is offline (Graceful error message).
  - [ ] 5.4 Update `README.md` with instructions on how to run the Chatbot (Ollama requirements).
