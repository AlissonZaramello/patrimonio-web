import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    usuario: JSON.parse(localStorage.getItem('usuario')) || null
  }),

  actions: {
    login(dados) {
      this.token = dados.token

      this.usuario = {
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        role: dados.role
      }

      localStorage.setItem('token', dados.token)
      localStorage.setItem('usuario', JSON.stringify(this.usuario))
    },

    logout() {
      this.token = null
      this.usuario = null

      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
  }
})