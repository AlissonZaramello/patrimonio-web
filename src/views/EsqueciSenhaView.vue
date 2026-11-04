<template>
  <main class="auth-page">
    <section class="auth-image" aria-label="SICPAT-RFID">
      <img src="@/assets/images/login-left.jpg" alt="" />
    </section>

    <section class="auth-section">
      <div class="auth-card">
        <div class="logo-container">
          <img src="@/assets/images/logo-sicpat.png" alt="Logo SICPAT-RFID" />
        </div>

        <header class="auth-header">
          <h1>Esqueceu sua senha?</h1>
          <p>Informe seu e-mail cadastrado para receber as instruções de recuperação.</p>
        </header>

        <div v-if="successMessage" class="message message-success" role="status" aria-live="polite">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="message message-error" role="alert" aria-live="polite">
          {{ errorMessage }}
        </div>

        <form v-if="!successMessage" @submit.prevent="solicitarRecuperacao">
          <label class="field-label" for="email">E-mail</label>
          <div class="input-group">
            <span class="input-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8" />
                <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autocomplete="email"
              required
              maxlength="254"
              :disabled="isSubmitting"
            />
          </div>

          <button class="primary-button" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviando...' : 'Enviar instruções' }}
          </button>
        </form>

        <button class="back-button" type="button" @click="voltarLogin">
          Voltar para o login
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const solicitarRecuperacao = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
  if (!apiUrl) {
    errorMessage.value = 'A API não está configurada. Entre em contato com o administrador do sistema.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })

    if (!response.ok) {
      throw new Error('Não foi possível processar a solicitação. Tente novamente mais tarde.')
    }

    successMessage.value = 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha. Verifique também sua caixa de spam.'
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error)
    errorMessage.value = error instanceof TypeError
      ? 'Não foi possível conectar ao sistema. Verifique sua conexão e tente novamente.'
      : (error.message || 'Ocorreu um erro inesperado. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

const voltarLogin = () => router.push('/login')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap');

.auth-page { 
  position: fixed; 
  inset: 0; 
  display: flex; 
  overflow: auto; 
  font-family: 'Roboto', sans-serif; 
}

.auth-image { 
  width: 55%; 
  min-height: 100vh; 
  overflow: hidden; 
}

.auth-image img { 
  display: block; 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.auth-section { 
  width: 45%; 
  min-height: 100vh; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  padding: 40px; 
  background: radial-gradient(circle at 90% 10%, rgba(37, 99, 235, .04), transparent 25%), #a1a1a1; 
  box-sizing: border-box; 
}

.auth-card { 
  width: 100%; 
  max-width: 510px; 
  padding: 42px 42px 36px; 
  background: #fff; 
  border: 1px solid rgba(226, 232, 240, .8); 
  border-radius: 22px; 
  box-shadow: 0 15px 45px rgba(15, 23, 42, .08); 
  box-sizing: border-box; 
}

.logo-container { 
  display: flex; 
  justify-content: center; 
  margin-bottom: 20px; 
}

.logo-container img { 
  display: block; 
  width: 100%; 
  max-width: 400px; 
  height: auto; 
  object-fit: contain; 
}

.auth-header { 
  margin-bottom: 28px; 
  text-align: center; 
}

.auth-header h1 {
  margin: 0 0 10px; 
  color: #152238; 
  font-size: clamp(28px, 2.3vw, 36px); 
  font-weight: 700; 
  letter-spacing: -.6px; 
}

.auth-header p { 
  margin: 0; 
  color: #718096; 
  font-size: 15px; 
  line-height: 1.6; 
}

.field-label { 
  display: block; 
  margin: 0 0 8px 2px; 
  color: #334155; 
  font-size: 14px; 
  font-weight: 600; 
}

.input-group { 
  display: flex; 
  align-items: center; 
  width: 100%; 
  height: 58px; 
  margin-bottom: 18px; 
  border: 1px solid #d9e0e8; 
  border-radius: 11px; 
  background: #fff; 
  transition: border-color .2s, box-shadow .2s; 
  box-sizing: border-box; 
}

.input-group:focus-within { 
  border-color: #152436; 
  box-shadow: 0 0 0 3px rgba(37, 99, 235, .1); 
}

.input-icon { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  width: 54px; 
  color: #68788f; 
  flex-shrink: 0; 
}

.input-icon svg { 
  width: 22px; 
  height: 22px; 
}

.input-group input { 
  flex: 1; 
  min-width: 0; 
  height: 100%; 
  padding: 0 14px 0 0; 
  border: 0; 
  outline: 0; 
  color: #1e293b; 
  font: inherit; 
  font-size: 16px; 
  background: transparent; 
}

.input-group input::placeholder { 
  color: #7b8799; 
}

.primary-button { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  width: 100%; 
  min-height: 56px; 
  margin-top: 8px; 
  padding: 12px 18px; 
  border: 0; 
  border-radius: 9px; 
  background: #152436; 
  color: #fff; 
  font: inherit; 
  font-size: 16px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: background .2s, transform .1s; 
}

.primary-button:hover:not(:disabled) { 
  background: #094794; 
}

.primary-button:active:not(:disabled) { 
  transform: translateY(1px); 
}

.primary-button:disabled { 
  opacity: .65; 
  cursor: wait; 
}

.back-button { 
  display: block; 
  margin: 24px auto 0; 
  padding: 8px; 
  border: 0; 
  background: transparent; 
  color: #2563eb; 
  font: inherit; 
  font-size: 15px; 
  cursor: pointer; 
}

.back-button:hover { 
  text-decoration: underline; 
}

.message { 
  margin-bottom: 20px; 
  padding: 13px 15px;
  border: 1px solid; 
  border-radius: 10px; 
  font-size: 14px; 
  line-height: 1.5; 
}

.message-success { 
  border-color: #abefc6; 
  background: #ecfdf3; 
  color: #067647; 
}

.message-error { 
  border-color: #fecdca; 
  background: #fef3f2; 
  color: #b42318; 
}

@media (max-width: 900px) { 
  .auth-image { 
    display: none; 
  } 

  .auth-section { 
    width: 100%; 
    padding: 24px; 
  } 
}

@media (max-width: 480px) { 
  .auth-card { 
    padding: 30px 22px; 
    border-radius: 16px; 
  } 
  
  .auth-header h1 { 
    font-size: 28px; 
  } 
}

</style>
