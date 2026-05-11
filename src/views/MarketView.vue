<template>
  <div class="market-shell">
    <div class="market-header">
      <div>
        <p class="market-kicker">Collectibles</p>
        <h1 class="market-title">Market</h1>
      </div>
      <button class="filter-toggle" type="button" @click="filtersOpen = !filtersOpen">
        Filters
      </button>
    </div>

    <div v-if="filtersOpen" class="filters-panel">
      <div class="filter-grid">
        <select v-model="selectedCollection" class="filter-select" @change="handleCollectionChange">
          <option value="All">All Collections</option>
          <option v-for="collection in collectionOptions" :key="collection" :value="collection">
            {{ collection }}
          </option>
        </select>
        <select v-model="selectedModel" class="filter-select">
          <option value="All">All Models</option>
          <option v-for="model in modelOptions" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
        <select v-model="selectedBackdrop" class="filter-select">
          <option value="All">All Backdrops</option>
          <option v-for="backdrop in backdropOptions" :key="backdrop" :value="backdrop">
            {{ backdrop }}
          </option>
        </select>
        <select v-model="selectedSymbol" class="filter-select">
          <option value="All">All Symbols</option>
          <option v-for="symbol in symbolOptions" :key="symbol" :value="symbol">
            {{ symbol }}
          </option>
        </select>
        <input
          v-model="numberInput"
          class="filter-input"
          type="text"
          inputmode="numeric"
          placeholder="Number"
        />
      </div>
      <div class="filter-actions">
        <button class="filter-btn" type="button" @click="applyFilters" :disabled="loading">
          Apply
        </button>
        <button class="filter-btn ghost" type="button" @click="resetFilters" :disabled="loading">
          Reset
        </button>
      </div>
    </div>

    <div v-if="previewImageUrl" class="collection-preview">
      <img :src="previewImageUrl" class="collection-image" />
      <div class="collection-info">
        <p class="collection-name">{{ selectedCollection }}</p>
        <p class="collection-meta">{{ selectedModelLabel }}</p>
      </div>
    </div>

    <div v-if="errorMessage" class="error-state">
      <p class="error-text">{{ errorMessage }}</p>
      <button class="retry-btn" type="button" @click="fetchNextPage" :disabled="loading">
        Retry
      </button>
    </div>

    <div ref="listRef" class="market-list">
      <div v-if="isInitialLoading" class="market-loader">
        <div class="loader">loading</div>
      </div>
      <p v-if="!loading && gifts.length === 0" class="empty-text">
        No results
      </p>
      <div v-for="(gift, index) in gifts" :key="index" class="market-card">
        <div class="card-image">
          <img :src="gift.photo_url" />
        </div>
        <div class="card-body">
          <p class="card-title">{{ gift.title }}</p>
          <p class="card-number">#{{ gift.number }}</p>
          <a :href="gift.webapp_url" target="_blank" rel="noopener">
            <button class="card-cta">{{ gift.price }} TON</button>
          </a>
        </div>
      </div>
      <p v-if="loading && gifts.length > 0" class="loading-more">Loading more...</p>
    </div>

    <button v-if="showTop" class="to-top" type="button" @click="scrollToTop">↑</button>
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
      <RouterLink to="/staking">
    <button class="game" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -37px; margin-top: 2px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/staking.PNG?raw=true" width="75px">
        <p style="margin-top: 40px;">Staking</p>
    </button>
    </RouterLink>
      <RouterLink to="/profile">
        <button class="profile" @click="triggerMediumHaptic">
          <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/Profile.png?raw=true" width="35px"/>
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
import { fetchGiftPage } from '../script/giftsApi.js'
import { triggerMediumHaptic } from '../script/haptics.js'
import rarityCsv from '../assets/data/rarity_rows.csv?raw'

defineOptions({ name: 'market' })

const filtersOpen = ref(false)
const collectionOptions = ref([])
const modelOptions = ref([])
const backdropOptions = ref([])
const symbolOptions = ref([])
const selectedCollection = ref('All')
const selectedModel = ref('All')
const selectedBackdrop = ref('All')
const selectedSymbol = ref('All')
const numberInput = ref('')

const gifts = ref([])
const currentPage = ref(0)
const loading = ref(false)
const allLoaded = ref(false)
const errorMessage = ref('')
const listRef = ref(null)
const showTop = ref(false)

const rarityIndex = ref(new Map())
const collectionMeta = ref(new Map())
const globalAttributes = ref({ models: [], backdrops: [], symbols: [] })
const pageCache = new Map()

const isInitialLoading = computed(() => loading.value && gifts.value.length === 0)

const previewImageUrl = computed(() => {
  const collection = normalizeValue(selectedCollection.value)
  if (collection === 'All') return ''
  const meta = collectionMeta.value.get(collection)
  if (!meta) return ''
  const model = normalizeValue(selectedModel.value) !== 'All' ? normalizeValue(selectedModel.value) : meta.firstModel
  const symbol = normalizeValue(selectedSymbol.value)
  if (symbol !== 'All') {
    return `https://cdn.changes.tg/gifts/patterns/${encodeURIComponent(collection)}/png/${encodeURIComponent(symbol)}.png`
  }
  if (!model) return ''
  return `https://cdn.changes.tg/gifts/models/${encodeURIComponent(collection)}/png/${encodeURIComponent(model)}.png`
})

