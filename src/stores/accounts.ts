import { defineStore } from 'pinia'

export type AccountType = 'ldap' | 'local'

export interface LabelTag {
  text: string
}

export interface Account {
  id: number
  label: LabelTag[] | null
  type: AccountType
  username: string
  password: string | null
  isValid?: boolean
  errors?: {
    username?: string
    password?: string
    label?: string
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
        label: account.label ?? [],
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
  },
})
