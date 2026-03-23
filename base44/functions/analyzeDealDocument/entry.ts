import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await req.json();
    if (!documentId) {
      return Response.json({ error: 'documentId required' }, { status: 400 });
    }

    // Get the document
    const doc = await base44.entities.DealDocument.get(documentId);
    if (!doc) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    // Mark as analyzing
    await base44.entities.DealDocument.update(documentId, { analysis_status: 'analyzing' });

    // Extract text from the uploaded file
    let extractedText = "";
    try {
      const extraction = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: doc.file_url,
        json_schema: {
          type: "object",
          properties: {
            full_text: { type: "string", description: "The complete text content of the document" },
            key_sections: { type: "array", items: { type: "string" }, description: "Key sections or headings found" }
          }
        }
      });
      if (extraction?.output?.full_text) {
        extractedText = extraction.output.full_text;
      }
    } catch (e) {
      console.error("Extraction error:", e.message);
    }

    // If extraction failed or empty, use file URL directly with LLM
    const fileContext = extractedText
      ? `Document text (first 12000 chars):\n${extractedText.substring(0, 12000)}`
      : `The document file is available at: ${doc.file_url}`;

    const docTypeLabel = doc.document_type?.replace(/_/g, ' ') || 'unknown type';

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a forensic financial analyst specializing in commodity deal fraud detection, with expertise in oil & gas, mining, and agricultural investment schemes. Your mission is to PROTECT INVESTORS from predatory operators and fraudulent deals.

Analyze this ${docTypeLabel} document for "${doc.deal_name || 'Unknown Deal'}" by operator "${doc.operator_name || 'Unknown Operator'}".

${fileContext}

Provide a thorough fraud-focused analysis. Return JSON with:

1. "risk_score": number 1-100 (100 = safest, 1 = extremely dangerous). Be HARSH - most commodity deals have serious issues. Score below 50 for any document with missing disclosures, vague terms, or operator red flags.

2. "risk_grade": "A" (80-100, institutional quality) | "B" (60-79, reasonable with caveats) | "C" (40-59, significant concerns) | "D" (20-39, likely predatory) | "F" (1-19, almost certainly fraudulent)

3. "red_flags": array of specific red flags found. Look for:
   - Unrealistic return promises (>20% in O&G is a red flag)
   - Missing or vague risk disclosures
   - Operator self-dealing or conflicts of interest
   - Excessive management fees or carried interests
   - No third-party reserve reports
   - Pressure tactics or urgency language
   - Missing SEC/state registrations
   - Cost-stuffing indicators
   - Promissory note schemes
   - Missing audited financials
   - Vague use of proceeds
   - No independent escrow

4. "green_flags": array of legitimate positive indicators (third-party audits, registered offerings, independent reserve reports, reasonable fee structures, etc.)

5. "missing_items": critical items that SHOULD be present but are missing

6. "summary": 3-4 sentence executive summary of what this document is and its overall quality

7. "verdict": 2-3 sentence final recommendation. Be direct and protective of the investor. If it looks bad, say so clearly.

8. "operator_flags": any concerns about the operator based on the document's language, structure, or claims. Note if the operator appears legitimate or shows signs of a promotional scheme.

Be AGGRESSIVE in protecting investors. It's better to flag a false positive than to miss actual fraud. The commodity investment space is rife with scams - approach every document with healthy skepticism.`,
      file_urls: extractedText ? undefined : [doc.file_url],
      response_json_schema: {
        type: "object",
        properties: {
          risk_score: { type: "number" },
          risk_grade: { type: "string" },
          red_flags: { type: "array", items: { type: "string" } },
          green_flags: { type: "array", items: { type: "string" } },
          missing_items: { type: "array", items: { type: "string" } },
          summary: { type: "string" },
          verdict: { type: "string" },
          operator_flags: { type: "array", items: { type: "string" } }
        }
      },
      model: "claude_sonnet_4_6"
    });

    // Update document with analysis results
    await base44.entities.DealDocument.update(documentId, {
      analysis_status: 'complete',
      risk_score: analysis.risk_score,
      risk_grade: analysis.risk_grade,
      red_flags: analysis.red_flags || [],
      green_flags: analysis.green_flags || [],
      missing_items: analysis.missing_items || [],
      summary: analysis.summary,
      verdict: analysis.verdict,
      operator_flags: analysis.operator_flags || [],
    });

    return Response.json({ success: true, analysis });
  } catch (error) {
    console.error("Analysis error:", error.message);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
});