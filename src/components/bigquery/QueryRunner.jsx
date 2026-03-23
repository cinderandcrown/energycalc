import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2 } from "lucide-react";

export default function QueryRunner({ projectId, defaultQuery, onResults }) {
  const [query, setQuery] = useState(defaultQuery || "");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  const runQuery = async () => {
    if (!query.trim() || !projectId) return;
    setRunning(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("queryBigQuery", {
        action: "runQuery",
        projectId,
        query: query.trim(),
      });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        onResults?.(res.data);
      }
    } catch (e) {
      setError(e.message);
    }
    setRunning(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
          SQL Query
        </label>
        <Textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="SELECT * FROM `project.dataset.table` LIMIT 100"
          className="font-mono text-xs min-h-[100px]"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={runQuery} disabled={running || !projectId || !query.trim()} className="gap-1.5">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? "Running..." : "Run Query"}
        </Button>
        {error && (
          <p className="text-xs text-flare-red">{error}</p>
        )}
      </div>
    </div>
  );
}