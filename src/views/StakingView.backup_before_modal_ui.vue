<template>
<div v-if="isLoading" id="preloader">
  <div style="" class="loader">loading</div>
</div>

<div style="margin-left: 10px;">
<p style="font-size: 22px;">SCMD69 Staking</p>
<div style="display: flex; margin-top: -30px;">
    <p style="color: rgb(30, 88, 215);">{{ apyPercent }}%</p>
    <p style="margin-left: 5px; color: #6e6e6e;">APY • 60 Days Lock </p>
</div>
</div>

<div class="staking-container">
    <img style="width: 80px; border-radius: 50px; border: 0.5px solid rgb(30, 88, 215); float: right; margin-top: 25px; margin-right: 25px;" src="https://github.com/MatveyVue/testcap/blob/main/scmd69.jpg?raw=true">
    <p style="color: #6e6e6e; font-size: 12px; margin-left: 25px; margin-top: 20px;">ACTIVE STAKE</p>
    <p style="font-size: 28px; margin-left: 25px; margin-top: 5px;">{{ activeStake }}</p>
    <p style="font-size: 12px; margin-left: 25px; margin-top: -20px;">SCMD69</p>
<hr style="width: 90%; border: 0; height: 1px; background: #18191e;">
    <button type="button" @click="handleClaim" style="background-color: #111217; border: 1px solid rgb(30, 88, 215); width: 110px; height: 40px; border-radius: 15px; float: right; margin-top: 35px; margin-right: 25px;">
        <img style="width: 50px; margin-left: -55px; margin-top: 5px; filter: brightness(0) saturate(100%) invert(24%) sepia(98%) saturate(1868%) hue-rotate(205deg) brightness(96%) contrast(101%);" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/gift.PNG?raw=true">
        <p style="color: rgb(30, 88, 215); font-size: 16px; margin-top: -25px; margin-left: 30px;">Claim</p>
    </button>
    <p style="color: #6e6e6e; font-size: 12px; margin-left: 25px; margin-top: 20px;">EARNED STAKING</p>
    <p style="font-size: 28px; margin-left: 25px; margin-top: 5px; color: #4f9e3e;">+{{ claimableRewards }}</p>
    <p style="font-size: 12px; margin-left: 25px; margin-top: -20px;">SCMD69</p>
<hr style="width: 90%; border: 0; height: 1px; background: #18191e;">
    <p style="color: #6e6e6e; font-size: 12px; margin-right: 25px; float: right;">NEXT CLAIM IN</p>
    <p style="margin-top: 35px; float: right; margin-right: -65px; color: rgb(30, 88, 215);">{{ nextClaimText }}</p>
    <p style="color: #6e6e6e; font-size: 12px; margin-left: 25px; margin-top: 20px;">LOCK PROGRESS</p>
    <p style="margin-left: 25px; margin-top: -5px;">{{ progressText }}</p>
    <progress :value="progressPercent" max="100" style="width: 85%; height: 8px; border-radius: 10px; overflow: hidden;"></progress>
    <p style="color: #6e6e6e; font-size: 12px; margin-left: 25px;">Unlocks in {{ daysLeft }} days</p>
</div>

<div class="stake-bar">
    <button class="stake-btn" type="button" @click="handleStake">
        <img style="width: 75px; margin-top: -10px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/staking.PNG?raw=true">
        <p style="margin-top: 0px;">Stake</p>
    </button>
    <button class="stake-btn" type="button" @click="handleRestake">
        <img style="width: 70px; margin-top: 10px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/restake.PNG?raw=true">
        <p style="margin-top: 2px;">Restake</p>
        <p style="color: #6e6e6e; margin-top: -10px; font-size: 12px;">(Add to stake)</p>
    </button>
    <button class="stake-btn" type="button" @click="handleUnstake">
        <img style="width: 70px; margin-top: -20px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/burn.png?raw=true">
        <p style="margin-top: -40px;">Unstake</p>
        <p style="color: red; margin-top: -10px; font-size: 12px;">(20% penality)</p>
    </button>
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
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/LeaderBoard.png?raw=true" width="40px"></img>
        <p style="margin-top: 40px; color: white;">Top</p>
    </button>
