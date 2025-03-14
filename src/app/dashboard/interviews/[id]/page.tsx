import { VideoInterview } from "@/app/components/interview/video-interview"
import { JSX } from "react"

interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function InterviewPage({ params }: PageProps): Promise<JSX.Element> {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Interview Session</h2>
        <p className="text-muted-foreground">Interview ID: {params.id}</p>
      </div>

      <VideoInterview interviewId={params.id} />
    </div>
  )
}
