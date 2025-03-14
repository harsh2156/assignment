"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, FileQuestion, Home, Users, Video, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Interviews",
    href: "/dashboard/interviews",
    icon: Video,
  },
  {
    title: "Questionnaires",
    href: "/dashboard/questionnaires",
    icon: FileQuestion,
  },
//   {
//     title: "Candidates",
//     href: "/dashboard/candidates",
//     icon: Users,
//   },
//   {
//     title: "Analytics",
//     href: "/dashboard/analytics",
//     icon: BarChart,
//   },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-full w-[240px] flex-col border-r bg-background">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname === item.href && "bg-muted text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button className="w-full justify-start" asChild>
          <Link href="/dashboard/interviews/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Interview
          </Link>
        </Button>
      </div>
    </div>
  )
}

