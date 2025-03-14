"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import { InterviewTimer } from "./interview-timer"
import { QuestionnaireForm } from "../questionnaire/questionnaire-form"

export function VideoInterview({ interviewId }: { interviewId: string }) {
  const [isStarted, setIsStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [activeTab, setActiveTab] = useState("video")
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Mock remote video with a placeholder
  useEffect(() => {
    if (isStarted && remoteVideoRef.current) {
      // In a real app, this would be a WebRTC connection
      remoteVideoRef.current.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      remoteVideoRef.current.muted = true // Mute for demo purposes
      remoteVideoRef.current.play().catch((e) => console.error("Error playing remote video:", e))
    }
  }, [isStarted])

  // Handle local video stream
  useEffect(() => {
    if (!isStarted) return

    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: !isVideoOff,
          audio: !isMuted,
        })

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        return stream
      } catch (err) {
        console.error("Error accessing media devices:", err)
      }
    }

    let localStream: MediaStream | undefined
    getMedia().then((stream) => {
      localStream = stream
    })

    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isStarted, isMuted, isVideoOff])

  const toggleMute = () => {
    setIsMuted(!isMuted)

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted // Toggle to opposite of current state
      })
    }
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff // Toggle to opposite of current state
      })
    }
  }

  const startInterview = () => {
    setIsStarted(true)
  }

  const endInterview = () => {
    setIsStarted(false)
    setActiveTab("questionnaire")
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video">Video Interview</TabsTrigger>
          <TabsTrigger value="questionnaire">Assessment Form</TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4">
          {!isStarted ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-xl font-semibold mb-4">Ready to start the interview?</h3>
                <p className="text-muted-foreground mb-6">Make sure your camera and microphone are working properly.</p>
                <Button onClick={startInterview}>Start Interview</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <video ref={remoteVideoRef} className="h-full w-full object-cover" playsInline autoPlay />
                    <div className="absolute top-2 right-2">
                      <InterviewTimer duration={30 * 60} onComplete={endInterview} />
                    </div>
                    <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded text-sm">
                      Candidate
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <video ref={localVideoRef} className="h-full w-full object-cover" playsInline autoPlay muted />
                    <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded text-sm">
                      You (Interviewer)
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleMute}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                >
                  {isMuted ? <MicOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
                </Button>
                <Button
                  variant={isVideoOff ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleVideo}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                >
                  {isVideoOff ? (
                    <VideoOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
                <Button variant="destructive" onClick={endInterview} className="px-4 sm:px-6">
                  End Interview
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="questionnaire">
          <QuestionnaireForm interviewId={interviewId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

