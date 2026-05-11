<template>
<div v-if="isLoading" id="preloader">
  <div style="" class="loader">loading</div>
</div>
<center>
    <img class="profile-img" :src="photoUrl">
    <h2 style="color: white; margin-top: -5px;">{{ user }}</h2>
</center>

<div class="profile-tabs">
  <button class="tab-btn" :class="{ active: activeTab === 'channel' }" type="button" @click="setTab('channel')">
    Rewards
  </button>
  <button class="tab-btn" :class="{ active: activeTab === 'gifts' }" type="button" @click="setTab('gifts')">
    Gifts
  </button>
</div>

<div v-if="activeTab === 'channel'" class="tab-panel">
<div class="rewards">
  <img style="width: 75px; border-radius: 50px; border: 0.5px solid rgb(30, 88, 215); float: right; margin-top: 20px; margin-right: 25px;" src="https://github.com/MatveyVue/testcap/blob/main/scmd69.jpg?raw=true">
  <p style="color: #6e6e6e; font-size: 12px; margin-left: 20px; margin-top: 15px;">AVAILABLE BALANCE</p>
  <p style="font-size: 28px; margin-left: 20px; margin-top: 5px;">{{ profileBalance }}</p>
  <p style="font-size: 12px; margin-left: 20px; margin-top: -20px;">SCMD69</p>
  <div class="btn-container">
    <button class="balance-btn-active" type="button" @click="handleDeposit">
      <img style="width: 20px; margin-left: -85px; margin-top: 5px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Balance.PNG?raw=true">
      <p style="margin-top: -23px; margin-left: 60px; position: absolute;">Deposit</p>
    </button>
    <button class="balance-btn" type="button" @click="handleWithdraw">
      <img style="width: 20px; margin-left: -100px; margin-top: 5px; transform: rotate(180deg);" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Balance.PNG?raw=true">
      <p style="margin-top: -23px; margin-left: 60px; position: absolute;">Withdraw</p>
    </button>
  </div>

<div style="margin-top: 25px;" class="claim-container">
  <img style="width: 60px; margin-top: 2px; margin-left: -10px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Timer.PNG?raw=true">
  <p style="font-size: 12px; color: #6e6e6e; margin-top: -30px; margin-left: -10px;">Next Claim</p>
  <p style="font-size: 18px; margin-left: -74px; margin-top: 8px;">12h 43m</p>
  <button style="background-color: #111217; border: none; float: right; margin-top: -5px; margin-right: 5px;">
    <img style="width: 25px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/next.PNG?raw=true">
  </button>
</div>

<div class="history-container">
  <p style="color: rgb(30, 88, 215); font-size: 12px; float: right; margin-top: 5px; margin-right: 20px;">View All</p>
  <p style="color: #6e6e6e; font-size: 12px; margin-left: 20px; margin-top: 5px;">RECENT ACTIVITY</p>

  <div v-if="activityLoading" class="transaction-container">
    <p class="name-transaction">Loading activity...</p>
  </div>

  <div v-else-if="activityList.length === 0" class="transaction-container">
    <p style="margin-left: 20px;" class="name-transaction">No activity yet</p>
  </div>

  <div v-else v-for="item in activityList" :key="item.created_at + item.type" class="transaction-container">
    <img style="width: 70px;" :src="getActivityIcon(item.type)">
    <p class="name-transaction">{{ getActivityTitle(item.type) }}</p>
    <p class="date-transaction">{{ formatActivityDate(item.created_at) }}</p>
    <p class="sum-transaction" :class="getActivityClass(item.type)">{{ formatActivityAmount(item.amount, item.type) }}</p>
    <p class="token-transaction">SCMD69</p>
    <hr style="width: 90%; border: 0; height: 1px; background: #18191e;">
  </div>
</div>
</div>
</div>


