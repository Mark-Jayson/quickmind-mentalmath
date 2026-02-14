<template>
  <div class="app-shell">
    <NavBar v-if="!isFullscreen" />
    <main :class="['app-content', { 'app-content--fullscreen': isFullscreen }]">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './NavBar.vue'

const route = useRoute()

const isFullscreen = computed(() => {
  return route.name === 'Mathlympics' && route.query.playing === 'true'
})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-workshop);
}

.app-content {
  flex: 1;
  padding-top: 64px;
}

.app-content--fullscreen {
  padding-top: 0;
}
</style>
