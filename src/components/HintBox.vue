<template>
  <div class="hint-box">
    <el-icon class="hint-icon" :size="20" color="#409EFF">
      <QuestionFilled />
    </el-icon>
    <span class="hint-text">
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </span>
  </div>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.hint-box {
  display: flex;
  background: var(--el-bg-color);
  padding: 10px;
  border-radius: 8px;
  color: var(--el-text-color-primary);
}

.hint-icon {
  margin-right: 20px;
}
</style>
