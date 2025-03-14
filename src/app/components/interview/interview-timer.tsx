"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export function InterviewTimer({
  duration,
  onComplete,
}: {
  duration: number // in seconds
  onComplete: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onComplete])

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Determine color based on time left
  const getVariant = () => {
    if (timeLeft < 60) return "destructive" // Less than 1 minute
    if (timeLeft < 300) return "default" // Less than 5 minutes
    return "secondary"
  }

  return (
    <Badge variant={getVariant()}>
      <Clock className="h-3 w-3 mr-1" />
      {formatTime()}
    </Badge>
  )
}

