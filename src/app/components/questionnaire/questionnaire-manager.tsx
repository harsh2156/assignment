"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"

// Sample questions for each category
const initialQuestions = {
  general: [
    { id: "g1", text: "Tell us about your experience with JavaScript frameworks." },
    { id: "g2", text: "What are your strengths and weaknesses as a developer?" },
    { id: "g3", text: "Describe a challenging project you worked on and how you overcame obstacles." },
  ],
  video: [
    { id: "v1", text: "Introduce yourself and your background in software development.", duration: 60 },
    { id: "v2", text: "Explain a complex technical concept you're familiar with.", duration: 120 },
  ],
  multipleChoice: [
    {
      id: "mc1",
      text: "Which of the following is NOT a JavaScript framework?",
      options: ["React", "Angular", "Vue", "Java"],
    },
    {
      id: "mc2",
      text: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Automated Program Integration",
        "Application Process Integration",
        "Advanced Programming Interface",
      ],
    },
  ],
}

export function QuestionnaireManager() {
  const [questionType, setQuestionType] = useState("general")
  const [questions, setQuestions] = useState(initialQuestions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    duration: 60,
    options: ["", "", "", ""],
  })

  const handleAddQuestion = () => {
    if (newQuestion.text.trim() === "") return

    const newId = `${questionType.charAt(0)}${Date.now()}`

    if (questionType === "general") {
      setQuestions((prev) => ({
        ...prev,
        general: [...prev.general, { id: newId, text: newQuestion.text }],
      }))
    } else if (questionType === "video") {
      setQuestions((prev) => ({
        ...prev,
        video: [
          ...prev.video,
          {
            id: newId,
            text: newQuestion.text,
            duration: newQuestion.duration,
          },
        ],
      }))
    } else if (questionType === "multipleChoice") {
      // Filter out empty options
      const filteredOptions = newQuestion.options.filter((opt) => opt.trim() !== "")

      if (filteredOptions.length < 2) {
        alert("Please provide at least 2 options for multiple choice questions")
        return
      }

      setQuestions((prev) => ({
        ...prev,
        multipleChoice: [
          ...prev.multipleChoice,
          {
            id: newId,
            text: newQuestion.text,
            options: filteredOptions,
          },
        ],
      }))
    }

    // Reset form
    setNewQuestion({
      text: "",
      duration: 60,
      options: ["", "", "", ""],
    })

    setIsDialogOpen(false)
  }

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion((prev) => {
      const newOptions = [...prev.options]
      newOptions[index] = value
      return { ...prev, options: newOptions }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Types</CardTitle>
          <CardDescription>Select the type of questions you want to manage</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={questionType} onValueChange={setQuestionType} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="general" id="general" />
              <Label htmlFor="general" className="cursor-pointer">
                General Questions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video" id="video" />
              <Label htmlFor="video" className="cursor-pointer">
                Video Questions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multipleChoice" id="multipleChoice" />
              <Label htmlFor="multipleChoice" className="cursor-pointer">
                Multiple-Choice Questions
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>
              {questionType === "general"
                ? "General Questions"
                : questionType === "video"
                  ? "Video Questions"
                  : "Multiple-Choice Questions"}
            </CardTitle>
            <CardDescription>
              {questionType === "general"
                ? "Text-based questions for candidates to answer"
                : questionType === "video"
                  ? "Questions for video responses"
                  : "Questions with predefined answer options"}
            </CardDescription>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogDescription>
                  Create a new{" "}
                  {questionType === "general" ? "general" : questionType === "video" ? "video" : "multiple-choice"}{" "}
                  question
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion((prev) => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter your question here..."
                  />
                </div>

                {questionType === "video" && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Response Time (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min={10}
                      max={300}
                      value={newQuestion.duration}
                      onChange={(e) =>
                        setNewQuestion((prev) => ({
                          ...prev,
                          duration: Number.parseInt(e.target.value) || 60,
                        }))
                      }
                    />
                  </div>
                )}

                {questionType === "multipleChoice" && (
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    {newQuestion.options.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="mt-2"
                      />
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleAddQuestion} className="w-full sm:w-auto">
                  Add Question
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {questionType === "general" &&
              questions.general.map((question) => (
                <div
                  key={question.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b pb-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">{question.text}</p>
                  </div>
                  <Button variant="outline" size="sm" className="self-end sm:self-start shrink-0">
                    Edit
                  </Button>
                </div>
              ))}

            {questionType === "video" &&
              questions.video.map((question) => (
                <div
                  key={question.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b pb-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">{question.text}</p>
                    <p className="text-sm text-muted-foreground">Response time: {question.duration} seconds</p>
                  </div>
                  <Button variant="outline" size="sm" className="self-end sm:self-start shrink-0">
                    Edit
                  </Button>
                </div>
              ))}

            {questionType === "multipleChoice" &&
              questions.multipleChoice.map((question) => (
                <div
                  key={question.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b pb-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">{question.text}</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {question.options.map((option, index) => (
                        <li key={index}>• {option}</li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" className="self-end sm:self-start shrink-0">
                    Edit
                  </Button>
                </div>
              ))}

            {((questionType === "general" && questions.general.length === 0) ||
              (questionType === "video" && questions.video.length === 0) ||
              (questionType === "multipleChoice" && questions.multipleChoice.length === 0)) && (
              <div className="text-center py-8 text-muted-foreground">
                No questions added yet. Click "Add Question" to create one.
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full">
              Add Externally
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

