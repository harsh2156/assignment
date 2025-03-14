export type ValidationRule = {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    validate?: (value: string) => boolean | string
  }
  
  export type ValidationErrors = {
    [key: string]: string
  }
  
  export function validateField(value: string, rules: ValidationRule): string | null {
    if (rules.required && !value) {
      return "This field is required"
    }
  
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`
    }
  
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`
    }
  
    if (rules.pattern && !rules.pattern.test(value)) {
      return "Invalid format"
    }
  
    if (rules.validate) {
      const result = rules.validate(value)
      if (typeof result === "string") {
        return result
      }
      if (result === false) {
        return "Invalid value"
      }
    }
  
    return null
  }
  
  export function validateForm(
    values: { [key: string]: string },
    rules: { [key: string]: ValidationRule },
  ): ValidationErrors {
    const errors: ValidationErrors = {}
  
    Object.keys(rules).forEach((key) => {
      const error = validateField(values[key], rules[key])
      if (error) {
        errors[key] = error
      }
    })
  
    return errors
  }
  
  export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  export const passwordStrengthPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  
  export function validatePasswordStrength(password: string): string | null {
    if (!password) return null
  
    const checks = [
      { test: password.length >= 8, message: "at least 8 characters" },
      { test: /[A-Z]/.test(password), message: "an uppercase letter" },
      { test: /[a-z]/.test(password), message: "a lowercase letter" },
      { test: /\d/.test(password), message: "a number" },
      { test: /[@$!%*?&]/.test(password), message: "a special character" },
    ]
  
    const failedChecks = checks.filter((check) => !check.test)
  
    if (failedChecks.length === 0) return null
  
    return `Password must contain ${failedChecks.map((c) => c.message).join(", ")}`
  }
  
  