<div v-else class="tab-panel">
  <div v-if="giftsLoading" class="loading-spinner">
    <span class="spinner" aria-label="Loading"></span>
  </div>
  <div v-else-if="giftsError" class="error-state">
    <p class="error-text">{{ giftsError }}</p>
    <button class="retry-btn" type="button" @click="loadGifts" :disabled="giftsLoading">
      Retry
    </button>
  </div>
  <div v-else-if="gifts.length === 0" class="empty-state">
    <p class="empty-text">No gifts yet</p>
    <p class="empty-subtext">Buy your first gift</p>
    <a class="empty-link" href="https://t.me/swiftgifts_official_bot?startapp=ref_matvey">
      <button class="empty-cta" type="button">Open SwiftGifts</button>
    </a>
  </div>
  <div v-else class="gifts-wrapper">
    <div v-for="gift in gifts" :key="gift.id" class="gifts-container">
      <button class="gift-card" type="button" @click="openGiftModal(gift)">
        <img :src="getGiftImageUrl(gift.url)" style="width:100%; border-radius: 20px;">
      </button>
      <p class="title" style="color:white;">{{ gift.title }}</p>
      <p class="number">#{{ gift.num }}</p>
    </div>
  </div>
  <button v-if="giftsHasMore && !giftsLoading" class="filter-btn" type="button" @click="loadMoreGifts">
    Load more
  </button>
</div>

  <div v-if="selectedGift" class="gift-modal" @click.self="closeGiftModal">
  <div class="gift-modal-card">
    <div class="gift-modal-handle"></div>
    <div class="gift-modal-header">
      <div>
        <h3 class="gift-modal-title">{{ selectedGift.title }}</h3>
        <p class="gift-modal-subtitle">#{{ selectedGift.num }}</p>
      </div>
      <button class="gift-modal-close" type="button" aria-label="Close" @click="closeGiftModal">x</button>
    </div>
    <div class="gift-modal-body">
      <img :src="getGiftImageUrl(selectedGift.url)" class="gift-modal-image">
      <div class="gift-modal-grid">
        <p class="gift-modal-item">
          <span class="gift-modal-label">Backdrop</span>
          <span class="gift-modal-value">{{ selectedGift.backdrop_name || 'N/A' }}</span>
        </p>
        <p class="gift-modal-item">
          <span class="gift-modal-label">Model</span>
          <span class="gift-modal-value">{{ selectedGift.model_name || 'N/A' }}</span>
        </p>
        <p class="gift-modal-item">
          <span class="gift-modal-label">Symbol</span>
          <span class="gift-modal-value">{{ selectedGift.pattern_name || 'N/A' }}</span>
        </p>
        <p class="gift-modal-item">
          <span class="gift-modal-label">Comment</span>
          <span class="gift-modal-value">{{ getGiftComment(selectedGift) }}</span>
        </p>
        <p class="gift-modal-item">
          <span class="gift-modal-label">For sale</span>
          <span class="gift-modal-value">{{ getSaleText(selectedGift) }}</span>
        </p>
        <p class="gift-modal-item">
          <span class="gift-modal-label">Updated</span>
          <span class="gift-modal-value">{{ formatDate(selectedGift.updated_at) }}</span>
        </p>
      </div>
    </div>
    <div class="gift-modal-actions">
      <a :href="selectedGift.url" class="gift-modal-link">
        <button class="gift-modal-primary" type="button">See gift</button>
      </a>
      <button class="gift-modal-secondary" type="button" @click="closeGiftModal">Ok</button>
    </div>
  </div>
</div>

<div class="bar">
<div style="margin-top: 3px;" class="btn-container">
<RouterLink to="/market">
    <button class="market" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -17px; margin-top: 5px;" src="https://github.com/MatveyVue/icopn/blob/main/Market.png?raw=true" width="33px">
        <p style="margin-top: 40px; color: white;">Market</p>
    </button>
</RouterLink>
<RouterLink to="/">
    <button class="leaders" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/LeaderBoard.png?raw=true" width="40px">
        <p style="margin-top: 40px; color: white;">Top</p>
    </button>
</RouterLink>
<RouterLink to="/staking">
    <button class="game" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -37px; margin-top: 2px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/staking.PNG?raw=true" width="75px">
        <p style="margin-top: 40px;">Staking</p>
    </button>
</RouterLink>
    <button class="profile" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/ProfileActive.png?raw=true" width="35px">
        <p style="margin-top: 40px; color: rgb(25, 122, 207);">Profile</p>
    </button>
</div>
</div>

