export function triggerMediumHaptic() {
  const webApp = window.Telegram?.WebApp
  if (!webApp) return
  const platform = String(webApp.platform || '').toLowerCase()
  if (platform.startsWith('android')) return
  const haptic = webApp.HapticFeedback
  if (haptic && typeof haptic.impactOccurred === 'function') {
    haptic.impactOccurred('medium')
  }
}
