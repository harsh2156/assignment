"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample questions
const questions = [
  {
    id: "q1",
    type: "multiple-choice",
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Object"],
    correctAnswer: "Float",
  },
  {
    id: "q2",
    type: "text",
    question: "Explain the difference between 'let', 'const', and 'var' in JavaScript.",
  },
  {
    id: "q3",
    type: "multiple-choice",
    question: "Which HTTP method is idempotent?",
    options: ["GET", "POST", "PATCH", "DELETE"],
    correctAnswer: "GET",
  },
  {
    id: "q4",
    type: "checkbox",
    question: "Select all that apply to React hooks:",
    options: [
      "Must be called at the top level of a component",
      "Can be called inside loops",
      "Can be called inside conditions",
      "Can only be used in functional components",
    ],
    correctAnswers: [0, 3],
  },
  {
    id: "q5",
    type: "text",
    question: "Describe a challenging problem you've solved in a previous project.",
  },
]

export function QuestionnaireForm({ interviewId }: { interviewId: string }) {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))

    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))

    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (questionId: string, index: number) => {
    const currentSelections = answers[questionId] || []
    const newSelections = currentSelections.includes(index)
      ? currentSelections.filter((i: number) => i !== index)
      : [...currentSelections, index]

    setAnswers((prev) => ({ ...prev, [questionId]: newSelections }))

    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    questions.forEach((question) => {
      if (!answers[question.id]) {
        newErrors[question.id] = "This question requires an answer"
      } else if (question.type === "text" && answers[question.id].trim() === "") {
        newErrors[question.id] = "Please provide a response"
      } else if (question.type === "checkbox" && answers[question.id].length === 0) {
        newErrors[question.id] = "Please select at least one option"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would submit to an API
      console.log("Submitting answers:", { interviewId, answers })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assessment Submitted</CardTitle>
          <CardDescription>Thank you for completing the assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your assessment has been submitted successfully. The interviewer will review your responses.
            </AlertDescription>
          </Alert>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Your Responses</h3>

            {questions.map((question) => (
              <div key={question.id} className="border-b pb-4">
                <p className="font-medium">{question.question}</p>
                {question.type === "text" ? (
                  <p className="mt-2 text-muted-foreground">{answers[question.id]}</p>
                ) : question.type === "multiple-choice" ? (
                  <p className="mt-2 text-muted-foreground">
                    {(question.options ?? [])[Number.parseInt(answers[question.id])]}
                  </p>
                ) : (
                  <div className="mt-2 space-y-1">
                    {(answers[question.id] || []).map((index: number) => (
                      <p key={index} className="text-muted-foreground">
                        • {(question.options ?? [])[index]}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => (window.location.href = "/dashboard")}>Return to Dashboard</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Form</CardTitle>
        <CardDescription>Please answer all questions to complete the assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label htmlFor={question.id} className="text-base">
                {question.question}
              </Label>

              {question.type === "text" ? (
                <Textarea
                  id={question.id}
                  value={answers[question.id] || ""}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  className={errors[question.id] ? "border-destructive" : ""}
                  rows={4}
                />
              ) : question.type === "multiple-choice" ? (
                <RadioGroup
                  value={answers[question.id]}
                  onValueChange={(value) => handleRadioChange(question.id, value)}
                  className={`space-y-2 ${errors[question.id] ? "border border-destructive rounded-md p-2" : ""}`}
                >
                  {(question.options ?? []).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
                      <Label htmlFor={`${question.id}-${index}`} className="text-sm sm:text-base cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className={`space-y-2 ${errors[question.id] ? "border border-destructive rounded-md p-2" : ""}`}>
                  {(question.options ?? []).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.id}-${index}`}
                        checked={(answers[question.id] || []).includes(index)}
                        onCheckedChange={() => handleCheckboxChange(question.id, index)}
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <Label htmlFor={`${question.id}-${index}`} className="text-sm sm:text-base cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {errors[question.id] && <p className="text-sm text-destructive">{errors[question.id]}</p>}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Assessment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