</RouterLink>
    <button class="game" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -37px; margin-top: 2px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/StakingActive.png?raw=true" width="75px"></img>
        <p style="margin-top: 40px; color: rgb(25, 122, 207);">Staking</p>
    </button>
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
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { telegramAuth, getStakingInfo, claimRewards, stake, restake, unstake } from '../lib/api.js'

defineOptions({ name: 'staking' });

const isLoading = ref(true);

const activeStake = ref('0');
const claimableRewards = ref('0');
const apyPercent = ref(16);
const progressPercent = ref(0);
const daysLeft = ref(0);
const progressText = ref('0/60 Days');
const nextClaimText = ref('—');

onMounted(async () => {
    isLoading.value = true;

    try {
        await telegramAuth();
        await loadStakingInfo();
    } catch (error) {
        console.error('Failed to load staking info:', error);
    }
});

async function loadStakingInfo() {
    const data = await getStakingInfo();

    activeStake.value = data.active_stake_formatted || '0';
    claimableRewards.value = data.claimable_rewards_formatted || '0';

    apyPercent.value = data.season?.apy_percent || 16;
    progressPercent.value = data.season?.progress_percent || 0;
    daysLeft.value = data.season?.days_left || 0;

    const passedDays = Math.max(0, 60 - Number(daysLeft.value || 0));
    progressText.value = `${passedDays}/60 Days`;

    nextClaimText.value = data.claimable_rewards !== '0' ? 'Available' : '—';
}

async function handleClaim() {
    try {
        await claimRewards();
        await loadStakingInfo();
        alert('Rewards claimed');
    } catch (error) {
        alert(error.message);
    }
}

async function handleStake() {
    const amountText = prompt('How many SCMD69 stake?');

    if (!amountText) return;

    try {
        const nanoAmount = toNanoString(amountText);

        await stake(nanoAmount);

        await loadStakingInfo();

        alert('Stake successful');
    } catch (error) {
        alert(error.message);
    }
}

async function handleRestake() {
    const amountText = prompt('How many SCMD69 restake?');

    if (!amountText) return;

    try {
        const nanoAmount = toNanoString(amountText);

        await restake(nanoAmount);

        await loadStakingInfo();

        alert('Restake successful');
    } catch (error) {
        alert(error.message);
    }
}

async function handleUnstake() {
    const amountText = prompt('How many SCMD69 unstake?');

    if (!amountText) return;

    try {
        const nanoAmount = toNanoString(amountText);

        await unstake(nanoAmount);

        await loadStakingInfo();

        alert('Unstake successful');
    } catch (error) {
        alert(error.message);
    }
}

function toNanoString(value) {
    const clean = String(value).replace(',', '.').trim();

    if (!clean || Number(clean) <= 0) {
        throw new Error('Invalid amount');
    }

    const parts = clean.split('.');
    const whole = parts[0];
    const fraction = (parts[1] || '').padEnd(9, '0').slice(0, 9);

    return `${whole}${fraction}`.replace(/^0+(?=\d)/, '');
}

window.addEventListener('load', function() {
});

setTimeout(function() {
    const preloader = document.getElementById('preloader');
    if (preloader) { // Проверяем, существует ли элемент
        preloader.classList.add('hidden'); // Добавляем класс для скрытия
    }
}, 5000);
</script>

<style scoped>
.staking-container {
    background-color: #111217;
    width: 100%;
    height: 380px;
    border-radius: 20px;
    border: 0.5px solid #1a1b23;
}

progress {
    accent-color: #1e58d7;
    margin-left: 25px;
}

progress::-webkit-progress-bar {
    background-color: #3339;
    border-radius: 10px;
}

progress::-webkit-progress-value {
    background-color: #1e58d7;
    border-radius: 10px;
}

progress::-moz-progress-bar {
    background-color: #1e58d7;
    border-radius: 10px;
}

.stake-bar {
    display: inline;
}
  
.stake-btn {
    background-color: #111217;
    border: 0.5px solid #1a1b23;
    width: 30%;
    height: 100px;
    display: inline-block;
    vertical-align: top;
    margin-top: 10px;
    border-radius: 15px;
    margin-left: 10px;
    color: white;
    font-family: Geologica;
}
</style>