import { QuestionnaireManager } from "@/app/components/questionnaire/questionnaire-manager"
export default function QuestionnairesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Questionnaires</h2>
        <p className="text-muted-foreground">Manage your assessment questionnaires</p>
      </div>

      <QuestionnaireManager />
    </div>
  )
}