<div v-if="depositModalOpen" class="wallet-modal-backdrop">
  <div class="wallet-modal">
    <button class="wallet-modal-close" type="button" @click="depositModalOpen = false">×</button>

    <p class="wallet-modal-title">Deposit SCMD69</p>
    <p class="wallet-modal-note">Send SCMD69 to this wallet and include the memo. Your balance will update after scanner confirmation.</p>
    <p v-if="depositError" class="wallet-modal-error">{{ depositError }}</p>

    <p class="wallet-modal-label">Wallet</p>
    <div class="wallet-modal-row">
      <p class="wallet-modal-value">{{ depositData?.wallet }}</p>
      <button class="wallet-copy-btn" type="button" @click="copyText(depositData?.wallet, 'wallet')">{{ copiedField === 'wallet' ? 'Copied' : 'Copy' }}</button>
    </div>

    <p class="wallet-modal-label">Memo</p>
    <div class="wallet-modal-row">
      <p class="wallet-modal-value">{{ depositData?.memo }}</p>
      <button class="wallet-copy-btn" type="button" @click="copyText(depositData?.memo, 'memo')">{{ copiedField === 'memo' ? 'Copied' : 'Copy' }}</button>
    </div>

    <p class="wallet-modal-label">Jetton Master</p>
    <p class="wallet-modal-value">{{ depositData?.jetton_master }}</p>
  </div>
</div>

<div v-if="withdrawModalOpen" class="wallet-modal-backdrop">
  <div class="wallet-modal">
    <button class="wallet-modal-close" type="button" @click="withdrawModalOpen = false">×</button>

    <p class="wallet-modal-title">Withdraw SCMD69</p>
    <p class="wallet-modal-note">Withdraw is sent from your available balance to your TON wallet.</p>

    <p class="wallet-modal-label">Amount</p>
    <input class="wallet-modal-input" v-model="withdrawAmount" inputmode="decimal" placeholder="Amount SCMD69">

    <p class="wallet-modal-label">TON Wallet Address</p>
    <input class="wallet-modal-input" v-model="withdrawAddress" placeholder="UQ...">

    <p v-if="withdrawError" class="wallet-modal-error">{{ withdrawError }}</p>
    <p v-if="withdrawSuccess" class="wallet-modal-success">{{ withdrawSuccess }}</p>

    <button class="wallet-modal-submit" type="button" @click="submitWithdraw" :disabled="withdrawLoading">
      {{ withdrawLoading ? 'Processing...' : 'Create Withdraw' }}
    </button>
  </div>
</div>

</template>

<script setup>
// ВАШ ОРИГИНАЛЬНЫЙ СКРИПТ — НЕ ТРОГАЛ
// (весь код остаётся без изменений)
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { triggerMediumHaptic } from '../script/haptics.js'
import { telegramAuth, getProfile, getActivity, createDeposit, createWithdraw } from '../lib/api.js'

defineOptions({ name: 'profile' })

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const user = ref(null)
const photoUrl = ref('https://github.com/MatveyVue/gift/blob/main/Anonim.png?raw=true')
const stars = ref(0)
const activeTab = ref('channel')
const gifts = ref([])
const giftsLoaded = ref(false)
const giftsLoading = ref(false)
const giftsError = ref('')
const giftsOffset = ref(0)
const giftsLimit = 50
const giftsHasMore = ref(true)
const selectedGift = ref(null)

const profileBalance = ref('0')
const activityList = ref([])
const activityLoading = ref(false)

const depositModalOpen = ref(false)
const withdrawModalOpen = ref(false)

const depositData = ref(null)
const depositError = ref('')
const copiedField = ref('')

const withdrawAmount = ref('')
const withdrawAddress = ref('')
const withdrawLoading = ref(false)
const withdrawError = ref('')
const withdrawSuccess = ref('')

onMounted(async () => {
  const userData = window.Telegram?.WebApp?.initDataUnsafe?.user
  if (userData && userData.username) {
    user.value = userData.username
    photoUrl.value = userData.photo_url || photoUrl.value
  }

  try {
    await telegramAuth()
    await loadProfileData()
    await loadActivityData()
  } catch (error) {
    console.error('Backend profile load failed:', error)
  }

  if (user.value) {
    loadStars()
  }

  if (activeTab.value === 'gifts') {
    loadGifts()
  }
})


