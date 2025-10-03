import React from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { signupSchema } from '../../utils/validation'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../utils/constants'
import type { SignupCredentials } from '../../types/auth.types'

const SignupForm: React.FC = () => {
  const navigate = useNavigate()
  const { signup, isLoading } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupCredentials>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignupCredentials) => {
    try {
      await signup(data)
      navigate(ROUTES.HOME)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed'
      setError('root', { message })
    }
  }

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Paper className="max-w-md w-full p-8 space-y-6">
        <Box className="text-center">
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Join our community of book lovers
          </Typography>
        </Box>

        {errors.root && (
          <Alert severity="error">
            {errors.root.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Full Name"
                autoComplete="name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 py-3"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <Box className="text-center">
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link component={RouterLink} to={ROUTES.LOGIN} className="text-blue-600 hover:text-blue-700">
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default SignupForm