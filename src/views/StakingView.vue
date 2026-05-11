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

<div v-if="pageMessage" class="page-message" :class="pageMessageType">
    {{ pageMessage }}
</div>

<div class="staking-container">
    <img class="staking-token-logo" src="https://github.com/MatveyVue/testcap/blob/main/scmd69.jpg?raw=true">
    <p style="color: #6e6e6e; font-size: 12px; margin-left: 25px; margin-top: 20px;">ACTIVE STAKE</p>
    <p style="font-size: 28px; margin-left: 25px; margin-top: 5px;">{{ activeStake }}</p>
    <p style="font-size: 12px; margin-left: 25px; margin-top: -20px;">SCMD69</p>
    <p style="color: #6e6e6e; font-size: 12px; margin-left: 25px; margin-top: 15px;">AVAILABLE BALANCE</p>
    <p style="font-size: 18px; margin-left: 25px; margin-top: -5px; color: rgb(30, 88, 215);">{{ availableBalance }} SCMD69</p>
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
    <progress :value="progressPercent" max="100"></progress>
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
    <button class="game active-nav" @click="triggerMediumHaptic">
        <div class="bottom-staking-pill">
            <img class="bottom-staking-icon" style="position: absolute; margin-top: -38px;" src="https://github.com/MatveyVue/Profiles-Telegram/blob/main/staking.PNG?raw=true" width="75px"></img>
            <p class="bottom-staking-label">Staking</p>
        </div>
    </button>
<RouterLink to="/profile">
    <button class="profile" @click="triggerMediumHaptic">
        <img style="position: absolute; margin-left: -18px;" src="https://github.com/MatveyVue/icopn/blob/main/Profile.png?raw=true" width="35px"></img>
        <p style="margin-top: 40px;">Profile</p>
    </button>
</RouterLink>
</div>
</div>

<div v-if="modalOpen" class="modal-overlay">
  <div class="modal-box">
    <p class="modal-title">{{ modalTitle }}</p>

    <input
      v-model="modalAmount"
      class="modal-input"
      placeholder="Enter SCMD69 amount"
      type="number"
    >

    <p class="modal-hint">
      Minimum: 500,000 SCMD69
    </p>

    <p v-if="modalError" class="modal-error">
      {{ modalError }}
    </p>

    <div class="modal-actions">
      <button class="modal-btn cancel" @click="closeModal">
        Cancel
      </button>

      <button class="modal-btn confirm" @click="confirmModalAction" :disabled="modalLoading">
        {{ modalLoading ? 'Processing...' : 'Confirm' }}
      </button>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { telegramAuth, getStakingInfo, claimRewards, stake, restake, unstake } from '../lib/api.js'

defineOptions({ name: 'staking' });

const isLoading = ref(true);

const activeStake = ref('0');
const availableBalance = ref('0');
const claimableRewards = ref('0');
const apyPercent = ref(16);
const progressPercent = ref(0);
const daysLeft = ref(0);
const progressText = ref('0/60 Days');
const nextClaimText = ref('—');

const modalOpen = ref(false);
const modalType = ref('');
const modalTitle = ref('');
const modalAmount = ref('');
const modalError = ref('');
const modalLoading = ref(false);

const pageMessage = ref('');
const pageMessageType = ref('');
let pageMessageTimer = null;

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
    availableBalance.value = data.available_balance_formatted || '0';
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
        pageMessage.value = '';
        pageMessageType.value = '';

        await claimRewards();
        await loadStakingInfo();

        showPageMessage('Rewards claimed', 'success');
    } catch (error) {
        showPageMessage(error.message, 'error');
    }
}

async function handleStake() {
    openModal('stake', 'Stake SCMD69');
}

async function handleRestake() {
    openModal('restake', 'Restake SCMD69');
}

async function handleUnstake() {
    openModal('unstake', 'Unstake SCMD69');
}



function showPageMessage(message, type) {
    pageMessage.value = message;
    pageMessageType.value = type;

    if (pageMessageTimer) {
        clearTimeout(pageMessageTimer);
    }

    pageMessageTimer = setTimeout(() => {
        pageMessage.value = '';
        pageMessageType.value = '';
    }, 500);
}

function openModal(type, title) {
    modalType.value = type;
    modalTitle.value = title;
    modalAmount.value = '';
    modalError.value = '';
    modalLoading.value = false;
    modalOpen.value = true;
}

