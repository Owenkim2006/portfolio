import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: '#080b14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          color: '#6C63FF',
          fontFamily: 'system-ui',
          paddingLeft: 3,
          paddingBottom: 2,
        }}
      >
        OK.
      </div>
    ),
    { ...size }
  )
}
