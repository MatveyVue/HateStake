const API_BASE = 'https://stakingbackend.onrender.com'

let token = localStorage.getItem('scmd_token') || ''
// Промис текущей авторизации, чтобы не плодить параллельные /auth/telegram запросы
let authPromise = null

function setToken(newToken) {
  token = newToken || ''
  if (token) {
    localStorage.setItem('scmd_token', token)
  } else {
    localStorage.removeItem('scmd_token')
  }
}

// Безопасный парсинг ответа: сервер может вернуть не-JSON (например, HTML/пустое тело на 401/502)
async function parseResponse(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { success: false, error: { message: `Non-JSON response (status ${res.status}): ${text.slice(0, 200)}` } }
  }
}

function extractErrorMessage(data, res) {
  const err = data?.error
  if (!err) return `HTTP_${res.status}`
  if (typeof err === 'string') return err
  return err.message || err.code || `HTTP_${res.status}`
}

export async function telegramAuth() {
  // Если авторизация уже идёт — ждём её вместо повторного запроса
  if (authPromise) return authPromise

  authPromise = (async () => {
    const initData = window.Telegram?.WebApp?.initData || ''

    if (!initData) {
      throw new Error('NO_INIT_DATA: window.Telegram.WebApp.initData is empty. ' +
        'Make sure the app is opened via a real Telegram Web App button (not a plain link), ' +
        'and Telegram.WebApp.ready() was called.')
    }

    const res = await fetch(`${API_BASE}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData })
    })

    const data = await parseResponse(res)

    if (!res.ok || !data?.success) {
      throw new Error(extractErrorMessage(data, res))
    }

    setToken(data.data.token)
    return data.data
  })()

  try {
    return await authPromise
  } finally {
    authPromise = null
  }
}

// Гарантирует, что токен есть, прежде чем делать защищённый запрос
async function ensureAuth() {
  if (!token) {
    await telegramAuth()
  }
}

export async function api(path, options = {}, _isRetry = false) {
  await ensureAuth()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  })

  const data = await parseResponse(res)

  // Токен протух/невалиден — один раз пробуем перелогиниться и повторить запрос
  if (res.status === 401 && !_isRetry) {
    setToken('')
    await telegramAuth()
    return api(path, options, true)
  }

  if (!res.ok || !data?.success) {
    throw new Error(extractErrorMessage(data, res))
  }

  return data.data
}

export async function getProfile() {
  return api('/profile')
}

export async function getActivity() {
  return api('/profile/activity')
}

export async function getStakingInfo() {
  return api('/staking/info')
}

export async function createDeposit() {
  return api('/deposit/create', { method: 'POST' })
}

export async function createWithdraw(amount, address) {
  return api('/withdraw/create', {
    method: 'POST',
    body: JSON.stringify({ amount, address })
  })
}

export async function claimRewards() {
  return api('/staking/claim', { method: 'POST' })
}

export async function stake(amount) {
  return api('/staking/stake', {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}

export async function restake(amount) {
  return api('/staking/restake', {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}

export async function unstake(amount) {
  return api('/staking/unstake', {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}
