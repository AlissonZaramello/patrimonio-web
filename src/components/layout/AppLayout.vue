<template>
  <div class="app-layout">
    <Sidebar />

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import { RouterView } from 'vue-router'
</script>

<style>
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
}
</style>