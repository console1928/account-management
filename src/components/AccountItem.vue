<template>
  <el-card class="account-item" shadow="hover">
    <div class="account-row">
      <div class="account-header">
        <span class="account-number">Учетная запись #{{ account.id }}</span>
      </div>

      <div class="form-field">
        <label class="field-label">Метки</label>
        <el-input
          v-model="localAccount.label"
          placeholder="Labels (optional)"
          maxlength="50"
          :class="{ 'is-error': errors.label }"
          @blur="validateField('label')"
        />
        <span v-if="errors.label" class="error-message">{{ errors.label }}</span>
      </div>

      <div class="form-field">
        <label class="field-label">Тип записи</label>
        <el-select
          v-model="localAccount.type"
          placeholder="Select type"
          class="select-input"
          :class="{ 'is-error': errors.type }"
          @change="handleTypeChange"
        >
          <el-option label="LDAP" value="ldap" />
          <el-option label="Локальная" value="local" />
        </el-select>
      </div>

      <div class="form-field">
        <label class="field-label">Логин</label>
        <el-input
          v-model="localAccount.username"
          placeholder="Enter username"
          maxlength="100"
          :class="{ 'is-error': errors.username }"
          @blur="validateField('username')"
        />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
      </div>

      <div v-if="localAccount.type === 'local'" class="form-field">
        <label class="field-label">Пароль</label>
        <el-input
          v-model="localAccount.password"
          type="password"
          placeholder="Enter password"
          maxlength="100"
          show-password
          :class="{ 'is-error': errors.password }"
          @blur="validateField('password')"
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>
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
import { ref, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { useAccountsStore, type Account, type AccountType } from '@/stores/accounts'

const props = defineProps<{
  account: Account
}>()

const emit = defineEmits<{
  delete: [id: number]
  update: [id: number, account: Partial<Account>]
  validate: [id: number]
}>()

const store = useAccountsStore()

const localAccount = ref<Partial<Account>>({
  label: props.account.label,
  type: props.account.type,
  username: props.account.username,
  password: props.account.password,
})

const errors = ref<Record<string, string>>({})
const touchedFields = ref<Set<string>>(new Set())

const validateField = (field: string) => {
  touchedFields.value.add(field)

  errors.value[field] = ''

  switch (field) {
    case 'label':
      if (localAccount.value.label && localAccount.value.label.length > 50) {
        errors.value[field] = 'Не более 50 символов'
      }
      break

    case 'username':
      if (!localAccount.value.username || localAccount.value.username.trim() === '') {
        errors.value[field] = 'Обязательное поле'
      } else if (localAccount.value.username.length > 100) {
        errors.value[field] = 'Не более 100 символов'
      }
      break

    case 'password':
      if (localAccount.value.type === 'local') {
        if (!localAccount.value.password || localAccount.value.password.trim() === '') {
          errors.value[field] = 'Обязательное поле'
        } else if (localAccount.value.password.length > 100) {
          errors.value[field] = 'Не более 100 символов'
        }
      }
      break
  }

  emit('validate', props.account.id)
}

const handleTypeChange = (value: AccountType) => {
  localAccount.value.type = value

  if (value === 'ldap') {
    localAccount.value.password = null
    errors.value.password = ''
  }

  validateField('username')

  if (value === 'local') {
    validateField('password')
  }

  emit('update', props.account.id, {
    type: value,
    password: value === 'ldap' ? null : localAccount.value.password,
  })
}

const handleDelete = () => {
  emit('delete', props.account.id)
}

watch(
  localAccount,
  (newVal) => {
    emit('update', props.account.id, {
      label: newVal.label,
      username: newVal.username,
      password: newVal.password,
    })
  },
  { deep: true },
)

watch(
  () => props.account,
  (newAccount) => {
    localAccount.value = {
      label: newAccount.label,
      type: newAccount.type,
      username: newAccount.username,
      password: newAccount.password,
    }
  },
  { immediate: true },
)
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

.form-field {
  display: flex;
  flex-direction: column;
  min-width: 160px;
  flex: 1;
  max-width: 220px;
}

.field-label {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.2;
}

.is-error {
  --el-input-border-color: var(--el-color-danger);
}

.is-error :deep(.el-input__wrapper),
.is-error :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.is-error :deep(.el-input__wrapper:hover),
.is-error :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.error-message {
  font-size: 11px;
  color: var(--el-color-danger);
  margin-top: 2px;
  min-height: 16px;
}

.select-input {
  width: 100%;
}

:deep(.el-select__wrapper) {
  padding: 6px 28px 6px 12px;
}

@media (max-width: 1200px) {
  .account-row {
    gap: 8px;
  }

  .account-header {
    min-width: 90px;
    margin-right: 8px;
  }

  .form-field {
    min-width: 140px;
    max-width: 180px;
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

  .form-field {
    min-width: 100%;
    max-width: 100%;
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
