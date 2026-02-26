# **App Name**: CredibleMind AI

## Core Features:

- AI Writer Response Generation: Users submit a question, and an AI Writer tool generates a comprehensive initial answer for subsequent verification.
- AI Editor Verification Tool: An AI Editor tool meticulously analyzes the Writer's response, breaks it into atomic claims, and uses Retrieval-Augmented Generation (RAG) with internal documents to fact-check and classify each claim as 'verified,' 'partially supported,' or 'unsupported.'
- Dynamic Trust Score Calculation: The system dynamically calculates and updates an overall Trust Score for the AI-generated answer based on the ratio of verified claims, the strength of supporting evidence, and predefined domain risk levels.
- Interactive Claim Highlighting: The user interface displays the AI-generated answer with claims visually highlighted: green for verified claims and red for unsupported or partially supported claims, for immediate feedback.
- Transparent Evidence Linking: Each claim is presented with clickable links that directly lead to the supporting or refuting evidence extracted from internal documents, ensuring full explainability and transparency.
- Firestore Data Persistence: All application data, including user queries, AI-generated answers, extracted claims, their verification statuses, evidence pointers, and calculated Trust Scores, are securely stored in Firestore.
- Real-time Frontend Updates: Leverages Firestore listeners to provide instant, real-time updates to the frontend, allowing users to observe the claim verification process and Trust Score calculation as they happen.

## Style Guidelines:

- Primary color: #336699 (reliable blue).
- Background color: #F0F2F4 (light and airy cool grey-blue).
- Accent color: #52E0E0 (vibrant cyan for highlighting).
- Highlight color for verified claims: Green.
- Highlight color for unsupported claims: Red.
- Highlight color for partially supported claims: Orange (optional).
- Headlines use 'Space Grotesk' (sans-serif) for a modern, techy aesthetic and clear readability.
- Body text, claims, and evidence snippets use 'Inter' (sans-serif) for optimal clarity and comfortable reading of longer informational content.
- Main layout includes a Header, Question Input Section, Main Answer Panel (with highlighted claims), Right Sidebar (displaying Trust Score, Verification Stats, and Risk Level), and an Evidence Drawer that appears on click.
- Ample whitespace is used throughout to ensure readability and ease of comprehension, consistent with a professional 'newsroom' aesthetic.
- Subtle fade-in animation for claim highlighting.
- Number counter animation for the Trust Score.
- Smooth transition animations for status updates (e.g., 'Generating…', 'Verifying…', 'Complete').
- Animations are professional, calm, and transparent, avoiding aggressive popups.