<template>
  <div class="login-page">
    <!-- ================================= -->
    <!-- LADO ESQUERDO - IMAGEM -->
    <!-- ================================= -->
    <section class="login-image">
      <img src="@/assets/images/login-left.jpg" alt="SICPAT-RFID" />
    </section>

    <!-- ================================= -->
    <!-- LADO DIREITO - LOGIN -->
    <!-- ================================= -->
    <section class="login-section">
      <div class="login-card">
        <!-- Logo -->
        <div class="logo-container">
          <img src="@/assets/images/logo-sicpat.png" alt="Logo SICPAT-RFID" />
        </div>

        <!-- Título -->
        <div class="login-header">
          <h1>Acesso ao Sistema</h1>

          <p>Informe suas credenciais para entrar</p>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleLogin">
          <!-- Usuário -->
          <div class="input-group">
            <div class="input-icon">
              <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
                fill="currentColor" viewBox="0 0 24 24" >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-8.61 10.79c.18.14.4.21.61.21s.43-.07.61-.21l1.55-1.21L18.58 18H5.41l4.42-4.42 1.55 1.21ZM20 6v.51l-8 6.22-8-6.22V6zm0 3.04v7.54l-4.24-4.24zm-11.76 3.3L4 16.58V9.04zM20 18"></path>
              </svg>
            </div>

            <input v-model="email" type="text" placeholder="E-mail" autocomplete="email" />
          </div>

          <!-- Senha -->
          <div class="input-group">
            <div class="input-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" />

                <path
                  d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Senha"
              autocomplete="current-password"
            />

            <!-- Mostrar senha -->
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              aria-label="Mostrar ou ocultar senha"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                  stroke="currentColor"
                  stroke-width="2"
                />

                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
              </svg>

              <svg v-else viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3L21 21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />

                <path
                  d="M10.6 5.2C11.05 5.07 11.52 5 12 5C18.5 5 22 12 22 12C22 12 20.8 14.4 18.5 16.2"
                  stroke="currentColor"
                  stroke-width="2"
                />

                <path
                  d="M6.1 6.1C3.45 8.1 2 12 2 12C2 12 5.5 19 12 19C13.5 19 14.85 18.65 16.05 18.1"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>

          <!-- Botão -->
          <button type="submit" class="login-button">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" />

              <path
                d="M8 10V7C8 4.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9V10"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>

            <span>Entrar</span>
          </button>
        </form>

        <!-- Recuperação de senha -->
        <button type="button" class="forgot-password" @click="handleForgotPassword">
          Esqueci minha senha
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = () => {
  console.log('Email:', email.value)
  console.log('Senha:', password.value)

  // Futuramente:
  // chamada para a API Java
}

const handleForgotPassword = () => {
  console.log('Recuperação de senha')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.login-page {
  position: fixed;
  inset: 0;

  width: 100vw;
  height: 100vh;

  margin: 0;
  padding: 0;

  display: flex;

  overflow: hidden;
}

/* ========================================= */
/* IMAGEM ESQUERDA */
/* ========================================= */

.login-image {
  width: 55%;
  min-height: 100vh;

  margin: 0;
  padding: 0;

  overflow: hidden;
}

.login-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

/* ========================================= */
/* ÁREA DIREITA */
/* ========================================= */

.login-section {
  width: 45%;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 40px;

  background: radial-gradient(circle at 90% 10%, rgba(37, 99, 235, 0.04), transparent 25%), #a1a1a1;
}

/* ========================================= */
/* CARD */
/* ========================================= */

.login-card {
  width: 100%;
  max-width: 510px;

  padding: 46px 48px 44px;

  background: #ffffff;

  border-radius: 22px;

  box-shadow: 0 15px 45px rgba(15, 23, 42, 0.08);

  border: 1px solid rgba(226, 232, 240, 0.8);
}

/* ========================================= */
/* LOGO */
/* ========================================= */

.logo-container {
  display: flex;
  justify-content: center;
}

.logo-container img {
  min-width: 400px;
}

/* ========================================= */
/* CABEÇALHO */
/* ========================================= */

.login-header {
  text-align: center;

  margin-bottom: 36px;
}

.login-header h1 {
  margin: 0 0 10px;

  color: #152238;

  font-size: 40px;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;

  letter-spacing: -0.8px;
}

.login-header p {
  margin: 0;

  color: #718096;

  font-family: 'Roboto', sans-serif;

  font-size: 16px;
}

/* ========================================= */
/* INPUTS */
/* ========================================= */

.input-group {
  width: 100%;
  height: 66px;

  display: flex;
  align-items: center;

  position: relative;

  margin-bottom: 18px;

  border: 1px solid #d9e0e8;
  border-radius: 11px;

  background: #ffffff;

  transition: all 0.2s ease;
}

.input-group:focus-within {
  border-color: #152436;

  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-icon {
  width: 60px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #68788f;
}

.input-icon svg {
  width: 23px;
  height: 23px;
}

.input-group input {
  flex: 1;

  height: 100%;

  padding: 0 16px 0 0;

  border: none;
  outline: none;

  color: #1e293b;

  font-size: 17px;

  background: transparent;
}

.input-group input::placeholder {
  color: #7b8799;
}

/* ========================================= */
/* BOTÃO MOSTRAR SENHA */
/* ========================================= */

.password-toggle {
  width: 58px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  border: none;
  background: transparent;

  color: #68788f;

  cursor: pointer;
}

.password-toggle svg {
  width: 23px;
  height: 23px;
}

.password-toggle:hover {
  color: #2563eb;
}

/* ========================================= */
/* BOTÃO ENTRAR */
/* ========================================= */

.login-button {
  width: 100%;
  height: 58px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  margin-top: 10px;

  border: none;
  border-radius: 9px;

  background: #152436;

  color: white;

  font-size: 18px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.1s ease,
    box-shadow 0.2s ease;
}

.login-button svg {
  width: 20px;
  height: 20px;
}

.login-button:hover {
  background: #094794;

  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
}

.login-button:active {
  transform: translateY(1px);
}

/* ========================================= */
/* ESQUECI MINHA SENHA */
/* ========================================= */

.forgot-password {
  display: block;

  margin: 36px auto 0;

  border: none;
  background: transparent;

  color: #2563eb;

  font-size: 16px;

  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* ========================================= */
/* RESPONSIVIDADE */
/* ========================================= */

@media (max-width: 1000px) {
  .login-image {
    width: 50%;
  }

  .login-section {
    width: 50%;

    padding: 25px;
  }

  .login-card {
    padding: 38px 32px;
  }

  .login-header h1 {
    font-size: 27px;
  }
}

@media (max-width: 750px) {
  .login-page {
    display: block;
  }

  /*
    No celular escondemos a imagem.
    O usuário vê somente o formulário.
  */

  .login-image {
    display: none;
  }

  .login-section {
    width: 100%;
    min-height: 100vh;

    padding: 20px;
  }

  .login-card {
    max-width: 500px;

    padding: 38px 25px;
  }
}
</style>
