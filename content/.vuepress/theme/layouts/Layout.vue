<template>
  <!-- Uses @vuepress/theme-default Layout directly.
       CThemeProvider (Chakra UI) removed — Tailwind handles styling.
       Notification banner is rendered via rootComponents in client.ts. -->
  <Layout />
</template>

<script setup lang="ts">
import { Layout } from '@vuepress/theme-default/client'
</script>
