import { BookOpen, Tag as TagIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { ArticleMeta } from '@shared/types';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function NavigationSidebar() {
  const { data: articles } = useQuery<ArticleMeta[]>({ queryKey: ['/api/articles'] });
  const categories = Array.from(new Set((articles ?? []).map(a => a.category)));
  const tagCounts: Record<string, number> = {};
  (articles ?? []).forEach(a => {
    (a.tags ?? []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  const [location] = useLocation();

  return (
    <SidebarProvider defaultOpen={false} className="fixed inset-y-0 left-0 z-40">
      <Sidebar className="bg-black/90 border-r border-white/10" collapsible="offcanvas">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase text-gray-400 px-2">Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map(cat => (
                  <SidebarMenuItem key={cat}>
                    <Link href={`/category/${encodeURIComponent(cat)}`}>
                      <SidebarMenuButton isActive={location === `/category/${cat}`} className="text-gray-300">
                        <BookOpen className="w-4 h-4" />
                        <span>{cat}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {topTags.length > 0 && (
            <>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs uppercase text-gray-400 px-2">Top Tags</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {topTags.map(tag => (
                      <SidebarMenuItem key={tag}>
                        <Link href={`/tag/${encodeURIComponent(tag)}`}>
                          <SidebarMenuButton isActive={location === `/tag/${tag}`} className="text-gray-300">
                            <TagIcon className="w-4 h-4" />
                            <span>#{tag}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          )}
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger className="absolute top-4 right-[-1.75rem] rounded-full bg-black/80 text-primary border border-white/10 hover:bg-black" />
    </SidebarProvider>
  );
}
