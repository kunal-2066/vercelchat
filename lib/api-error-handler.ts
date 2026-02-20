import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: error.errors 
      }, 
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Internal server error' }, 
    { status: 500 }
  )
}