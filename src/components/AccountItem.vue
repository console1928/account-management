<template>
  <el-card class="account-item" shadow="hover">
    <div class="account-row">
      <div class="account-header">
        <span class="account-number">Учетная запись #{{ account.id }}</span>
      </div>

      <AccountForm :account="account" @update="handleUpdate" />

      <el-button
        class="delete-button"
        type="danger"
        size="small"
        :icon="Delete"
        @click="handleDelete"
        circle
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { type Account } from '@/stores/accounts'
import AccountForm from './AccountForm.vue'

const props = defineProps<{
  account: Account
}>()

const emit = defineEmits<{
  delete: [id: number]
  update: [id: number, account: Partial<Account>]
}>()

const handleDelete = () => {
  emit('delete', props.account.id)
}

const handleUpdate = (id: number, updates: Partial<Account>) => {
  emit('update', id, updates)
}
</script>

<style scoped>
.account-item {
  margin-bottom: 12px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.account-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.account-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 0;
}

.account-header {
  min-width: 110px;
  padding-right: 8px;
  margin-top: 25px;
  margin-right: 12px;
}

.account-number {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.delete-button {
  margin-top: 20px;
  margin-right: 5px;
  margin-left: auto;
}

@media (max-width: 1200px) {
  .account-row {
    gap: 8px;
  }

  .account-header {
    min-width: 90px;
    margin-right: 8px;
  }
}

@media (max-width: 992px) {
  .account-row {
    flex-direction: column;
    gap: 10px;
  }

  .account-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: 100%;
    padding-bottom: 8px;
    margin-right: 0;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .account-number {
    font-size: 13px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    padding: 5px 10px;
  }
}
</style>
