"use client"

import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Settings, User, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Import the sidebarItems to use in the mobile menu
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Video, FileQuestion, Users, BarChart } from "lucide-react"

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
  {
    title: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
]

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[80%] sm:w-[350px]">
          <div className="flex h-16 items-center px-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-primary">Interview App</span>
            </Link>
          </div>
          <div className="py-4 px-2">
            <nav className="grid items-start gap-2 text-sm font-medium">
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
            <div className="mt-6 px-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/interviews/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Interview
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">Interview App</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="icon" className="hidden md:flex" asChild>
          <Link href="/dashboard/interviews/new">
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">New Interview</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