async function loadProfileData() {
  const data = await getProfile()
  profileBalance.value = data.balances?.available_balance_formatted || '0'
}

async function loadActivityData() {
  activityLoading.value = true
  try {
    const data = await getActivity()
    activityList.value = data.activity || []
  } finally {
    activityLoading.value = false
  }
}

async function handleDeposit() {
  try {
    depositError.value = ''
    const data = await createDeposit()
    depositData.value = data
    depositModalOpen.value = true
    await loadActivityData()
  } catch (error) {
    depositError.value = error.message
    depositModalOpen.value = true
  }
}

function handleWithdraw() {
  withdrawAmount.value = ''
  withdrawAddress.value = ''
  withdrawError.value = ''
  withdrawSuccess.value = ''
  withdrawLoading.value = false
  withdrawModalOpen.value = true
}

async function copyText(text, field) {
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    copiedField.value = field

    setTimeout(() => {
      if (copiedField.value === field) {
        copiedField.value = ''
      }
    }, 1000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

async function submitWithdraw() {
  try {
    withdrawError.value = ''
    withdrawSuccess.value = ''
    withdrawLoading.value = true

    const nanoAmount = toNanoString(withdrawAmount.value)
    await createWithdraw(nanoAmount, withdrawAddress.value)

    await loadProfileData()
    await loadActivityData()

    withdrawSuccess.value = 'Withdraw request created'
  } catch (error) {
    withdrawError.value = error.message
  } finally {
    withdrawLoading.value = false
  }
}

function toNanoString(value) {
  const clean = String(value).replace(',', '.').trim()
  if (!clean || Number(clean) <= 0) {
    throw new Error('Invalid amount')
  }

  const [whole, fraction = ''] = clean.split('.')
  const frac = fraction.padEnd(9, '0').slice(0, 9)
  return `${whole}${frac}`.replace(/^0+(?=\d)/, '')
}

function formatTokenAmount(value) {
  const raw = BigInt(value || 0)
  const whole = raw / 1000000000n
  const frac = raw % 1000000000n

  if (frac === 0n) return whole.toLocaleString('en-US')

  return `${whole.toLocaleString('en-US')}.${frac.toString().padStart(9, '0').replace(/0+$/, '')}`
}

function formatActivityAmount(amount, type) {
  const negative = ['withdraw', 'withdraw_sent', 'withdraw_confirmed', 'unstake']
  const sign = negative.includes(type) ? '-' : '+'
  return `${sign}${formatTokenAmount(amount)}`
}

function getActivityClass(type) {
  if (['withdraw', 'withdraw_sent', 'withdraw_confirmed', 'unstake'].includes(type)) return 'withdraw'
  if (['deposit', 'stake', 'restake'].includes(type)) return 'deposit'
  return 'claim'
}

function getActivityTitle(type) {
  const titles = {
    deposit: 'Deposit',
    stake: 'Stake',
    restake: 'Restake',
    unstake: 'Unstake',
    withdraw: 'Withdraw',
    withdraw_sent: 'Withdraw Sent',
    withdraw_confirmed: 'Withdraw Confirmed',
    claim: 'Claim Rewards'
  }

  return titles[type] || type
}

function getActivityIcon(type) {
  if (['withdraw', 'withdraw_sent', 'withdraw_confirmed', 'unstake'].includes(type)) {
    return 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/withdraw.PNG?raw=true'
  }

  if (['deposit', 'stake', 'restake'].includes(type)) {
    return 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/deposit.PNG?raw=true'
  }

  return 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/claim.PNG?raw=true'
}

function formatActivityDate(value) {
  const d = new Date(Number(value))
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function loadStars() {
  if (!user.value) {
    stars.value = 0
    return
  }

  try {
    const userDocRef = doc(db, 'users', user.value)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      const data = userDocSnap.data()
      console.log('Fetched user data from Firestore:', data)
      stars.value = data.stars || 0
    } else {
      stars.value = 0
      console.log('User document not found in Firestore')
    }
  } catch (error) {
    console.error('Failed to load stars from Firestore:', error)
    stars.value = 0
  }
}

function setTab(tab) {
  activeTab.value = tab
  if (tab === 'gifts' && !giftsLoaded.value) {
    loadGifts()
  }
}

async function loadGifts() {
  if (!user.value || giftsLoading.value) return
  giftsLoading.value = true
  giftsError.value = ''
  try {
    const url = `https://api-swiftgifts.vercel.app/api/user_gifts?username=${encodeURIComponent(user.value)}&limit=${giftsLimit}&offset=${giftsOffset.value}`
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'x-api-key': import.meta.env.VITE_SWIFTGIFTS_API_KEY
      }
    })
    if (!response.ok) {
      throw new Error(`Gift API error: ${response.status}`)
    }
    const data = await response.json()
    const items = Array.isArray(data) ? data : data.gifts || data.items || []
    if (giftsOffset.value === 0) {
      gifts.value = items
    } else {
      gifts.value = [...gifts.value, ...items]
    }
    giftsOffset.value += items.length
    giftsHasMore.value = items.length === giftsLimit
    giftsLoaded.value = true
  } catch (error) {
    giftsError.value = error?.message || 'Failed to load gifts'
  } finally {
    giftsLoading.value = false
  }
}

