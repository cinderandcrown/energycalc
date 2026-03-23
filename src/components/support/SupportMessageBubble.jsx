import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, CheckCircle2, AlertCircle, ChevronRight, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

function ToolCallDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const name = toolCall?.name || "Function";
  const status = toolCall?.status || "pending";
  const results = toolCall?.results;

  const parsedResults = (() => {
    if (!results) return null;
    try { return typeof results === "string" ? JSON.parse(results) : results; } catch { return results; }
  })();

  const isError = results && (
    (typeof results === "string" && /error|failed/i.test(results)) ||
    (parsedResults?.success === false)
  );

  const statusConfig = {
    pending: { icon: Clock, color: "text-slate-400", text: "Pending" },
    running: { icon: Loader2, color: "text-slate-500", text: "Looking up...", spin: true },
    in_progress: { icon: Loader2, color: "text-slate-500", text: "Looking up...", spin: true },
    completed: isError
      ? { icon: AlertCircle, color: "text-red-500", text: "Failed" }
      : { icon: CheckCircle2, color: "text-green-600", text: "Done" },
    success: { icon: CheckCircle2, color: "text-green-600", text: "Done" },
    failed: { icon: AlertCircle, color: "text-red-500", text: "Failed" },
    error: { icon: AlertCircle, color: "text-red-500", text: "Failed" },
  }[status] || { icon: Zap, color: "text-slate-500", text: "" };

  const Icon = statusConfig.icon;
  const formattedName = name.replace(/_/g, " ").replace(/\./g, " ");

  return (
    <div className="mt-1.5 text-[11px]">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all text-muted-foreground",
          "hover:bg-muted/50",
          expanded ? "bg-muted/50 border-border" : "border-transparent"
        )}
      >
        <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
        <span>{formattedName}</span>
        {statusConfig.text && <span className="opacity-60">· {statusConfig.text}</span>}
        {!statusConfig.spin && (toolCall.arguments_string || results) && (
          <ChevronRight className={cn("h-2.5 w-2.5 transition-transform ml-auto", expanded && "rotate-90")} />
        )}
      </button>
      {expanded && !statusConfig.spin && parsedResults && (
        <pre className="ml-2 mt-1 bg-muted/50 rounded-md p-2 text-[10px] text-muted-foreground whitespace-pre-wrap max-h-32 overflow-auto">
          {typeof parsedResults === "object" ? JSON.stringify(parsedResults, null, 2) : parsedResults}
        </pre>
      )}
    </div>
  );
}

export default function SupportMessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-petroleum flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-crude-gold text-[10px] font-bold">EC</span>
        </div>
      )}
      <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
        {message.content && (
          <div className={cn(
            "rounded-2xl px-3.5 py-2.5",
            isUser
              ? "bg-petroleum text-white rounded-br-md"
              : "bg-muted/60 border border-border rounded-bl-md"
          )}>
            {isUser ? (
              <p className="text-sm leading-relaxed">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="text-sm prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                components={{
                  p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="my-0.5">{children}</li>,
                  a: ({ children, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-crude-gold underline">{children}</a>
                  ),
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
        {message.tool_calls?.length > 0 && (
          <div className="space-y-0.5">
            {message.tool_calls.map((tc, idx) => (
              <ToolCallDisplay key={idx} toolCall={tc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}