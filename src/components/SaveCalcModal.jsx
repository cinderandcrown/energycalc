import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

export default function SaveCalcModal({ open, onClose, calcType, inputs, results }) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.Calculation.create({
      calc_type: calcType,
      name: name.trim(),
      notes,
      inputs,
      results,
      is_favorite: false,
    }),
    onMutate: () => {
      setSaving(true);
      toast({ title: "Calculation saved!", description: `"${name}" has been saved to My Scenarios.` });
      onClose();
      setName("");
      setNotes("");
    },
    onSettled: () => setSaving(false),
  });

  const handleSave = () => {
    if (!name.trim()) return;
    saveMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5 text-primary dark:text-accent" />
            Save Calculation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="calc-name">Name *</Label>
            <Input
              id="calc-name"
              placeholder="e.g. Permian Basin Well #3 — Optimistic"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="calc-notes">Notes (optional)</Label>
            <Textarea
              id="calc-notes"
              placeholder="Any notes about this calculation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 h-20 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim() || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}