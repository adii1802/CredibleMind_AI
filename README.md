# Claim Verification System

A modern fact-checking and claim verification application built with Next.js, Firebase, and Google Genkit AI. This application helps verify claims against internal documents and provides trust scores based on evidence-based analysis.

## Features

- **Claim Verification** - Submit claims for verification against your internal knowledge base
- **AI-Powered Analysis** - Uses Google Genkit AI to analyze and verify claims
- **Trust Scoring** - Automatic trust score calculation based on verification results
- **Real-time Processing** - Live processing of claims with detailed verification feedback
- **Document Search** - Search and reference internal documents for verification
- **Visual Verification Panel** - Interactive UI showing verification progress and results
- **Responsive Design** - Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15.5.9, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend & Database**: Firebase 11.9.1
- **AI/ML**: Google Genkit 1.28.0, @genkit-ai/google-genai
- **Forms**: React Hook Form, Zod validation
- **Visualization**: Recharts for data visualization
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main page with claim verification UI
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── ai/                          # AI/ML flows
│   ├── genkit.ts                # Genkit configuration
│   ├── dev.ts                   # Development server setup
│   └── flows/
│       ├── generate-initial-answer.ts    # Generate verification answers
│       └── verify-claims.ts              # Claim verification logic
├── components/                  # React components
│   ├── VerificationPanel.tsx    # Main verification UI component
│   ├── ClaimText.tsx            # Claim text display
│   ├── ProcessFlow.tsx          # Process flow visualization
│   ├── TrustScoreCounter.tsx    # Trust score display
│   ├── FirebaseErrorListener.tsx # Error handling
│   ├── BackgroundElements.tsx   # Visual elements
│   └── ui/                      # Radix UI component library
├── firebase/                    # Firebase setup and utilities
│   ├── config.ts                # Firebase configuration
│   ├── client-provider.tsx      # Firebase context provider
│   ├── auth/                    # Authentication utilities
│   └── firestore/               # Firestore database utilities
├── hooks/                       # Custom React hooks
│   ├── use-toast.ts
│   ├── use-mobile.tsx
│   └── use-user.tsx
├── lib/                         # Utility functions and helpers
│   ├── trust-score.ts           # Trust score calculation
│   ├── mock-data.ts             # Mock data for testing
│   └── utils.ts                 # General utilities
└── docs/
    ├── blueprint.md             # Project blueprint
    └── backend.json             # Backend configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project and credentials
- Google Genkit API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Firebase and Genkit configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GENKIT_API_KEY=your_genkit_api_key
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`

In a separate terminal, start the Genkit development server:

```bash
npm run genkit:dev
```

Or for watch mode:

```bash
npm run genkit:watch
```

### Building for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## How It Works

1. **User submits a claim** through the verification panel
2. **AI Analysis** - The claim is sent to Genkit AI flows which:
   - Generate an initial answer about the claim
   - Verify the claim against internal documents
   - Extract and analyze key claims
3. **Trust Score Calculation** - A trust score is calculated based on:
   - Evidence found in documents
   - Confidence of verification
   - Number of supporting claims
4. **Results Display** - The verification results are displayed with:
   - Detailed verification breakdown
   - Trust score visualization
   - Document references
   - Claim analysis

## Component Overview

### VerificationPanel
Main component for displaying verification results and claim analysis

### ProcessFlow
Visual representation of the verification process flow

### TrustScoreCounter
Animated counter showing the trust score (0-100)

### ClaimText
Component for displaying and highlighting verified claims

### BackgroundElements
Decorative background elements for visual appeal

## Firebase Integration

The application uses Firebase for:
- **Authentication** - User authentication and management
- **Firestore** - Document storage and verification history
- **Error Handling** - Comprehensive error tracking and reporting

## AI Flows

### Generate Initial Answer
Generates an initial assessment of a claim before detailed verification

### Verify Claims
Main verification flow that:
- Analyzes the claim
- Searches internal documents
- Extracts key claims
- Provides confidence scores

## Contributing

Contributions are welcome! Please ensure:
- Code follows the existing style
- TypeScript types are properly defined
- Components are reusable and well-documented
- All tests pass before submitting PR

## License

This project is part of a Firebase Studio initiative.

## Support

For issues and questions, please refer to the [Firebase Documentation](https://firebase.google.com/docs) and [Genkit Documentation](https://firebase.google.com/docs/genkit).
