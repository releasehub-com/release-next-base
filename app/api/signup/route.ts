import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  try {
    const response = await fetch('https://api.release.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error forwarding request' },
      { status: 500 }
    )
  }
} 