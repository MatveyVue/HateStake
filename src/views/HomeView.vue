<template>
<center>
    <div class="top-rating">
      <RouterLink to="/">
        <button style="background-color: #111217; color: rgb(238, 238, 238);" class="stars-rat">Stars</button>
      </RouterLink>
      <RouterLink to="token">
        <button style="cursor: pointer; background-color: #0a0b0d;" class="token-rat">Token</button>
      </RouterLink>
    </div>
</center>

<div class="profile-container">
    <div class="top-players">
      <div v-if="topPlayers.length > 1" class="stars-top2 player-container">
          <img :src="topPlayers[1].photo" alt="Фото" style="width: 85px; height: 85px; margin-top: 40px;" class="user-photo">
          <div style="margin-top: 105px;" class="top-2">2</div>
        <a :href="topPlayers[1].link || '#'">
          <b><p style="margin-top: -30px; margin-left: -5px; font-size: 18px;">{{ topPlayers[1].user ? topPlayers[1].user : 'Нет данных' }}</p></b></a>
          <a :href="topPlayers[1].caplink || '#'">
            <p><img style="margin-top: -85px; margin-left: 35px; position: absolute;" :src="topPlayers[1].cap" width="20px"></p>
          </a>
          <br>
          <p style="margin-top: -140px; margin-left: -12px;">{{ topPlayers[1].stars }}<img style="position: absolute;"  src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Stars.png?raw=true" width="20px"></p>
      </div>
    <center>
      <div v-if="topPlayers.length > 0" class="stars-top1 player-container">
          <img :src="topPlayers[0].photo" alt="Фото" style="width: 100px; height: 100px; margin-top: 5px;" class="user-photo">
          <div style="margin-top: 95px;" class="top1">1</div>
        <a :href="topPlayers[0].link || '#'">
          <b><p style="margin-top: -30px; margin-left: -5px; font-size: 18px;">{{ topPlayers[0].user ? topPlayers[0].user : 'Нет данных' }}</p></b></a>
        <a :href="topPlayers[0].caplink || '#'">
          <p><img style="margin-top: -85px; margin-left: 45px; position: absolute;" :src="topPlayers[0].cap" width="20px"></img></p>
        </a>
          <br>
          <p style="margin-top: -140px; margin-left: -7px;">{{ topPlayers[0].stars }}<img style="position: absolute; margin-top: 1px;"  src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Stars.png?raw=true" width="20px"></p>
      </div>
    </center>
      <div v-if="topPlayers.length > 2" class="stars-top3 player-container">
          <img :src="topPlayers[2].photo" alt="Фото" style="width: 85px; height: 85px; margin-top: 40px;" class="user-photo">
          <div style="margin-top: 105px;" class="top-3">3</div>
          <a :href="topPlayers[2].link || '#'"> 
          <b><p style="margin-top: -30px; margin-left: -5px; font-size: 18px;">{{ topPlayers[2].user ? topPlayers[2].user : 'Нет данных' }}</p></b></a>
          <a :href="topPlayers[2].caplink || '#'">
            <p><img style="margin-top: -85px; margin-left: 45px; position: absolute;" :src="topPlayers[2].cap" width="20px"></p>
          </a>
          <br>
          <p style="margin-top: -140px; margin-left: -10px;">{{ topPlayers[2].stars }}<img style="position: absolute;"  src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Stars.png?raw=true" width="20px"></p>
       </div>
    </div>
</div>

<div style="margin-top: -20px;" class="banner">
    <a href="https://t.me/+x4-ZMCjs8y0zNDQ0">
        <img class="banner" src="https://github.com/MatveyVue/icopn/blob/main/Banner.jpg?raw=true"></img>
    </a>
</div>
<p style="color: rgb(20, 20, 20); font-size: 5px;">.</p>

<div class="other-players">
    <div v-for="(player, index) in otherPlayers" :key="index" class="player-container2">
          <img :src="player.photo" alt="Фото" class="other-photo">
        <a style="width: 100px;" :href="player.link || '#'">
          <p class="other-player">{{ player.user ? player.user : 'Нет данных' }}</p>
        </a>
        <a :href="player.caplink">
          <img style="margin-top: -35px; position: absolute; margin-left: 175px;" :src="player.cap" width="20px">
          <p style="margin-top: -35px; position: absolute; margin-left: 200px;">#{{ player.number }}</p>
        </a>
          <img class="stars-other" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/Stars.png?raw=true" width="25px">
          <p class="other-stars">{{ player.stars }}</p>
    </div>
</div>
<p style="color: rgb(20, 20, 20);">.</p>
<p style="color: rgb(20, 20, 20);">.</p>
<p style="color: rgb(20, 20, 20);">.</p>
<p style="color: rgb(20, 20, 20);">.</p>

<div class="bar">
<div class="btn-container">
<RouterLink to="/market">
    <button class="market" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -17px; margin-top: 5px;" src="https://github.com/MatveyVue/icopn/blob/main/Market.png?raw=true" width="33px"></img>
        <p style="margin-top: 40px;">Market</p>
    </button>
</RouterLink>
    <button class="leaders" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/LeaderActive.png?raw=true" width="40px"></img>
        <p style="margin-top: 40px;">Top</p>
    </button>
<RouterLink to="/staking">
    <button class="game" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -37px; margin-top: 2px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/staking.PNG?raw=true" width="75px"></img>
        <p style="margin-top: 40px;">Staking</p>
    </button>
</RouterLink>
<RouterLink to="/profile">
    <button class="profile" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/Profile.png?raw=true" width="35px"></img>
        <p style="margin-top: 40px;">Profile</p>
    </button>
</RouterLink>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { RouterLink } from 'vue-router';

defineOptions({ name: 'home' });

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
}, 5000);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const topPlayers = ref([]);
const otherPlayers = ref([]);

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const playersCollection = collection(db, 'users'); // Убедись, что используешь правильное имя коллекции
    const q = query(playersCollection, orderBy('stars', 'desc'));
    const querySnapshot = await getDocs(q);

    const players = [];
    querySnapshot.forEach((doc) => {
      players.push({ id: doc.id, ...doc.data() });
    });

    topPlayers.value = players.slice(0, 3);
    otherPlayers.value = players.slice(3);
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore:', error);
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-players {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 20px;
}

.player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7vw;
  margin-top: 15px;
}

.player-container2 {
  background-color: #111217;
  width: 100%;
  height: 60px;
  border-radius: 15px;
  margin-top: 10px;
}

.user-photo {
  width: 50px; /* Задай нужный размер */
  height: 50px;
  border-radius: 50%; /* Круглая форма */
  margin-bottom: 5px;
}

.other-photo {
  width: 45px; /* Задай нужный размер */
  height: 45px;
  border-radius: 50%; /* Круглая форма */
  margin-top: 7px;
  margin-left: 7px;
}


.player { /* стили для other-players */
  margin: 5px;
  padding: 10px;
  border: 1px solid #ccc;
}

.other-player {
    margin-top: -36px;
    margin-left: 65px;
}

.other-stars {
    margin-top: -35px;
    float: right;
    margin-right: 30px;
}

.stars-other {
    float: right;
    margin-top: -37px;
    margin-right: 5px;
}
</style>
