<template>
  <AppShell>
    <router-view v-slot="{ Component, route }">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </AppShell>
</template>

<script setup>
import AppShell from '@/components/layout/AppShell.vue'
</script>
