import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Database, Table2, FolderOpen } from "lucide-react";

export default function ProjectExplorer({ onTableSelect }) {
  const [projects, setProjects] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [tables, setTables] = useState([]);
  const [schema, setSchema] = useState(null);
  
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  
  const [loading, setLoading] = useState({ projects: true, datasets: false, tables: false, schema: false });

  useEffect(() => {
    (async () => {
      const res = await base44.functions.invoke("queryBigQuery", { action: "listProjects" });
      setProjects(res.data.projects || []);
      setLoading(prev => ({ ...prev, projects: false }));
    })();
  }, []);

  const handleProjectChange = async (projectId) => {
    setSelectedProject(projectId);
    setSelectedDataset("");
    setSelectedTable("");
    setDatasets([]);
    setTables([]);
    setSchema(null);
    setLoading(prev => ({ ...prev, datasets: true }));
    const res = await base44.functions.invoke("queryBigQuery", { action: "listDatasets", projectId });
    setDatasets(res.data.datasets || []);
    setLoading(prev => ({ ...prev, datasets: false }));
  };

  const handleDatasetChange = async (datasetId) => {
    setSelectedDataset(datasetId);
    setSelectedTable("");
    setTables([]);
    setSchema(null);
    setLoading(prev => ({ ...prev, tables: true }));
    const res = await base44.functions.invoke("queryBigQuery", { action: "listTables", projectId: selectedProject, datasetId });
    setTables(res.data.tables || []);
    setLoading(prev => ({ ...prev, tables: false }));
  };

  const handleTableChange = async (tableId) => {
    setSelectedTable(tableId);
    setLoading(prev => ({ ...prev, schema: true }));
    const res = await base44.functions.invoke("queryBigQuery", {
      action: "getSchema",
      projectId: selectedProject,
      datasetId: selectedDataset,
      tableId,
    });
    setSchema(res.data);
    setLoading(prev => ({ ...prev, schema: false }));
    onTableSelect?.({
      projectId: selectedProject,
      datasetId: selectedDataset,
      tableId,
      fields: res.data.fields || [],
      numRows: res.data.numRows,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Project selector */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Project
          </label>
          {loading.projects ? (
            <div className="h-10 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading projects...
            </div>
          ) : (
            <Select value={selectedProject} onValueChange={handleProjectChange}>
              <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.friendlyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Dataset selector */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5" /> Dataset
          </label>
          {loading.datasets ? (
            <div className="h-10 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
            </div>
          ) : (
            <Select value={selectedDataset} onValueChange={handleDatasetChange} disabled={!selectedProject}>
              <SelectTrigger><SelectValue placeholder={selectedProject ? "Select dataset" : "Select project first"} /></SelectTrigger>
              <SelectContent>
                {datasets.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Table selector */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <Table2 className="w-3.5 h-3.5" /> Table
          </label>
          {loading.tables ? (
            <div className="h-10 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
            </div>
          ) : (
            <Select value={selectedTable} onValueChange={handleTableChange} disabled={!selectedDataset}>
              <SelectTrigger><SelectValue placeholder={selectedDataset ? "Select table" : "Select dataset first"} /></SelectTrigger>
              <SelectContent>
                {tables.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.id} ({t.rowCount} rows)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Schema preview */}
      {loading.schema && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading schema...
        </div>
      )}
      {schema && !loading.schema && (
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Table Schema · {schema.numRows} rows
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(schema.fields || []).map(f => (
              <span key={f.name} className="text-[11px] px-2 py-0.5 rounded-md bg-card border border-border font-mono">
                {f.name} <span className="text-muted-foreground">({f.type})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}