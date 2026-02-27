# CredibleMind AI: Query Capability Guide

The model is optimized to verify claims against the internal "Vector Database" (mocked in `src/lib/mock-data.ts`). Below are the types of queries you can ask:

### 1. Quantitative Financial Queries
*   **Example:** "Did the company grow by 20% in 2024?"
*   **Verification Path:** Maps to the Q4 Financial Report.
*   **Likely Result:** *Verified* (Matches 22% growth).

### 2. Strategic Roadmap Queries
*   **Example:** "Are we releasing the new AI engine in early 2025?"
*   **Verification Path:** Maps to Product Specs V3.
*   **Likely Result:** *Verified* (Scheduled for March 2025).

### 3. Sustainability & Ethics Queries
*   **Example:** "Have we planted over 2 million trees?"
*   **Verification Path:** Maps to Reforestation Project.
*   **Likely Result:** *Unsupported* (Actual number is 1.45 million).

### 4. Privacy & Compliance Queries
*   **Example:** "Is our AI compliant with the EU AI Act?"
*   **Verification Path:** Maps to Legal/Privacy documents.
*   **Likely Result:** *Verified*.

### 5. Multi-Domain Complex Queries
*   **Example:** "Analyze our financial health and environmental impact."
*   **Verification Path:** Cross-references Finance and ESG documents.
*   **Likely Result:** *Mixed* (Separate claims will be extracted for each domain).
