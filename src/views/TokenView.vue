<template>
<div v-if="isLoading" id="preloader">
  <div style="" class="loader">loading</div>
</div>

<center>
<div class="top-rating">
<RouterLink to="/">
    <button style="background-color: #0a0b0d;" class="stars-rat">Stars</button>
</RouterLink>
<RouterLink to="token">
    <button style="background-color: #111217; color: rgb(238, 238, 238);" class="token-rat">Token</button>
</RouterLink>
</div>
</center>

<div>
<div style="display: flex; justify-content: center; gap: 7vw; margin-top: 15px; display: flex; align-items: center;" v-if="topHolders.length">

<div v-if="topHolders.length > 1" :style="{ 'text-align': 'center', 'margin-top': '30px' }">
    <img style="border-radius: 50%;" :src="getAvatar(topHolders[1].owner.address)" width="90px" alt="Holder Image">
    <div style="margin-left: 9vw; margin-top: -25px;" class="top-2">2</div>
<div style="margin-top: 3px;">
    <a :href="'https://tonviewer.com/address/' + topHolders[1].owner.address" target="_blank" rel="noopener noreferrer">
      <b>{{ shortenAddress(topHolders[1].owner.address) }}</b>
    </a>
    <br>
    {{ formatBalance(topHolders[1].balance) }}
</div>
</div>

  <!-- Центральный держатель (самый большой) -->
<div :style="{ 'text-align': 'center' }">
    <img style="border-radius: 50%;" :src="getAvatar(topHolders[0].owner.address)" width="110px" alt="Holder Image">
    <div style="margin-top: -17px;" class="top1">1</div>
<div style="margin-top: 5px;">
    <a :href="'https://tonviewer.com/address/' + topHolders[0].owner.address" target="_blank" rel="noopener noreferrer">
      <b>{{ shortenAddress(topHolders[0].owner.address) }}</b>
    </a>
    <br>
    {{ formatBalance(topHolders[0].balance) }}
</div>
</div>


<div v-if="topHolders.length > 2" :style="{ 'text-align': 'center', 'margin-top': '30px' }">
    <img style="border-radius: 50%;" :src="getAvatar(topHolders[2].owner.address)" width="90px" alt="Holder Image">
    <div style="margin-left: 9vw; margin-top: -25px;" class="top-3">3</div>
<div style="margin-top: 3px;">
    <a :href="'https://tonviewer.com/address/' + topHolders[2].owner.address" target="_blank" rel="noopener noreferrer">
      <b>{{ shortenAddress(topHolders[2].owner.address) }}</b>
    </a>
    <br>
    {{ formatBalance(topHolders[2].balance) }}
</div>
</div>
</div>

<p style="color: rgb(20, 20, 20); font-size: 10px;">.</p>
<div class="banner">
    <a href="https://t.me/+x4-ZMCjs8y0zNDQ0">
        <img class="banner" src="https://github.com/MatveyVue/icopn/blob/main/Banner.jpg?raw=true"></img>
    </a>
</div>
<p style="color: rgb(20, 20, 20); font-size: 5px;">.</p>

