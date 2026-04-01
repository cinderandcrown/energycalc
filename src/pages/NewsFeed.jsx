import NewsFeed from "@/components/news/NewsFeed";
import usePageTitle from "@/hooks/usePageTitle";

export default function NewsFeedPage() {
  usePageTitle("Commodity News Feed");
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <NewsFeed />
    </div>
  );
}