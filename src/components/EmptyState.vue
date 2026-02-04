<template>
  <div class="empty-state">
    <el-empty description="Учетные записи отсутствуют" :image-size="100">
      <el-button type="primary" @click="onCreate"> Создать первую учетную запись </el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  create: []
}>()

const onCreate = () => {
  emit('create')
}
</script>

<style scoped>
.empty-state {
  margin-top: 40px;
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 40px 20px;
}
</style>
