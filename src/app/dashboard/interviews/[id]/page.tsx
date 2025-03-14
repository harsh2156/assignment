import { VideoInterview } from "@/app/components/interview/video-interview"

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Interview Session</h2>   
        <p className="text-muted-foreground">Interview ID: {resolvedParams.id}</p>
      </div>

      <VideoInterview interviewId={resolvedParams.id} />
    </div>
  )
}
