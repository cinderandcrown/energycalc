import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Megaphone, Plus, Loader2, Copy, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import usePageTitle from "@/hooks/usePageTitle";

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  approved: 'bg-blue-500/15 text-blue-500',
  published: 'bg-drill-green/15 text-drill-green',
  archived: 'bg-muted text-muted-foreground/60',
};

export default function AdminMarketing() {
  usePageTitle("Admin — Marketing");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.MarketingContent.list('-created_date', 50).then(res => {
      setItems(res);
      setLoading(false);
    });
  }, []);

  const copyContent = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const deleteItem = async (id) => {
    await base44.entities.MarketingContent.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
    toast({ title: 'Deleted' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary dark:text-accent" />
            Marketing Content
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} content pieces</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No Marketing Content</h3>
          <p className="text-sm text-muted-foreground">Use the Marketing Content AI agent to generate content.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4 hover:border-crude-gold/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">{item.content_type}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{item.platform}</Badge>
                    <Badge className={`text-[10px] border-0 ${statusColors[item.status] || statusColors.draft}`}>{item.status}</Badge>
                    {item.campaign_theme && <Badge variant="outline" className="text-[10px]">{item.campaign_theme}</Badge>}
                  </div>
                  {item.headline && <p className="text-sm font-semibold text-foreground mb-1">{item.headline}</p>}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.content}</p>
                  {item.cta && <p className="text-xs text-primary dark:text-accent mt-1.5 font-medium">CTA: {item.cta}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => copyContent(item.content)}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}