function loadMoreGifts() {
  if (giftsHasMore.value) {
    loadGifts()
  }
}

function getGiftSlugFromUrl(url) {
  const raw = String(url || '').split('/').filter(Boolean).pop()
  return raw || ''
}

function getGiftImageUrl(url) {
  const slug = getGiftSlugFromUrl(url)
  if (!slug) return ''
  return `https://nft.fragment.com/gift/${slug}.medium.jpg`
}

function openGiftModal(gift) {
  selectedGift.value = gift
}

function closeGiftModal() {
  selectedGift.value = null
}

watch(
  selectedGift,
  (value) => {
    document.body.classList.toggle('modal-open', Boolean(value))
  }
)

onBeforeUnmount(() => {
  document.body.classList.remove('modal-open')
})

function getGiftComment(gift) {
  if (gift.comment) return gift.comment
  const details = gift.details
  if (details && details.date) {
    return `Details date: ${formatDate(details.date)}`
  }
  return 'N/A'
}

function getSaleText(gift) {
  if (gift.resale_ton_amount != null) {
    return `${formatTon(gift.resale_ton_amount)} TON`
  }
  if (gift.resale_stars_amount != null) {
    return `${gift.resale_stars_amount} Stars`
  }
  if (gift.resale_ton_only) {
    return 'TON only'
  }
  return 'Not for sale'
}

function formatDate(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString()
}

function formatTon(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 'N/A'
  const ton = amount / 1e9
  return ton.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  })
}

const isLoading = ref(true);

onMounted(() => {
    isLoading.value = true;
});

window.addEventListener('load', function() {
});

setTimeout(function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
}, 3000);
</script>

<style scoped>
.btn-container {
  margin-top: 20px;
}

.balance-btn {
  background-color: #18191e;
  border: 0.5px solid rgb(42, 42, 42);
  color: white;
  font-family: Geologica;
  font-size: 16px;
  width: 48%;
  height: 45px;
  margin-left: 5px;
  border-radius: 15px;
}

.balance-btn-active {
  background-color: rgb(30, 88, 215);
  border: 0.5px solid rgb(30, 81, 192);
  color: white;
  font-family: Geologica;
  font-size: 16px;
  width: 48%;
  height: 45px;
  margin-left: 5px;
  border-radius: 15px;
}

.claim-container {
  background-color: #111217;
  border: 0.5px solid rgb(42, 42, 42, 0.5);
  height: 60px;
  border-radius: 20px;
  margin-top: 20px;
}

.history-container {
  background-color: #111217;
  border: 0.5px solid rgb(42, 42, 42, 0.5);
  height: auto;
  border-radius: 20px;
  margin-top: 10px;
}

.transaction-container {
  margin-top: -10px;
}

.name-transaction {
  font-size: 14px;
  margin-left: 65px;
  margin-top: -57px;
}

.date-transaction {
  font-size: 12px;
  color: #6e6e6e;
  margin-left: 65px;
  margin-top: -15px;
}

.sum-transaction {
  float: right;
  font-size: 14px;
  margin-top: -44px;
  margin-right: 15px;
  color: #4f9e3e;
}

.token-transaction {
  float: right;
  font-size: 12px;
  color: #6e6e6e;
  margin-right: 15px;
  margin-top: -28px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 18px;
  padding-bottom: 18px;
}

