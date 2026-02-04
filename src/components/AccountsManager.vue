<template>
  <div class="accounts-manager">
    <div class="manager-header">
      <div class="header-left">
        <h2>Учетные записи</h2>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="addNewAccount"
          >Добавить учетную запись</el-button
        >
      </div>
    </div>

    <HintBox />

    <el-divider />

    <EmptyState v-if="accounts.length === 0" @create="addNewAccount" />

    <div v-else class="accounts-list">
      <AccountItem
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        @delete="handleDeleteAccount"
        @update="handleUpdateAccount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useAccountsStore, type Account } from '@/stores/accounts'
import AccountItem from './AccountItem.vue'
import HintBox from './HintBox.vue'
import EmptyState from './EmptyState.vue'

const store = useAccountsStore()

const accounts = computed(() => store.accounts)

const addNewAccount = () => {
  store.addAccount({
    label: null,
    type: 'local',
    username: '',
    password: '',
  })
}

const handleDeleteAccount = (id: number) => {
  store.removeAccount(id)
}

const handleUpdateAccount = (id: number, updates: Partial<Account>) => {
  store.updateAccount(id, updates)
}
</script>

<style scoped>
.accounts-manager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.manager-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 22px;
  font-weight: 600;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.el-divider--horizontal) {
  margin: 16px 0;
}

@media (max-width: 768px) {
  .manager-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-left,
  .header-actions {
    width: 100%;
  }

  .header-actions {
    justify-content: space-between;
  }

  .manager-header h2 {
    font-size: 20px;
  }
}
</style>
