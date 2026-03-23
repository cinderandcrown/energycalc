import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ResultsTable({ results }) {
  if (!results || !results.rows?.length) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">{results.totalRows} total rows</Badge>
        <Badge variant="outline" className="text-xs">{results.rows.length} returned</Badge>
      </div>
      <div className="rounded-lg border border-border overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              {results.fields.map(f => (
                <TableHead key={f} className="text-xs font-mono whitespace-nowrap">{f}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.rows.map((row, i) => (
              <TableRow key={i}>
                {results.fields.map(f => (
                  <TableCell key={f} className="text-xs font-mono whitespace-nowrap">
                    {row[f] ?? <span className="text-muted-foreground">null</span>}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}