.profile-img {
  width: 118px !important;
  height: 118px !important;
  max-width: 118px !important;
  object-fit: cover;
  border-radius: 999px;
  border: 1px solid rgba(30, 88, 215, 0.45);
  box-shadow: 0 0 0 1px rgba(30, 88, 215, 0.18), 0 0 30px rgba(30, 88, 215, 0.22), 0 18px 40px rgba(0,0,0,0.35);
}

.username {
  color: white;
  font-size: 22px;
  margin: 10px 0 0 0;
  font-family: Geologica;
}

.profile-tabs {
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 18px;
  padding: 5px;
  margin: 0 0 14px;
  display: flex;
  gap: 5px;
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 0;
  border-radius: 14px;
  color: #8e8e93;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.tab-btn.active {
  background: rgba(30, 88, 215);
  color: white;
}

.balance-btn,
.balance-btn-active {
  width: 47%;
  height: 54px;
  margin: 0;
  border-radius: 18px;
  display: inline-block;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 7px;
}

.balance-btn-active {
  background: linear-gradient(180deg, #2f6cff, #1e58d7);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 12px 30px rgba(30,88,215,0.32);
}

.balance-btn {
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.07);
}

.balance-btn img,
.balance-btn-active img {
  width: 20px;
  margin: 0;
}

.balance-btn p,
.balance-btn-active p {
  margin: 0;
}

