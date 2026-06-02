export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err

  if (typeof err === 'object' && err !== null) {
    const msg = extractMessage(err as Record<string, unknown>)
    if (msg) return msg
  }

  return 'Đã xảy ra lỗi, vui lòng thử lại'
}

function getString(obj: Record<string, unknown>, key: string): string | undefined {
  const val = obj[key]
  return typeof val === 'string' ? val : undefined
}

function extractMessage(err: Record<string, unknown>): string | undefined {
  // e.message
  const direct = getString(err, 'message')
  if (direct) return direct

  // e.response.data.message hoặc e.response.message
  const response = err['response']
  if (typeof response === 'object' && response !== null) {
    const res = response as Record<string, unknown>

    const data = res['data']
    if (typeof data === 'object' && data !== null) {
      const dataMsg = getString(data as Record<string, unknown>, 'message')
      if (dataMsg) return dataMsg
    }

    return getString(res, 'message')
  }
}