import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fileUrl, fileName, fileSizeMb } = await req.json();

  if (!fileUrl) {
    return Response.json({ error: 'fileUrl is required' }, { status: 400 });
  }

  console.log(`[analyzePPM] User ${user.email} analyzing file: ${fileUrl}`);

  // Step 1: Extract text content from the uploaded PDF/document
  const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
    file_url: fileUrl,
    json_schema: {
      type: "object",
      properties: {
        full_text: {
          type: "string",
          description: "The complete text content of the document, preserving all sections, headings, and paragraphs."
        },
        document_title: {
          type: "string",
          description: "The title or name of the document if present"
        },
        page_count_estimate: {
          type: "number",
          description: "Estimated number of pages based on content length"
        }
      }
    }
  });

  if (extractResult.status === "error") {
    console.error(`[analyzePPM] Extraction failed: ${extractResult.details}`);
    return Response.json({ error: 'Failed to extract text from document', details: extractResult.details }, { status: 400 });
  }

  const docText = extractResult.output?.full_text || "";
  const docTitle = extractResult.output?.document_title || "Unknown Document";

  if (!docText || docText.length < 50) {
    return Response.json({ error: 'Could not extract sufficient text from the document. Try a text-based PDF or paste the content directly.' }, { status: 400 });
  }

  console.log(`[analyzePPM] Extracted ${docText.length} characters from "${docTitle}"`);

  // Step 2: Truncate if needed (LLM context limits)
  const maxChars = 60000;
  const truncatedText = docText.length > maxChars
    ? docText.substring(0, maxChars) + "\n\n[...Document truncated at 60,000 characters for analysis...]"
    : docText;

  // Step 3: Run AI analysis
  const analysis = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a securities attorney and oil & gas fraud expert with 30 years of experience analyzing LP programs, Joint Venture agreements, promissory notes, direct participation programs (DPPs), and PPMs.

You are reviewing a document titled: "${docTitle}"

First, identify the DEAL STRUCTURE (Limited Partnership, Joint Venture, Promissory Note, Direct Working Interest, Royalty Purchase, or Other). Then perform a thorough analysis.

For LP deals, specifically check for: excessive GP fee stacking (management, acquisition, drilling supervision, disposition, carry), blind pool provisions, open-ended capital call clauses, waterfall manipulation, and whether LP interests are structured properly.

For JV deals, specifically check for: turnkey price markups vs actual AFE, carried interest imbalances, operator-controlled expenses with no caps or audit rights, non-consent penalty severity (>300% is aggressive), and affiliated-party service company billing.

For Promissory Notes, check for: whether the note is secured or unsecured, registration status, what happens in default, and whether this is really an unregistered security disguised as a note.

Also specifically scan for:
- ALL fee structures (management fees, acquisition fees, drilling supervision fees, overhead charges, disposition fees, carried interests, promotes, overriding royalties)
- Legal disclosures (Reg D exemption type, accredited investor verification, risk factors section, conflicts of interest)
- Revenue distribution waterfalls and payout definitions
- Operator affiliations and related-party transactions
- Capital call provisions and investor obligations
- Exit provisions and liquidity restrictions
- Insurance and indemnification clauses

DOCUMENT TEXT:
"""
${truncatedText}
"""

Return a JSON object with:
- "documentTitle": string (the document title or your best guess)
- "dealStructure": string (the type of deal: "Limited Partnership", "Joint Venture", "Promissory Note", "Direct Working Interest", "Royalty Purchase", or "Other/Unclear")
- "riskScore": number 1-10 (10 = extremely high risk / likely fraud)
- "riskLevel": "low" | "medium" | "high" | "critical"
- "summary": 3-4 sentence plain-English summary of what this document is offering, the deal structure, key economics, and overall quality
- "redFlags": array of objects { flag: string (specific clause or issue found), severity: "low"|"medium"|"high"|"critical", explanation: string, quotedText: string (actual text from the document that triggered this flag, or empty string if not directly quotable) }
- "greenFlags": array of strings (positive indicators found - things done correctly or transparently)
- "missingItems": array of strings (critical items that should be in any legitimate offering of this type but are absent from this document)
- "feeAnalysis": object { totalFeeEstimate: string, fees: array of { name: string, amount: string, assessment: string } } — breakdown of every fee, promote, carry, override found
- "legalDisclosures": object { regDType: string, accreditedVerification: string, riskFactors: string, conflictsOfInterest: string } — assessment of legal compliance
- "keyTerms": array of objects { term: string, value: string } — critical business terms (investment minimum, WI/NRI, payout period, operator carry, etc.)
- "verdict": string (3-4 sentences final verdict on whether to proceed and what to do next — be direct and protect the investor)

Be specific. Quote actual language from the document when citing red flags. Be harsh and direct — this protects real investor money. If the deal structure is unclear, say so and explain why that itself is a red flag.`,
    response_json_schema: {
      type: "object",
      properties: {
        documentTitle: { type: "string" },
        dealStructure: { type: "string" },
        riskScore: { type: "number" },
        riskLevel: { type: "string" },
        summary: { type: "string" },
        redFlags: { type: "array", items: { type: "object", properties: { flag: { type: "string" }, severity: { type: "string" }, explanation: { type: "string" }, quotedText: { type: "string" } } } },
        greenFlags: { type: "array", items: { type: "string" } },
        missingItems: { type: "array", items: { type: "string" } },
        feeAnalysis: { type: "object", properties: { totalFeeEstimate: { type: "string" }, fees: { type: "array", items: { type: "object", properties: { name: { type: "string" }, amount: { type: "string" }, assessment: { type: "string" } } } } } },
        legalDisclosures: { type: "object", properties: { regDType: { type: "string" }, accreditedVerification: { type: "string" }, riskFactors: { type: "string" }, conflictsOfInterest: { type: "string" } } },
        keyTerms: { type: "array", items: { type: "object", properties: { term: { type: "string" }, value: { type: "string" } } } },
        verdict: { type: "string" }
      }
    },
    model: "claude_sonnet_4_6"
  });

  console.log(`[analyzePPM] Analysis complete. Risk: ${analysis.riskLevel} (${analysis.riskScore}/10)`);

  // Save submission to database
  await base44.asServiceRole.entities.PPMSubmission.create({
    document_title: analysis.documentTitle || docTitle,
    file_url: fileUrl,
    file_name: fileName || "unknown",
    file_size_mb: fileSizeMb || 0,
    submission_type: "upload",
    text_length: docText.length,
    deal_structure: analysis.dealStructure || "Unknown",
    risk_score: analysis.riskScore,
    risk_level: analysis.riskLevel,
    red_flag_count: analysis.redFlags?.length || 0,
    green_flag_count: analysis.greenFlags?.length || 0,
    missing_item_count: analysis.missingItems?.length || 0,
    summary: analysis.summary,
    verdict: analysis.verdict,
    full_analysis: analysis,
  });

  console.log(`[analyzePPM] Submission saved to database`);

  return Response.json({
    success: true,
    analysis,
    meta: {
      documentTitle: docTitle,
      textLength: docText.length,
      truncated: docText.length > maxChars,
    }
  });
});