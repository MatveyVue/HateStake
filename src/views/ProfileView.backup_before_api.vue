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
  <p style="font-size: 28px; margin-left: 20px; margin-top: 5px;">240,000</p>
  <p style="font-size: 12px; margin-left: 20px; margin-top: -20px;">SCMD69</p>
  <div class="btn-container">
    <button class="balance-btn-active">
      <img style="width: 20px; margin-left: -85px; margin-top: 10px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Balance.PNG?raw=true">
      <p style="margin-top: -24px; margin-left: 10px;">Deposit</p>
    </button>
    <button class="balance-btn">
      <img style="width: 20px; margin-left: -100px; margin-top: 10px; transform: rotate(180deg);" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Balance.PNG?raw=true">
      <p style="margin-top: -24px; margin-left: 10px;">Withdraw</p>
    </button>
  </div>

<div class="claim-container">
  <img style="width: 60px; margin-top: 2px; margin-left: 2px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Timer.PNG?raw=true">
  <p style="font-size: 12px; color: #6e6e6e; margin-top: -57px; margin-left: 65px;">Next Claim</p>
  <p style="font-size: 18px; margin-left: 65px; margin-top: -10px;">12h 43m</p>
  <button style="background-color: #111217; border: none; float: right; margin-top: -50px; margin-right: 5px;">
    <img style="width: 25px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/next.PNG?raw=true"
  </button>
</div>

<div class="history-container">
  <p style="color: rgb(30, 88, 215); font-size: 12px; float: right; margin-top: 15px; margin-right: 20px;">View All</p>
  <p style="color: #6e6e6e; font-size: 12px; margin-left: 20px; margin-top: 15px;">RECENT ACTIVITY</p>
  <div class="transaction-container">
    <img style="width: 70px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/claim.PNG?raw=true">
    <p class="name-transaction">Claim Rewards</p>
    <p class="date-transaction">12 May, 12:03</p>
    <p class="sum-transaction withdraw">-10,000</p>
    <p class="token-transaction">SCMD69</p>
    <hr style="width: 90%; border: 0; height: 1px; background: #18191e;">
  </div>
  <div class="transaction-container">
    <img style="width: 70px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/deposit.PNG?raw=true">
    <p class="name-transaction">Deposit</p>
    <p class="date-transaction">11 May, 18:42</p>
    <p class="sum-transaction deposit">+5,000,000</p>
    <p class="token-transaction">SCMD69</p>
    <hr style="width: 90%; border: 0; height: 1px; background: #18191e;">
  </div>
  <div class="transaction-container">
    <img style="width: 70px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/withdraw.PNG?raw=true">
    <p class="name-transaction">Withdraw</p>
    <p class="date-transaction">10 May, 21:15</p>
    <p class="sum-transaction withdraw">-10,000</p>
    <p class="token-transaction">SCMD69</p>
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
        <img style="position: absolute; margin-left: -17px; margin-top: 5px;" src="https://github.com/MatveyVue/icopn/blob/main/Market.png?raw=true" width="33px"></img>
        <p style="margin-top: 40px; color: white;">Market</p>
    </button>
</RouterLink>
<RouterLink to="/">
    <button class="leaders" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/LeaderBoard.png?raw=true" width="40px"></img>
        <p style="margin-top: 40px; color: white;">Top</p>
    </button>
<RouterLink to="/staking">
    <button class="game" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -37px; margin-top: 2px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/staking.PNG?raw=true" width="75px"></img>
        <p style="margin-top: 40px;">Staking</p>
    </button>
</RouterLink>
</RouterLink>
    <button class="profile" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/ProfileActive.png?raw=true" width="35px"></img>
        <p style="margin-top: 40px; color: rgb(25, 122, 207);">Profile</p>
    </button>
</div>
</div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { triggerMediumHaptic } from '../script/haptics.js'

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

onMounted(() => {
  const userData = window.Telegram?.WebApp?.initDataUnsafe?.user
  if (userData && userData.username) {
    user.value = userData.username
    photoUrl.value = userData.photo_url || photoUrl.value
    loadStars()
    if (activeTab.value === 'gifts') {
      loadGifts()
    }
  } else {
    console.log('Telegram user data is missing')
  }
})

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
    if (preloader) { // Проверяем, существует ли элемент
        preloader.classList.add('hidden'); // Добавляем класс для скрытия
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
</style>


<style scoped>
.sum-transaction.claim {
    color: #4f9e3e;
}

.sum-transaction.deposit {
    color: #1e58d7;
}

.sum-transaction.withdraw {
    color: #ff4d4d;
}
</style>