const selectedModelLabel = computed(() => {
  const model = normalizeValue(selectedModel.value)
  const backdrop = normalizeValue(selectedBackdrop.value)
  const symbol = normalizeValue(selectedSymbol.value)
  if (model !== 'All') return model
  if (backdrop !== 'All') return backdrop
  if (symbol !== 'All') return symbol
  return 'All Attributes'
})

function parseRarity(csvText) {
  const lines = csvText.trim().split(/\r?\n/)
  const index = new Map()
  const meta = new Map()
  const collections = new Set()
  const models = new Set()
  const backdrops = new Set()
  const symbols = new Set()

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line) continue
    const parts = line.split(',')
    if (parts.length < 5) continue
    const collection = parts[1]
    const attrType = parts[2]
    const attrValue = parts.slice(3, parts.length - 1).join(',')

    collections.add(collection)
    if (!index.has(collection)) {
      index.set(collection, { models: new Set(), backdrops: new Set(), symbols: new Set() })
    }
    if (!meta.has(collection)) {
      meta.set(collection, { firstModel: '' })
    }

    const bucket = index.get(collection)
    if (attrType === 'models') {
      bucket.models.add(attrValue)
      models.add(attrValue)
      if (!meta.get(collection).firstModel) {
        meta.get(collection).firstModel = attrValue
      }
    }
    if (attrType === 'backdrops') {
      bucket.backdrops.add(attrValue)
      backdrops.add(attrValue)
    }
    if (attrType === 'symbols') {
      bucket.symbols.add(attrValue)
      symbols.add(attrValue)
    }
  }

  return {
    collections: Array.from(collections).sort(),
    index,
    meta,
    global: {
      models: Array.from(models).sort(),
      backdrops: Array.from(backdrops).sort(),
      symbols: Array.from(symbols).sort(),
    },
  }
}

function normalizeValue(value) {
  const trimmed = String(value || '').trim()
  return trimmed === '' ? 'All' : trimmed
}

function handleCollectionChange() {
  const collection = normalizeValue(selectedCollection.value)
  if (collection === 'All' || !rarityIndex.value.has(collection)) {
    modelOptions.value = globalAttributes.value.models
    backdropOptions.value = globalAttributes.value.backdrops
    symbolOptions.value = globalAttributes.value.symbols
    return
  }

  const info = rarityIndex.value.get(collection)
  modelOptions.value = info ? Array.from(info.models).sort() : []
  backdropOptions.value = info ? Array.from(info.backdrops).sort() : []
  symbolOptions.value = info ? Array.from(info.symbols).sort() : []
  if (normalizeValue(selectedModel.value) !== 'All' && !info.models.has(selectedModel.value)) {
    selectedModel.value = 'All'
  }
  if (normalizeValue(selectedBackdrop.value) !== 'All' && !info.backdrops.has(selectedBackdrop.value)) {
    selectedBackdrop.value = 'All'
  }
  if (normalizeValue(selectedSymbol.value) !== 'All' && !info.symbols.has(selectedSymbol.value)) {
    selectedSymbol.value = 'All'
  }
}

function buildPayload() {
  const parsedNumber = Number.parseInt(numberInput.value, 10)
  return {
    name: normalizeValue(selectedCollection.value),
    model: normalizeValue(selectedModel.value),
    symbol: normalizeValue(selectedSymbol.value),
    backdrop: normalizeValue(selectedBackdrop.value),
    number: Number.isFinite(parsedNumber) ? parsedNumber : null,
  }
}

async function fetchNextPage() {
  if (loading.value || allLoaded.value) return

  const page = currentPage.value
  const cacheKey = `${page}|${selectedCollection.value}|${selectedModel.value}|${selectedSymbol.value}|${selectedBackdrop.value}|${numberInput.value}`
  if (pageCache.has(cacheKey)) {
    gifts.value = [...gifts.value, ...pageCache.get(cacheKey)]
    currentPage.value += 1
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const items = await fetchGiftPage(buildPayload(), page)
    if (items.length === 0) {
      allLoaded.value = true
      return
    }
    gifts.value = [...gifts.value, ...items]
    pageCache.set(cacheKey, items)
    currentPage.value += 1
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to load gifts'
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  selectedCollection.value = normalizeValue(selectedCollection.value)
  selectedModel.value = normalizeValue(selectedModel.value)
  selectedBackdrop.value = normalizeValue(selectedBackdrop.value)
  selectedSymbol.value = normalizeValue(selectedSymbol.value)
  gifts.value = []
  currentPage.value = 0
  allLoaded.value = false
  pageCache.clear()
  filtersOpen.value = false
  fetchNextPage()
}

function resetFilters() {
  selectedCollection.value = 'All'
  selectedModel.value = 'All'
  selectedBackdrop.value = 'All'
  selectedSymbol.value = 'All'
  numberInput.value = ''
  handleCollectionChange()
  applyFilters()
}

function handleWindowScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  showTop.value = window.scrollY > 240
  if (progress >= 0.5) {
    fetchNextPage()
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  const { collections, index, meta, global } = parseRarity(rarityCsv)
  collectionOptions.value = collections
  rarityIndex.value = index
  collectionMeta.value = meta
  globalAttributes.value = global
  handleCollectionChange()
  applyFilters()
  window.addEventListener('scroll', handleWindowScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleWindowScroll)
})

const isLoading = ref(true);

window.addEventListener('load', function() {
});

setTimeout(function() {
    const preloader = document.getElementById('preloader');
    if (preloader) { // Проверяем, существует ли элемент
        preloader.classList.add('hidden'); // Добавляем класс для скрытия
    }
}, 3000);
</script>