<div>
  <div 
    class="border-wallet" 
    v-for="(holder, index) in otherHolders" 
    :key="holder.owner.address" 
    style="display: flex; align-items: center; gap: 10px;"
  >
    <!-- Отображаем место, начиная с 4 (индекс 0 в массиве = место #4) -->
    <div class="position-badge" style="min-width: 40px; text-align: center; font-weight: bold;">
      #{{ index + 4 }}
    </div>
    
    <img 
      :src="getAvatar(holder.owner.address)" 
      width="45px" 
      alt="Holder Avatar" 
      style="border-radius: 50%; margin-left: -10px;"
    >
    
    <div>
      <a 
        :href="'https://tonviewer.com/address/' + holder.owner.address" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <b><p class="wallet">{{ shortenAddress(holder.owner.address) }}</p></b>
      </a>
      <p class="tokens-wallet">{{ formatBalance(holder.balance) }}</p>
    </div>
  </div>
</div>


    <!-- Остальной ваш шаблон -->
  </div>

<div class="bar">
<div class="btn-container">
<RouterLink to="/market">
    <button class="market" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -17px; margin-top: 5px;" src="https://github.com/MatveyVue/icopn/blob/main/Market.png?raw=true" width="33px"></img>
        <p style="margin-top: 40px;">Market</p>
    </button>
</RouterLink>
<RouterLink to="/">
    <button class="leaders" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/LeaderActive.png?raw=true" width="40px"></img>
        <p style="margin-top: 40px;">Top</p>
    </button>
</RouterLink>
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

<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
    const isLoading = ref(true);

    onMounted(() => {
      isLoading.value = true;

      setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
          preloader.classList.add('hidden');
          isLoading.value = false;
        }
      }, 5000);
    });

    return { isLoading };
  },
  data() {
    return {
      holders: [],
      // СТАТИЧЕСКИЙ словарь с привязкой КОНКРЕТНЫХ адресов к аватаркам
      avatarMap: {
        // Пример реальных адресов (замените на свои)
        // Адрес для 1-го места (Scrooge)
        '0:76b614e18f3bd8a78f8aeccb4c525e634df6203a0b195f53b3603c9fd604925f': 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/Scrooge.jpg?raw=true',
        
        // Адрес для 2-го места (StonFi)  
        '0:d36f5c354c2a2116a9cd7323ebadb6c1250740c303e7f036c2a1a4947744b94f': 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/StonFi.png?raw=true',        
        
        // Адрес для 4-го места (Webby)
        '0:5e4ef4483c6b31fe169ee265f31b8ce676bf4980f7ac3cf29d4c227d66a3e26a': 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/Rstm.jpg?raw=true',
        
        // Адрес для 5-го места (специальная аватарка)
        '0:027749cd26265ca584c6ac7f7fce9ebfb1449556a88122865eebd68af8b2d0ce': 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/Webby.jpg?raw=true',

        '0:0c3241400f8877b8e57d5c4f88a55de96f4202182978ca034f8129698824d5f5': 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/scmd.jpg?raw=true',
      },
      // Добавляем positionAvatars, так как на него есть ссылка в getAvatar
      positionAvatars: {
        1: 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/Scrooge.jpg?raw=true',
        2: 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/StonFi.png?raw=true',
        3: 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/holders.jpg?raw=true',
        4: 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/Webby.jpg?raw=true',
        5: 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/Rstm.jpg?raw=true',
        8: 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/scmd.jpg?raw=true',
      }
    }
  },
  computed: {
    topHolders() {
      return this.holders.slice(0, 3);
    },
    otherHolders() {
      return this.holders.slice(3);
    }
  },
  created() {
    this.fetchHolders();
  },
  methods: {
    fetchHolders() {
      fetch('https://tonapi.io/v2/jettons/EQAj5b62MW-WTXXa3jr02byWNUtCdWpVohFoGOo7GznlKtD9/holders?limit=1000&offset=0')
        .then(response => response.json())
        .then(data => {
          if (data.addresses && Array.isArray(data.addresses)) {
            this.holders = data.addresses.map(holder => ({
              balance: holder.balance,
              owner: holder.owner
            }));
            
            // Выводим в консоль первые 10 адресов, чтобы их скопировать
            console.log('Первые 10 адресов держателей:');
            this.holders.slice(0, 10).forEach((holder, index) => {
              console.log(`${index + 1}: ${holder.owner.address}`);
            });
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    
    getAvatar(address) {
      // ПРОВЕРЯЕМ: если адрес есть в статическом avatarMap, возвращаем аватарку
      if (this.avatarMap[address]) {
        console.log(`Найдена специальная аватарка для адреса: ${this.shortenAddress(address)}`);
        return this.avatarMap[address];
      }
      
      // Если не нашли в статическом мапе, проверяем позицию
      const holderIndex = this.holders.findIndex(h => h.owner.address === address);
      if (holderIndex !== -1 && holderIndex < 5) {
        // Для первых 5 мест можно использовать positionAvatars
        const position = holderIndex + 1;
        if (this.positionAvatars[position]) {
          return this.positionAvatars[position];
        }
      }
      
      // Иначе возвращаем аватарку по умолчанию
      return 'https://github.com/MatveyVue/Profiles-Telegram/blob/main/holders.jpg?raw=true';
    },
    
    shortenAddress(address) {
      if (!address || address.length < 10) return address;
      return address.slice(0, 5) + '...' + address.slice(-2);
    },
    
    formatBalance(balance) {
      console.log('Исходный баланс:', balance);
      let num = parseFloat(balance);
      if (isNaN(num)) {
        console.warn('Баланс не число:', balance);
        return balance;
      }
      if (num >= 1_000_000_000_000_000) {
        return (num / 1_000_000_000_000_000).toFixed(2) + 'М';
      } else if (num >= 1_000_000_000_000) {
        return (num / 1_000_000_000_000).toFixed(2) + 'K';
      } else {
        return num.toFixed(2);
      }
    },
    
    // Добавляем отсутствующий метод triggerMediumHaptic
    triggerMediumHaptic() {
      // Если используете Telegram WebApp, можно добавить тактильную отдачу
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
      // Или просто пустая функция, если тактильная отдача не нужна
      console.log('Haptic feedback triggered');
    }
  }
}
</script>