<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
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

        <div class="user-info">
          <div class="user-avatar"></div>

          <div class="user-details">
            <strong>{{authStore.usuario?.nome}}</strong>
            <small>{{authStore.usuario?.email}}</small>
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

.user-info {
  display: flex;
  align-items: center;

  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;

  border-radius: 50%;

  background: #d8e4f5;
}

.user-details {
  display: flex;
  flex-direction: column;

  line-height: 1.3;
}

.user-details strong {
  color: #152238;

  font-size: 14px;
}

.user-details small {
  color: #718096;

  font-size: 12px;
}
</style>