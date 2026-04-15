# PTM: Project Technical Memorandum (Profile PDF) Knowledge Base

This document serves as the architectural and technical "Ground Truth" for generating high-fidelity Property and Project Profiles (PTMs) within the Zane-AI ecosystem. It defines the structure, data requirements, and aesthetic standards for the system when building exportable PDF documents.

## 1. Document Architecture

A PTM is divided into five core layers. Every generated PDF MUST respect this hierarchy for consistency across institutional reporting.

### A. The Identity Header (Brand Layer)
*   **Organization Context**: Primary logo of the Developer/Agency.
*   **Project Title**: The official registered name of the property/unit.
*   **Timestamp**: Generation date and "Valid Until" periodicity (for price lists).
*   **Status Badge**: (e.g., *Under Construction, Ready to Move, Sold Out*).

### B. Property Inventory & Geometry (Technical Layer)
*   **Unit Identifier**: Full alphanumeric code (e.g., `ZN-B12-402`).
*   **BUA (Built-Up Area)**: Precise measurement in Sq.m or Sq.ft.
*   **Floor Configuration**: Floor level, total floors, and unit orientation (North/South/East/West).
*   **Feature Matrices**: Count of Bedrooms, Bathrooms, and Maid rooms.

### C. The Structural Blueprint (Specs Layer)
*   **Shell & Core vs. Finished**: Technical description of the delivery state.
*   **Technical Specs**: 
    - HVAC Systems (VRV, Central, Split).
    - Power backup and water storage capacity.
    - Automation Level (Smart-Home ready grade).
*   **Maintenance Regime**: Service charge details and sinking fund allocations.

### D. Legal & Compliance (Trust Layer)
*   **Zoning**: Land Use Code (e.g., *Residential, Commercial, Mixed-Use*).
*   **Permit Logs**: Building permit date and expiration.
*   **Ownership Type**: Freehold vs. Usufruct vs. Leasehold.
*   **Contractual Timelines**: Expected Handover Date (EOH) and Grace Period.

### E. Visual Intelligence (Media Layer)
*   **Hero Visuals**: High-resolution 3D renders or real photography.
*   **Technical Drawings**: Floor plans with scale bars.
*   **Location Maps**: Satellite context with highlighted plot boundaries.

## 2. Aesthetic & Typography Standards (Pure Canvas)

The PTM PDF must inherit the **"Pure Canvas"** design system used in the web workspace.

*   **Color Palette**:
    - **Primary**: `#FF3D00` (Zane-AI Accent) for calls to action and key metrics.
    - **Background**: White (`#FFFFFF`) or Slate-50 (`#F8FAFC`) for subtle sectioning.
    - **Grid Lines**: 1px stroke in Slate-200 for technical boundaries.
*   **Typography**:
    - **Arabic**: **Cairo** (Medium for body text, Black for headings).
    - **English**: **Inter** (Semi-bold for metrics, Regular for specs).
    - **Punctuation**: RTL localized periods and colons.
*   **Metric Display**: 
    - Large "Massive Typography" for key metrics like Total Area or Price.
    - Use strict 8pt grid for tabular data.

## 3. System Generation Rules (AI Context)

When the system is asked to "Build a PTM PDF", it must follow these logic gates:

1.  **Validation**: Ensure all mandatory fields (BUA, Project Name, Status) are fetched from the Convex backend.
2.  **RTL Normalization**: If the language is Arabic, ensure the document root is `dir="rtl"` and that numeric percentage symbols (`%`) and units (`sq.m`) are correctly placed.
3.  **Dynamic Rendering**: If specific sections (e.g., Legal Specs) are missing in the database, the system should NOT leave empty spaces but instead reflow the Bento-grid to maintain a premium look.
4.  **Security**: Every PTM should include a subtle QR code in the footer that links back to the live unit in the Zane-AI workspace for verification.

---
*Created by Zane-AI Intelligence Unit*
