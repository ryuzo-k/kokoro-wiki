import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'kokoro-wiki'
    
    // Check if title starts with "# "
    const displayTitle = title.startsWith('# ') ? title.slice(2) : title

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFAFA',
            color: '#111111',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '80%',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'normal',
                margin: '0 0 20px 0',
                lineHeight: 1.2,
              }}
            >
              {displayTitle}
            </h1>
            <div
              style={{
                fontSize: '20px',
                opacity: 0.7,
                margin: 0,
              }}
            >
              kokoro-wiki
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
