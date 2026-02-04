<template>
  <div class="form-field">
    <label class="field-label">Метки</label>
    <el-input
      v-model="labelInput"
      placeholder="Введите метки (необязательно)"
      maxlength="50"
      :class="{ 'is-error': errors.label }"
      @blur="handleLabelBlur"
    />
    <span v-if="errors.label" class="error-message">{{ errors.label }}</span>
  </div>

  <div class="form-field">
    <label class="field-label">Тип записи</label>
    <el-select
      v-model="localAccount.type"
      placeholder="Выберите тип"
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
      placeholder="Введите логин"
      maxlength="100"
      :class="{ 'is-error': errors.username }"
      @blur="handleUsernameBlur"
    />
    <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
  </div>

  <div v-if="localAccount.type === 'local'" class="form-field">
    <label class="field-label">Пароль</label>
    <el-input
      v-model="localAccount.password"
      type="password"
      placeholder="Введите пароль"
      maxlength="100"
      show-password
      :class="{ 'is-error': errors.password }"
      @blur="handlePasswordBlur"
    />
    <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { type Account, type AccountType, type LabelTag } from '@/stores/accounts'

const props = defineProps<{
  account: Account
}>()

const emit = defineEmits<{
  update: [id: number, updates: Partial<Account>]
}>()

const labelInput = ref('')
const localAccount = ref<Partial<Account>>({
  type: props.account.type,
  username: props.account.username,
  password: props.account.password,
})
const errors = ref<Record<string, string>>({})
const touchedFields = ref<Set<string>>(new Set())

const initializeLabelInput = () => {
  if (props.account.label && props.account.label.length > 0) {
    labelInput.value = props.account.label.map((tag) => tag.text).join(';')
  } else {
    labelInput.value = ''
  }
}

const handleLabelBlur = () => {
  touchedFields.value.add('label')
  const tags: LabelTag[] = labelInput.value
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map((text) => ({ text }))
  const newLabel = tags.length > 0 ? tags : null
  localAccount.value.label = newLabel
  emit('update', props.account.id, { label: newLabel })
}

const validateField = (field: string) => {
  touchedFields.value.add(field)
  errors.value[field] = ''

  switch (field) {
    case 'username':
      if (!localAccount.value.username?.trim()) {
        errors.value[field] = 'Обязательное поле'
      }
      break
    case 'password':
      if (localAccount.value.type === 'local' && !localAccount.value.password?.trim()) {
        errors.value[field] = 'Обязательное поле'
      }
      break
  }
}

const handleTypeChange = (value: AccountType) => {
  localAccount.value.type = value
  if (value === 'ldap') {
    localAccount.value.password = null
    errors.value.password = ''
  }
  emit('update', props.account.id, {
    type: value,
    password: value === 'ldap' ? null : localAccount.value.password,
  })
}

const handleUsernameBlur = () => {
  validateField('username')
  emit('update', props.account.id, { username: localAccount.value.username })
}

const handlePasswordBlur = () => {
  validateField('password')
  emit('update', props.account.id, { password: localAccount.value.password })
}

watch(
  () => props.account,
  (newAccount) => {
    localAccount.value = {
      label: newAccount.label,
      type: newAccount.type,
      username: newAccount.username,
      password: newAccount.password,
    }
    initializeLabelInput()
  },
  { immediate: true },
)

onMounted(() => {
  initializeLabelInput()
})
</script>

<style scoped>
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

@media (max-width: 1200px) {
  .form-field {
    min-width: 140px;
    max-width: 180px;
  }
}

@media (max-width: 992px) {
  .form-field {
    min-width: 100%;
    max-width: 100%;
  }
}
</style>
