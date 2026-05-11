<template>
  <div v-if="isInitialLoading" id="preloader">
    <div class="loader">loading</div>
  </div>

  <div class="collection-header">
    <button class="back-btn" type="button" @click="goBack">Back</button>
    <h1 class="collection-title">{{ giftName }}</h1>
  </div>

  <div class="filters">
    <input
      v-model="backdropInput"
      class="filter-input"
      type="text"
      placeholder="Backdrop (e.g. Black)"
      autocomplete="off"
    />
    <input
      v-model="numberInput"
      class="filter-input"
      type="number"
      placeholder="Number (e.g. 133)"
      min="1"
    />
    <button class="filter-btn" type="button" @click="applyFilters" :disabled="loading">
      Search
    </button>
    <button class="filter-btn" type="button" @click="resetFilters" :disabled="loading">
      Reset
    </button>
  </div>

  <div v-if="errorMessage" class="error-state">
    <p class="error-text">{{ errorMessage }}</p>
    <button class="retry-btn" type="button" @click="fetchGifts" :disabled="loading">
      Retry
    </button>
  </div>
  <p v-else-if="!loading && gifts.length === 0" class="empty-text">
    No results yet. Try another backdrop or number.
  </p>

  <div class="gifts-wrapper">
    <div v-for="(gift, index) in gifts" :key="index" class="gifts-container">
      <img :src="gift.photo_url" style="width: 100%; border-radius: 20px;" />
      <p class="title" style="color: white;">{{ gift.title }}</p>
      <p class="number">#{{ gift.number }}</p>
      <a :href="gift.webapp_url" target="_blank" rel="noopener" style="display: inline-block; margin-top: 8px;">
        <button class="buy-btn">{{ gift.price }} TON</button>
      </a>
    </div>
  </div>

  <div class="bar">
    <div class="btn-container">
      <RouterLink to="/market">
        <button class="market" @click="triggerMediumHaptic">
          <img
            style="position: absolute; margin-left: -17px; margin-top: 5px;"
            src="https://github.com/MatveyVue/icopn/blob/main/MarketActive.png?raw=true"
            width="33px"
          />
          <p style="margin-top: 40px; color: rgb(25, 122, 207);">Market</p>
        </button>
      </RouterLink>
      <RouterLink to="/">
        <button class="leaders" @click="triggerMediumHaptic">
          <img
            style="position: absolute; margin-left: -18px;"
            src="https://github.com/MatveyVue/icopn/blob/main/LeaderBoard.png?raw=true"
            width="40px"
          />
          <p style="margin-top: 40px; color: white;">Top</p>
        </button>
      </RouterLink>
      <RouterLink to="/profile">
        <button class="profile" @click="triggerMediumHaptic">
          <img
            style="position: absolute; margin-left: -18px;"
            src="https://github.com/MatveyVue/icopn/blob/main/Profile.png?raw=true"
            width="35px"
          />
          <p style="margin-top: 40px;">Profile</p>
        </button>
      </RouterLink>
    </div>
  </div>
  <p style="color: rgb(20, 20, 20);">.</p>
  <p style="color: rgb(20, 20, 20);">.</p>
  <p style="color: rgb(20, 20, 20);">.</p>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchGiftPage } from '../script/giftsApi.js'
import { triggerMediumHaptic } from '../script/haptics.js'

const props = defineProps({
  giftName: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const gifts = ref([])
const currentPage = ref(0)
const loading = ref(false)
const allLoaded = ref(false)
const errorMessage = ref('')
const backdropInput = ref('')
const numberInput = ref('')

const isInitialLoading = computed(() => loading.value && gifts.value.length === 0)

function buildPayload() {
  const backdrop = backdropInput.value.trim()
  const parsedNumber = Number.parseInt(numberInput.value, 10)
  return {
    name: props.giftName,
    model: 'All',
    symbol: 'All',
    backdrop: backdrop ? backdrop : 'All',
    number: Number.isFinite(parsedNumber) ? parsedNumber : null,
  }
}

async function fetchGifts() {
  if (loading.value || allLoaded.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const payload = buildPayload()
    const items = await fetchGiftPage(payload, currentPage.value)
    if (items.length > 0) {
      gifts.value = [...gifts.value, ...items]
      currentPage.value += 1
    } else {
      allLoaded.value = true
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to load gifts'
  } finally {
    loading.value = false
  }
}

function handleScroll() {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !loading.value &&
    !allLoaded.value
  ) {
    fetchGifts()
  }
}

function applyFilters() {
  gifts.value = []
  currentPage.value = 0
  allLoaded.value = false
  fetchGifts()
}

function resetFilters() {
  backdropInput.value = ''
  numberInput.value = ''
  applyFilters()
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/market')
  }
}

onMounted(() => {
  fetchGifts()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
