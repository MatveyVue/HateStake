import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GiftCollectionView from '../views/GiftCollectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/market',
      name: 'market',
      component: () => import('../views/MarketView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/token',
      name: 'token',
      component: () => import('../views/TokenView.vue'),
    },
    {
      path: '/staking',
      name: 'staking',
      component: () => import('../views/StakingView.vue'),
    },
    {
      path: '/jollychimp',
      name: 'jollychimp',
      component: GiftCollectionView,
      props: { giftName: 'Jolly Chimp' },
    },
    {
      path: '/plushpepe',
      name: 'plushpepe',
      component: GiftCollectionView,
      props: { giftName: 'Plush Pepe' },
    },
    {
      path: '/durovcap',
      name: 'durovcap',
      component: GiftCollectionView,
      props: { giftName: "Durov's Cap" },
    },
    {
      path: '/astralshard',
      name: 'astralshard',
      component: GiftCollectionView,
      props: { giftName: 'Astral Shard' },
    },
    {
      path: '/lootbag',
      name: 'lootbag',
      component: GiftCollectionView,
      props: { giftName: 'Loot Bag' },
    },
    {
      path: '/preciouspeach',
      name: 'preciouspeach',
      component: GiftCollectionView,
      props: { giftName: 'Precious Peach' },
    },
    {
      path: '/swisswatch',
      name: 'swisswatch',
      component: GiftCollectionView,
      props: { giftName: 'Swiss Watch' },
    },
    {
      path: '/vintagecigar',
      name: 'vintagecigar',
      component: GiftCollectionView,
      props: { giftName: 'Vintage Cigar' },
    },
    {
      path: '/iongem',
      name: 'iongem',
      component: GiftCollectionView,
      props: { giftName: 'Ion Gem' },
    },
    {
      path: '/signetring',
      name: 'signetring',
      component: GiftCollectionView,
      props: { giftName: 'Signet Ring' },
    },
    {
      path: '/diamondring',
      name: 'diamondring',
      component: GiftCollectionView,
      props: { giftName: 'Diamond Ring' },
    },
    {
      path: '/deskcalendar',
      name: 'deskcalendar',
      component: GiftCollectionView,
      props: { giftName: 'Desk Calendar' },
    },
    {
      path: '/b-daycandle',
      name: 'b-daycandle',
      component: GiftCollectionView,
      props: { giftName: 'B-Day Candle' },
    },
    {
      path: '/gingercookie',
      name: 'gingercookie',
      component: GiftCollectionView,
      props: { giftName: 'Ginger Cookie' },
    },
    {
      path: '/freshsocks',
      name: 'freshsocks',
      component: GiftCollectionView,
      props: { giftName: 'Fresh Socks' },
    },
    {
      path: '/icecream',
      name: 'icecream',
      component: GiftCollectionView,
      props: { giftName: 'Ice Cream' },
    },
    {
      path: '/inputkey',
      name: 'inputkey',
      component: GiftCollectionView,
      props: { giftName: 'Input Key' },
    },
  ],
})

export default router