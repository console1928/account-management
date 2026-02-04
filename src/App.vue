<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <AccountsManager />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AccountsManager from '@/components/AccountsManager.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #ddd;
}

.el-main {
  padding: 30px 20px;
}
</style>
