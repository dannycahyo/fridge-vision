### **Technical Requirement Document (TRD): FridgeVision AI**

**Version:** 1.0
**Date:** September 26, 2025
**Related PRD:** 1.0
**Author:** dannydwicahyono

---

### 1. Introduction

This document outlines the technical specifications, architecture, and implementation details for the **FridgeVision AI** project. It translates the product requirements defined in the PRD into a technical plan for development.

---

You're absolutely right\! That's a much cleaner and more modern approach. Using React Router's `action` function is a perfect way to handle this. It keeps your logic colocated with your route and avoids the need for a separate API endpoint, simplifying the architecture.

Here are the adjusted sections of the TRD to reflect this server-side approach.

---

### 2. System Architecture

The application will be a server-rendered React app that leverages React Router's server-side capabilities for data mutations. The object detection will still run client-side in the browser, but the secure call to the Gemini API will be handled by a server-side `action` function.

**Updated Data Flow:**

1.  **Client (React App):** Captures an image and runs the TensorFlow.js model to detect ingredients.
2.  **Client (React Form):** The user confirms the ingredient list and submits it using a `<Form>` component from React Router. This sends the data to the server-side `action` associated with the route.
3.  **Server (React Router `action`):** The `action` function, running on the server, receives the ingredient list from the form submission.
4.  **Server -\> Gemini API:** The `action` securely accesses the `VITE_GEMINI_API_KEY` from server environment variables and calls the Gemini API.
5.  **Server -\> Client:** The `action` returns the generated recipe data.
6.  **Client (React Component):** The component uses the `useActionData` hook to access the recipe and display it to the user.

---

### 3. Technology Stack

| Category                     | Technology                                  | Purpose                                               |
| :--------------------------- | :------------------------------------------ | :---------------------------------------------------- | --- | --------------------- | ---------------------------------- | -------------------------------------------------- |
| **Frontend Framework**       | React                                       | Core UI library for building components.              |
| **Routing & Data Mutations** | React Router (`<Form>`, `action`, `loader`) | Manages navigation and server-side data handling.     |
| **Styling**                  | Tailwind CSS                                | Utility-first CSS framework for rapid styling.        |
| **UI Components**            | Shadcn/ui                                   | Pre-built, accessible components.                     |
| **Camera Access**            | `react-webcam`                              | A React component to easily access the device camera. |
| **Object Detection**         | Google Vision API                           | To identify ingredients with high accuracy.           | \n  | **Recipe Generation** | Google Gemini AI (`@google/genai`) | To generate recipes based on detected ingredients. |

---

### 4. Key Technical Components & Specifications (Adjusted Section)

#### 4.4. Gemini API Integration (via React Router Action)

The integration with the Gemini API will be handled securely on the server using a React Router `action` function.

- **Security:** The Gemini API key will be stored as an environment variable (`VITE_GEMINI_API_KEY`) accessible **only on the server**. The client will never have access to it.
- **Client-Side Form:** The React component will use React Router's `<Form>` component to submit the ingredients. This provides progressive enhancement and a cleaner data flow than a manual `fetch` call.

  ```jsx
  import { Form, useNavigation } from 'react-router-dom';

  // Inside your component...
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  <Form method="post">
    {/* Hidden input to pass the ingredients list */}
    <input
      type="hidden"
      name="ingredients"
      value={detectedIngredients.join(',')}
    />
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Generating...' : 'Generate Recipe'}
    </Button>
  </Form>;
  ```

- **Prompt Engineering:** The server-side `action` will construct a detailed prompt to ensure a consistently formatted response from the Gemini API (the prompt example from the previous TRD remains the same).

---

### 5. React Router Action Function Design

This section replaces the previous "API Design" section.

The core server-side logic will be contained within an `action` function exported from the route module (e.g., `routes/index.jsx`).

- **Trigger:** A `POST` request initiated by the `<Form>` component.
- **Input:** The `action` function receives a `Request` object. The ingredients list is extracted from the form data.
- **Implementation Example:**

  ```jsx
  // In your route file (e.g., routes/index.jsx)
  import { json } from 'react-router-dom';

  export async function action({ request }) {
    try {
      const formData = await request.formData();
      const ingredients = formData.get('ingredients').split(',');

      if (!ingredients || ingredients.length === 0) {
        return json(
          { error: 'No ingredients provided.' },
          { status: 400 },
        );
      }

      // Construct the prompt for Gemini
      const prompt = `You are a creative chef... Create a recipe using: ${ingredients.join(', ')}. Format your response EXACTLY as follows...`;

      // Securely call the Gemini API on the server
      const geminiResponse = await callGeminiAPI(
        prompt,
        process.env.VITE_GEMINI_API_KEY,
      );

      // Return the recipe data to the component
      return json({ recipe: geminiResponse });
    } catch (error) {
      console.error('Action Error:', error);
      return json(
        { error: 'Failed to generate recipe.' },
        { status: 500 },
      );
    }
  }
  ```

- **Output:** The `action` returns a `Response` object (created via the `json` helper). The React component will then access this data using the `useActionData()` hook to display either the recipe or an error message.

### 6. Performance & Error Handling

- **Performance:**
  - The TensorFlow.js model will be loaded asynchronously with a visible loading indicator.
  - The Gemini API call will also have a clear loading state in the UI to manage user expectations.
- **Error Handling:** The application must gracefully handle the following scenarios:
  - **Camera Permission Denied:** Display a clear message guiding the user to enable camera permissions in their browser settings.
  - **Model Load Failure:** Show an error message and a button to retry loading the model.
  - **No Ingredients Detected:** Display a message like "Couldn't see any ingredients. Try getting a clearer shot\!"
  - **Gemini API Failure:** If the `/api/generate-recipe` call fails, show a generic error message and a button to try again.
