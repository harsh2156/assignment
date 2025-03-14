"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { validateForm, emailPattern, validatePasswordStrength } from "@/app/lib/form-validation"
import Link from "next/link"
import { Github, Loader2, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const { register } = useAuth()
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Wrap the validatePasswordStrength so that it returns true if the password is valid.
  const passwordValidation = (value: string) => {
    const result = validatePasswordStrength(value)
    return result === null ? true : result
  }

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
    },
    email: {
      required: true,
      pattern: emailPattern,
    },
    password: {
      required: true,
      validate: passwordValidation,
    },
    confirmPassword: {
      required: true,
      validate: (value: string) => value === formValues.password || "Passwords do not match",
    },
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    const newErrors = validateForm(formValues, validationRules)
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      try {
        await register(formValues.name, formValues.email, formValues.password)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setRegisterError(error.message)
        } else {
          setRegisterError("Registration failed. Please try again.")
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would redirect to the OAuth provider
    alert(`Register with ${provider} would happen here`)
  }

  return (
    <div className="space-y-4">
      {registerError && (
        <Alert variant="destructive">
          <AlertDescription>{registerError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formValues.name}
            onChange={handleChange}
            className={errors.name ? "border-destructive" : ""}
            autoComplete="name"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formValues.email}
            onChange={handleChange}
            className={errors.email ? "border-destructive" : ""}
            autoComplete="email"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formValues.password}
              onChange={handleChange}
              className={errors.password ? "border-destructive pr-10" : "pr-10"}
              autoComplete="new-password"
            />
            <Button
              variant="ghost"
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formValues.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
              autoComplete="new-password"
            />
            <Button
              variant="ghost"
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => handleSocialLogin("Google")}
          className="h-10 px-2 sm:px-4"
        >
          <svg className="mr-1 sm:mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-xs sm:text-sm">Google</span>
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => handleSocialLogin("GitHub")}
          className="h-10 px-2 sm:px-4"
        >
          <Github className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="text-xs sm:text-sm">GitHub</span>
        </Button>
      </div>

      <div className="text-center text-xs sm:text-sm">
        Already have an account?{" "}
        <Link href="/" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
