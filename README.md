# DevReview AI

> AI-powered code review platform that analyzes GitHub repositories and provides intelligent, actionable feedback to help developers write cleaner, safer, and more maintainable code.

DevReview AI is a full-stack developer tool that combines **GitHub**, **Google Gemini**, **Inngest**, **Convex**, **Clerk**, and **Next.js** to create an AI-assisted code review workflow.

Developers can authenticate, connect their GitHub repositories, browse repository files, select source code, and request an AI-powered review. The application analyzes the selected file and provides a structured report containing an overall score, summary, severity levels, findings, recommendations, and code suggestions.

---

## 🚀 Live Demo

> Coming soon
---

# ✨ Features

## 🔐 Authentication

DevReview AI uses **Clerk** for authentication and user management.

Features include:

- Secure user authentication
- Sign-in and sign-up
- Protected application routes
- User profile management
- Clerk + Convex integration
- User-specific review limits

---

## 🐙 GitHub Integration

DevReview AI connects directly with GitHub repositories.

Users can:

- Connect their GitHub account
- View repositories
- Access public and private repositories
- Browse repository file trees
- Select individual source files
- Fetch source code directly from GitHub
- View repository information

Repository information can include:

- Repository name
- Repository visibility
- Primary programming language
- Stars
- Forks
- Last update information

---

# 🤖 AI-Powered Code Review

The core feature of DevReview AI is automated code analysis using **Google Gemini**.

When a developer selects a file and starts a review, the application sends the source code to the AI model for analysis.

The AI evaluates the code for areas such as:

- Bugs
- Code quality
- Best practices
- Performance
- Maintainability
- Security concerns
- Potential improvements

The AI returns structured review information instead of unstructured text.

---

# 📊 Review Results

Each AI review can contain:

### Overall Score

A numerical score representing the overall quality of the reviewed code.

### Summary

A short explanation of the overall state of the code.

### Findings

Individual issues identified by the AI.

Each finding can contain:

- Severity
- Category
- Title
- Description
- Source-code line
- Recommendation
- Suggested improvement

Example:

```json
{
  "score": 85,
  "summary": "The code is generally well structured but contains several areas that could be improved.",
  "findings": [
    {
      "severity": "medium",
      "category": "Best Practices",
      "title": "Missing error handling",
      "description": "The API request does not properly handle failed responses.",
      "line": 23,
      "recommendation": "Add appropriate error handling around the API request.",
      "suggestion": "try { ... } catch (error) { ... }"
    }
  ]
}
