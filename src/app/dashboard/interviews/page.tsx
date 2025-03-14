import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Video } from "lucide-react"
import Link from "next/link"

export default function InterviewsPage() {
  // Sample interview data
  const interviews = [
    {
      id: "1",
      title: "Frontend Developer Interview",
      date: "2023-03-15",
      candidate: "John Doe",
      status: "Completed",
    },
    {
      id: "2",
      title: "Backend Developer Interview",
      date: "2023-03-18",
      candidate: "Jane Smith",
      status: "Scheduled",
    },
    {
      id: "3",
      title: "Full Stack Developer Interview",
      date: "2023-03-20",
      candidate: "Alex Johnson",
      status: "Scheduled",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Interviews</h2>
          <p className="text-muted-foreground">Manage your interview sessions</p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/interviews/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Interview
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {interviews.map((interview) => (
          <Card key={interview.id}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <CardTitle className="text-base sm:text-lg">{interview.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {new Date(interview.date).toLocaleDateString()} • {interview.candidate}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      interview.status === "Completed" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  ></span>
                  <span className="text-sm font-medium">{interview.status}</span>
                </div>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`/dashboard/interviews/${interview.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

