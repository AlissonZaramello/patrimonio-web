<template>

  <div class="app-layout">
    <Sidebar />
    <main class="content">
      <Header />
      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>

</template>

<script setup>
import Header from './Header.vue';
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
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>