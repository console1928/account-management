import { defineStore } from 'pinia'

export type AccountType = 'ldap' | 'local'

export interface LabelTag {
  text: string
}

export interface Account {
  id: number
  label: string | null
  type: AccountType
  username: string
  password: string | null
  isValid?: boolean
  errors?: {
    username?: string
    password?: string
  }
}

export interface AccountsState {
  accounts: Account[]
  nextId: number
  version: number
}

export const useAccountsStore = defineStore('accounts', {
  state: (): AccountsState => ({
    accounts: [],
    nextId: 1,
    version: 1,
  }),

  persist: {
    key: 'accounts-store',
    storage: localStorage,
    paths: ['accounts', 'nextId', 'version'],
    serializer: {
      serialize: (state) => JSON.stringify(state),
      deserialize: (value) => JSON.parse(value),
    },
  },

  actions: {
    addAccount(account: Omit<Account, 'id' | 'isValid' | 'errors'>) {
      const newAccount: Account = {
        id: this.nextId++,
        label: account.label,
        type: account.type,
        username: account.username,
        password: account.type === 'ldap' ? null : account.password,
        isValid: false,
        errors: {},
      }
      this.accounts.push(newAccount)
    },

    updateAccount(id: number, updates: Partial<Account>) {
      const account = this.accounts.find((acc) => acc.id === id)
      if (account) {
        Object.assign(account, updates)
      }
    },

    removeAccount(id: number) {
      this.accounts = this.accounts.filter((account) => account.id !== id)
    },

    validateAccount(id: number): boolean {
      const account = this.accounts.find((acc) => acc.id === id)
      if (!account) return false

      const errors: Account['errors'] = {}
      let isValid = true

      if (!account.username || account.username.trim() === '') {
        errors.username = 'Username is required'
        isValid = false
      } else if (account.username.length > 100) {
        errors.username = 'Username must be max 100 characters'
        isValid = false
      }

      if (account.type === 'local') {
        if (!account.password || account.password.trim() === '') {
          errors.password = 'Password is required for local accounts'
          isValid = false
        } else if (account.password.length > 100) {
          errors.password = 'Password must be max 100 characters'
          isValid = false
        }
      }

      if (account.label && account.label.length > 50) {
        errors.username = 'Label must be max 50 characters'
        isValid = false
      }

      account.errors = errors
      account.isValid = isValid

      return isValid
    },

    clearAccounts() {
      this.accounts = []
      this.nextId = 1
    },

    initialize() {
      if (!this.accounts) {
        this.accounts = []
      }
      if (!this.nextId) {
        this.nextId = 1
      }
    },
  },
})
