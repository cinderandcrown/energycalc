import { useState } from "react";
import { motion } from "framer-motion";
import { Database, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageHeader from "@/components/mobile/PageHeader";
import ProjectExplorer from "@/components/bigquery/ProjectExplorer";
import QueryRunner from "@/components/bigquery/QueryRunner";
import ResultsTable from "@/components/bigquery/ResultsTable";
import TrendChart from "@/components/bigquery/TrendChart";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import usePageTitle from "@/hooks/usePageTitle";

export default function BigQueryExplorer() {
  usePageTitle("BigQuery Explorer");
  const [selectedTable, setSelectedTable] = useState(null);
  const [queryResults, setQueryResults] = useState(null);

  const defaultQuery = selectedTable
    ? `SELECT * FROM \`${selectedTable.projectId}.${selectedTable.datasetId}.${selectedTable.tableId}\` LIMIT 100`
    : "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-petroleum via-[#0e2f55] to-[#1a3a6b]" />
        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-crude-gold" />
            <span className="text-crude-gold/80 text-[10px] font-bold uppercase tracking-[0.2em]">BigQuery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Data Explorer
          </h1>
          <p className="text-white/60 text-sm mt-1.5 max-w-lg leading-relaxed">
            Browse your Google BigQuery datasets, run SQL queries, and visualize net investment trends by asset class.
          </p>
        </div>
      </motion.div>

      {/* Project / Dataset / Table Explorer */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-crude-gold" />
          Select Data Source
        </h2>
        <ProjectExplorer onTableSelect={setSelectedTable} />
      </div>

      {/* Query & Results */}
      {selectedTable && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Tabs defaultValue="query" className="space-y-4">
            <TabsList className="w-full grid grid-cols-2 h-auto gap-1 p-1">
              <TabsTrigger value="query" className="text-xs py-2.5 gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Query & Table
              </TabsTrigger>
              <TabsTrigger value="chart" className="text-xs py-2.5 gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Trend Chart
              </TabsTrigger>
            </TabsList>

            <TabsContent value="query" className="space-y-4 mt-0">
              <div className="rounded-2xl border border-border bg-card p-5">
                <QueryRunner
                  projectId={selectedTable.projectId}
                  defaultQuery={defaultQuery}
                  onResults={setQueryResults}
                />
              </div>
              {queryResults && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <ResultsTable results={queryResults} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="chart" className="mt-0">
              {queryResults ? (
                <TrendChart results={queryResults} />
              ) : (
                <div className="rounded-2xl border border-border bg-card p-10 text-center">
                  <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Run a query first to visualize trends.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Include a date column and numeric columns for the best chart.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      <DisclaimerFooter />
    </div>
  );
}