function closeModal() {
    modalOpen.value = false;
}

async function confirmModalAction() {
    try {
        modalError.value = '';
        modalLoading.value = true;

        const nanoAmount = toNanoString(modalAmount.value);

        if (modalType.value === 'stake') {
            await stake(nanoAmount);
        }

        if (modalType.value === 'restake') {
            await restake(nanoAmount);
        }

        if (modalType.value === 'unstake') {
            await unstake(nanoAmount);
        }

        await loadStakingInfo();

        const successMessages = {
            stake: 'Stake successful',
            restake: 'Restake successful',
            unstake: 'Unstake successful'
        };

        showPageMessage(successMessages[modalType.value] || 'Done', 'success');

        closeModal();

    } catch (error) {
        modalError.value = error.message;
    } finally {
        modalLoading.value = false;
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
    background: linear-gradient(180deg, #14161d 0%, #0f1016 100%);
    width: 100%;
    min-height: 380px;
    border-radius: 24px;
    border: 1px solid rgba(30, 88, 215, 0.22);
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
    padding-top: 2px;
}

progress {
    accent-color: #1e58d7;
    margin-left: 25px;
    width: 85%;
    height: 10px;
    border-radius: 999px;
    overflow: hidden;
}

progress::-webkit-progress-bar {
    background-color: rgba(255,255,255,0.08);
    border-radius: 999px;
}

progress::-webkit-progress-value {
    background: linear-gradient(90deg, #1e58d7, #2f7cff);
    border-radius: 999px;
}

progress::-moz-progress-bar {
    background: linear-gradient(90deg, #1e58d7, #2f7cff);
    border-radius: 999px;
}

.stake-bar {
    display: flex;
    gap: 10px;
    margin-top: 14px;
    padding: 0 4px 105px 4px;
}
  
.stake-btn {
    background: linear-gradient(180deg, #151720 0%, #0f1016 100%);
    border: 1px solid rgba(255,255,255,0.06);
    width: 33.333%;
    height: 112px;
    display: block;
    margin: 0;
    border-radius: 20px;
    color: white;
    font-family: Geologica;
    box-shadow: 0 12px 28px rgba(0,0,0,0.25);
}

.stake-btn:active {
    transform: scale(0.98);
}


.page-message {
    background: #111217;
    border: 1px solid #1e58d7;
    border-radius: 14px;
    padding: 12px 14px;
    margin: 10px 0;
    font-size: 14px;
}

.page-message.success {
    color: #4f9e3e;
}

.page-message.error {
    color: #ff4d4d;
    border-color: #ff4d4d;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-box {
    width: 85%;
    max-width: 360px;
    background: #111217;
    border: 1px solid #1e58d7;
    border-radius: 20px;
    padding: 20px;
}

.modal-title {
    font-size: 20px;
    margin-bottom: 20px;
}

.modal-input {
    width: 100%;
    height: 45px;
    border-radius: 12px;
    border: 1px solid #2b2d38;
    background: #0d0e13;
    color: white;
    padding-left: 15px;
    font-size: 16px;
    box-sizing: border-box;
}

.modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.modal-btn {
    flex: 1;
    height: 45px;
    border-radius: 12px;
    border: none;
    font-size: 16px;
}

.modal-btn.cancel {
    background: #22242d;
    color: white;
}

.modal-btn.confirm {
    background: #1e58d7;
    color: white;
}

.modal-btn.confirm:disabled {
    opacity: 0.6;
}

.modal-hint {
    color: #6e6e6e;
    margin-top: 8px;
    font-size: 13px;
}

.modal-error {
    color: #ff4d4d;
    margin-top: 10px;
    font-size: 14px;
}



.staking-token-logo {
    width: 82px;
    height: 82px;
    object-fit: cover;
    border-radius: 999px;
    float: right;
    margin-top: 25px;
    margin-right: 25px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow:
        0 0 0 1px rgba(30,88,215,0.22),
        0 0 26px rgba(30,88,215,0.18),
        inset 0 0 18px rgba(255,255,255,0.04);
}

.bottom-staking-icon {
    width: 75px;
    display: block;
    filter: brightness(0) saturate(100%) invert(39%) sepia(93%) saturate(1407%) hue-rotate(187deg) brightness(92%) contrast(91%);
}

.bottom-staking-label {
    margin-top: -6px;
    color: rgb(25, 122, 207);
    text-align: center;
}

</style>