<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuAberto = ref(false)

function alternarMenu() {
  menuAberto.value = !menuAberto.value
}

function fecharMenu() {
  menuAberto.value = false
}

function fazerLogout() {
  authStore.logout()
  fecharMenu()
  router.push('/login')
}

function fecharAoClicarFora(event) {
  if(!event.target.closest('.user-menu-container')){
    fecharMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', fecharAoClicarFora)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', fecharAoClicarFora)
})

</script>

<template>
    <header class="header">
        <div class="header-title">
          <h1>{{ route.meta.title }}</h1>

          <p>{{ route.meta.description }}</p>
        </div>

        <div v-if="route.meta.headerAction" class="header-actions">
            <RouterLink
                :to="route.meta.headerAction.to"
                class="btn btn-primary"
            >
                {{ route.meta.headerAction.label }}
            </RouterLink>
        </div>

        <div class="user-menu-container">
          <button
            type="button"
            class="user-info"
            @click.stop="alternarMenu"
            :aria-expanded="menuAberto"
            aria-haspopup="true"
          >
            <div class="user-avatar">
              {{ authStore.usuario?.nome?.charAt(0)?.toUpperCase() || 'U' }}
            </div>

            <div class="user-details">
              <strong>{{ authStore.usuario?.nome }}</strong>
              <small>{{ authStore.usuario?.email }}</small>
            </div>

            <span class="dropdown-arrow" :class="{aberto: menuAberto}">
              ▼
            </span>
          </button>

          <div v-if="menuAberto" class="dropdown-menu">
            <button
              type="button"
              class="dropdown-item logout-item"
              @click="fazerLogout"
            >
              <span>↪</span>
              Sair da Conta
            </button>
          </div>
        </div>
    </header>
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 36px;
  gap: 20px;
  background-color: #dcdfe4;
}

.header-actions {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.header-actions .btn {
  text-decoration: none;
}

.btn {
  padding: 11px 22px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary {
  background: #152436;

  color: #ffffff;
}

.btn-primary:hover {
  background: #094794;
}

.header-title h1 {
  margin: 0;

  color: #152238;

  font-size: 28px;
  font-weight: 700;
}

.header-title p {
  margin: 4px 0 0;

  color: #718096;

  font-size: 14px;
}

.user-menu-container {
  position: relative;
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
}

.user-info:hover {
  background: #f1f5f9;
}

.user-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #d8e4f5;
  color: #0f2a4d;
  font-size: 16px;
  font-weight: 700;
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}

.user-details strong {
  font-size: 14px;
  color: #1e293b;
}

.user-details small {
  font-size: 12px;
  color: #64748b;
}

.dropdown-arrow {
  margin-left: 4px;
  font-size: 10px;
  color: #64748b;
  transition: transform 0.2s ease;
}

.dropdown-arrow.aberto {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1000;
  min-width: 190px;
  padding: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(15, 42, 77, 0.12);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
}

.logout-item {
  color: #dc2626;
}

.logout-item:hover {
  background: #fef2f2;
}
</style>