/* Claim container */
.claim-container {
  height: 72px;
  margin-top: 14px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.claim-container > img {
  width: 48px;
  margin: 0;
}

.claim-container p {
  margin: 0;
}

.claim-container p:first-of-type {
  color: #6e6e6e;
  font-size: 12px;
}

.claim-container p:last-of-type {
  color: white;
  font-size: 18px;
  margin-top: 3px;
}

.claim-container button {
  margin-left: auto;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  width: 42px;
  height: 42px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.claim-container button img {
  width: 22px;
}

/* History container */
.history-container {
  margin-top: 14px;
  padding: 14px 12px;
  padding-bottom: 22px;
}

.history-container > p:first-of-type {
  float: right;
  margin: 0;
  color: rgb(30,88,215);
  font-size: 12px;
  cursor: pointer;
}

.history-container > p:last-of-type {
  margin: -14px 0 12px;
  color: #6e6e6e;
  font-size: 12px;
  letter-spacing: 0.5px;
}

/* Transaction styles */
.transaction-container {
  margin: 8px 0;
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  position: relative;
}

.transaction-container > img {
  width: 48px;
  border-radius: 12px;
}

.name-transaction {
  flex: 1;
  margin: 0;
  font-size: 14px;
  color: white;
}

.date-transaction {
  width: 100%;
  margin: 3px 0 0 58px;
  font-size: 11px;
  color: rgba(255,255,255,0.45);
}

.sum-transaction {
  margin: 0;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
}

.token-transaction {
  margin: 0;
  text-align: right;
  font-size: 11px;
  color: rgba(255,255,255,0.45);
}

.transaction-container hr {
  width: 100%;
  margin: 10px 0 0;
  border: 0;
  height: 1px;
  background: rgba(255,255,255,0.06);
}

.sum-transaction.claim { color: #4f9e3e; }
.sum-transaction.deposit { color: #1e58d7; }
.sum-transaction.withdraw { color: #ff4d4d; }

.tab-panel {
  padding-bottom: 130px;
  background: #06080d;
}

/* Wallet modals */
.wallet-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.wallet-modal {
  width: 100%;
  max-width: 360px;
  background: linear-gradient(180deg, #14161d 0%, #0f1016 100%);
  border: 1px solid rgba(30, 88, 215, 0.35);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
  position: relative;
}

.wallet-modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  background: transparent;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
}

.wallet-modal-title {
  font-size: 22px;
  margin: 0 0 8px;
  color: white;
}

.wallet-modal-note {
  font-size: 13px;
  line-height: 1.35;
  color: #8b8f9c;
}

.wallet-modal-label {
  margin-top: 14px;
  margin-bottom: 6px;
  color: #6e6e6e;
  font-size: 12px;
}

.wallet-modal-value {
  background: #111217;
  border: 1px solid rgba(30, 88, 215, 0.25);
  border-radius: 14px;
  padding: 10px;
  color: white;
  font-size: 12px;
  word-break: break-all;
}

.wallet-modal-input {
  width: 100%;
  box-sizing: border-box;
  background: #111217;
  border: 1px solid rgba(30, 88, 215, 0.25);
  border-radius: 14px;
  padding: 12px;
  color: white;
  font-size: 14px;
  outline: none;
}

.wallet-modal-input:focus {
  border-color: rgba(30, 88, 215, 0.75);
}

.wallet-modal-submit {
  width: 100%;
  margin-top: 18px;
  height: 46px;
  border-radius: 16px;
  border: 1px solid rgb(30, 88, 215);
  background: rgb(30, 88, 215);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.wallet-modal-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.wallet-modal-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.wallet-modal-row .wallet-modal-value {
  flex: 1;
  margin: 0;
}

.wallet-copy-btn {
  min-width: 64px;
  border-radius: 14px;
  border: 1px solid rgb(30, 88, 215);
  background: #111217;
  color: rgb(30, 88, 215);
  font-size: 13px;
  cursor: pointer;
}

.wallet-modal-error {
  color: #ff5a5a;
  font-size: 13px;
  margin-top: 12px;
}

.wallet-modal-success {
  color: #4f9e3e;
  font-size: 13px;
  margin-top: 12px;
}

/* Gifts styles */
.gifts-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
}

.gifts-container {
  width: calc(33.333% - 8px);
  text-align: center;
}

.gift-card {
  width: 100%;
  background: #111217;
  border: 1px solid rgba(30,88,215,0.2);
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s;
}

.gift-card:hover {
  transform: scale(0.98);
}

.title {
  font-size: 12px;
  margin-top: 6px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.number {
  font-size: 10px;
  color: #6e6e6e;
  margin-top: 0;
}

.filter-btn {
  width: calc(100% - 24px);
  margin: 12px;
  padding: 12px;
  background: rgba(30, 88, 215, 0.15);
  border: 1px solid rgba(30, 88, 215, 0.3);
  border-radius: 16px;
  color: rgb(30, 88, 215);
  font-size: 14px;
  cursor: pointer;
}

/* Loading spinner */
.loading-spinner {
  display: flex;
  justify-content: center;
  padding: 48px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(30,88,215,0.2);
  border-top-color: rgb(30,88,215);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state, .empty-state {
  text-align: center;
  padding: 48px 24px;
}

.error-text, .empty-text {
  color: white;
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-subtext {
  color: #8e8e93;
  font-size: 13px;
  margin-bottom: 20px;
}

.retry-btn, .empty-cta {
  background: linear-gradient(180deg, #2f6cff, #1e58d7);
  border: none;
  border-radius: 16px;
  padding: 12px 24px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.empty-link {
  text-decoration: none;
}

/* Gift modal */
.gift-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.gift-modal-card {
  background: linear-gradient(180deg, #1a1c24 0%, #111217 100%);
  border-radius: 28px;
  max-width: 340px;
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(30,88,215,0.3);
}

.gift-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.gift-modal-title {
  color: white;
  font-size: 18px;
  margin: 0;
}

.gift-modal-subtitle {
  color: #8e8e93;
  font-size: 12px;
  margin: 4px 0 0;
}

.gift-modal-close {
  background: rgba(255,255,255,0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.gift-modal-image {
  width: 100%;
  border-radius: 20px;
  margin-bottom: 16px;
}

.gift-modal-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gift-modal-item {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 13px;
}

.gift-modal-label {
  color: #6e6e6e;
}

.gift-modal-value {
  color: white;
  text-align: right;
  word-break: break-word;
  max-width: 60%;
}

.gift-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.gift-modal-primary,
.gift-modal-secondary {
  flex: 1;
  padding: 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
}

.gift-modal-primary {
  background: rgb(30,88,215);
  border: none;
  color: white;
}

.gift-modal-secondary {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
}

.gift-modal-link {
  flex: 1;
  text-decoration: none;
}

/* Preloader */
#preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #06080d;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
}

#preloader.hidden {
  display: none;
}

.loader {
  color: rgb(30,88,215);
  font-size: 14px;
}
</style>