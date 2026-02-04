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
    <div class="manager-hint">
      <el-icon class="hint-icon" :size="20" color="#409EFF">
        <QuestionFilled />
      </el-icon>
      <span class="hint-text">
        Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
      </span>
    </div>

    <el-divider />

    <div v-if="accounts.length === 0" class="empty-state">
      <el-empty description="Учетные записи отсутствуют" :image-size="100">
        <el-button type="primary" @click="addNewAccount"> Создать первую учетную запись </el-button>
      </el-empty>
    </div>

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
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { useAccountsStore, type Account } from '@/stores/accounts'
import AccountItem from './AccountItem.vue'

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

.manager-hint {
  display: flex;
  background: var(--el-bg-color);
  padding: 10px;
  border-radius: 8px;
  color: var(--el-text-color-primary);
}

.hint-icon {
  margin-right: 20px;
}

.manager-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 22px;
  font-weight: 600;
}

.empty-state {
  margin-top: 40px;
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 40px 20px;
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
