const API_BASE = 'https://stakingbackend.onrender.com'

let token = localStorage.getItem('scmd_token') || ''

export async function telegramAuth() {
  const initData = window.Telegram?.WebApp?.initData || ''

  const res = await fetch(`${API_BASE}/auth/telegram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      initData
    })
  })

  const data = await res.json()

  if (!data.success) {
    throw new Error(data.error || 'AUTH_FAILED')
  }

  token = data.data.token
  localStorage.setItem('scmd_token', token)

  return data.data
}

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  })

  const data = await res.json()

  if (!data.success) {
    throw new Error(data.error || 'API_ERROR')
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
  return api('/deposit/create', {
    method: 'POST'
  })
}

export async function createWithdraw(amount, address) {
  return api('/withdraw/create', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      address
    })
  })
}

export async function claimRewards() {
  return api('/staking/claim', {
    method: 'POST'
  })
}

export async function stake(amount) {
  return api('/staking/stake', {
    method: 'POST',
    body: JSON.stringify({
      amount
    })
  })
}

export async function restake(amount) {
  return api('/staking/restake', {
    method: 'POST',
    body: JSON.stringify({
      amount
    })
  })
}

export async function unstake(amount) {
  return api('/staking/unstake', {
    method: 'POST',
    body: JSON.stringify({
      amount
    })
  })
}
