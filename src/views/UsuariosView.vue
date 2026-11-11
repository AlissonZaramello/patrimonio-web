<template>
  <div class="usuarios-page">
    <!-- ================================= -->
    <!-- CONTEÚDO -->
    <!-- ================================= -->
    <main class="usuarios-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/dashboard">Dashboard</RouterLink>

        <span class="breadcrumb-separator">›</span>

        <span class="breadcrumb-current">Usuários</span>
      </nav>

      <!-- Filtros -->
      <section class="filtros-card">
        <h2 class="section-title">
          <span class="section-icon">🔎</span>

          Filtros de Pesquisa
        </h2>

        <div class="filtros-row">
          <div class="filtro-field">
            <label for="filtroNome">Nome ou E-mail</label>

            <input id="filtroNome" v-model="filtros.nome" type="text" placeholder="Digite o nome ou e-mail" />
          </div>

          <div class="filtro-field">
            <label for="filtroPerfil">Perfil</label>

            <select id="filtroPerfil" v-model="filtros.perfil">
              <option value="">Todos os perfis</option>

              <option v-for="perfil in perfis" :key="perfil">{{ perfil }}</option>
            </select>
          </div>

          <div class="filtro-field">
            <label for="filtroStatus">Status</label>

            <select id="filtroStatus" v-model="filtros.status">
              <option value="">Todos</option>

              <option>Ativo</option>

              <option>Inativo</option>
            </select>
          </div>
          <button type="button" class="btn btn-outline" @click="limparFiltros">Limpar Filtros</button>
        </div>
      </section>

      <div class="acoes-listagem">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="carregando"
          @click="carregarUsuarios"
        >
          {{ carregando ? 'Carregando...' : 'Atualizar usuários' }}
        </button>
      </div>

      <p v-if="erroConsulta" class="mensagem-erro">
        {{ erroConsulta }}
      </p>

      <!-- Cards de indicadores -->
      <section class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon blue">👥</span>

          <div class="stat-data">
            <span class="stat-title">Total de Usuários</span>

            <strong class="stat-value blue">{{ totalUsuarios }}</strong>

            <small>Cadastrados no sistema</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon green">✅</span>

          <div class="stat-data">
            <span class="stat-title">Usuários Ativos</span>

            <strong class="stat-value green">{{ usuariosAtivos }}</strong>

            <small>Com acesso liberado</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon orange">⛔</span>

          <div class="stat-data">
            <span class="stat-title">Usuários Inativos</span>

            <strong class="stat-value orange">{{ usuariosInativos }}</strong>

            <small>Acesso bloqueado</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon purple">🛡️</span>

          <div class="stat-data">
            <span class="stat-title">Administradores</span>

            <strong class="stat-value purple">{{ totalAdministradores }}</strong>

            <small>Perfil de administrador</small>
          </div>
        </div>
      </section>

      <!-- Tabela de usuários -->
      <section class="tabela-card">
        <h2 class="section-title">Usuários Encontrados</h2>

        <table class="usuario-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td class="cell-nome">
                <div class="celula-usuario">
                  <span
                    class="avatar-mini"
                    :style="{ background: corAvatar(usuario.nome) }"
                  >
                    {{ iniciais(usuario.nome) }}
                  </span>

                  <div>
                    <strong>{{ usuario.nome }}</strong>
                  </div>
                </div>
              </td>

              <td>{{ usuario.email }}</td>

              <td>
                <span
                  class="perfil-badge"
                  :class="classePerfil(formatarPerfil(usuario.role))"
                >
                  {{ formatarPerfil(usuario.role) }}
                </span>
              </td>

              <td>
                <span
                  class="status-badge"
                  :class="classeStatus(formatarStatus(usuario.ativo))"
                >
                  {{ formatarStatus(usuario.ativo) }}
                </span>
              </td>
            </tr>

            <tr v-if="!carregando && usuarios.length === 0">
              <td colspan="4" class="vazio">
                Nenhum usuário encontrado.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        <div class="paginacao">
          <span class="paginacao-info">
            Mostrando {{ usuarios.length }} de
            {{ totalUsuarios }} usuários
          </span>
        </div>
      </section>
    </main>
  </div>
</template>


<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { usuarioService } from '@/services/usuarioService'

const todosUsuarios = ref([])
const carregando = ref(false)
const erroConsulta = ref('')

const perfis = ['Administrador', 'Funcionário']

const filtros = reactive({
  nome: '',
  perfil: '',
  status: '',
})

function formatarPerfil(role) {
  const valor = String(role || '').toLowerCase()

  if (['admin', 'administrador'].includes(valor)) {
    return 'Administrador'
  }

  if (['funcionario', 'funcionário'].includes(valor)) {
    return 'Funcionário'
  }

  return role || 'Não informado'
}

function formatarStatus(ativo) {
  return ativo === true
    ? 'Ativo'
    : ativo === false
      ? 'Inativo'
      : 'Não informado'
}

const usuarios = computed(() => {
  const termo = filtros.nome.trim().toLowerCase()

  return todosUsuarios.value.filter(usuario => {
    const correspondeNome =
      !termo ||
      usuario.nome?.toLowerCase().includes(termo) ||
      usuario.email?.toLowerCase().includes(termo)

    const correspondePerfil =
      !filtros.perfil ||
      formatarPerfil(usuario.role) === filtros.perfil

    const correspondeStatus =
      !filtros.status ||
      formatarStatus(usuario.ativo) === filtros.status

    return correspondeNome && correspondePerfil && correspondeStatus
  })
})

const totalUsuarios = computed(() => todosUsuarios.value.length)

const usuariosAtivos = computed(() =>
  todosUsuarios.value.filter(u => u.ativo === true).length
)

const usuariosInativos = computed(() =>
  todosUsuarios.value.filter(u => u.ativo === false).length
)

const totalAdministradores = computed(() =>
  todosUsuarios.value.filter(
    u => formatarPerfil(u.role) === 'Administrador'
  ).length
)

async function carregarUsuarios() {
  carregando.value = true
  erroConsulta.value = ''

  try {
    const dados = await usuarioService.listar()

    if (!Array.isArray(dados)) {
      throw new Error('Resposta inválida da API.')
    }

    todosUsuarios.value = dados
  } catch (erro) {
    todosUsuarios.value = []
    erroConsulta.value =
      erro.message || 'Não foi possível carregar os usuários.'
  } finally {
    carregando.value = false
  }
}

function limparFiltros() {
  filtros.nome = ''
  filtros.perfil = ''
  filtros.status = ''
}

function iniciais(nome = '') {
  return nome
    .split(' ')
    .filter(Boolean)
    .map(parte => parte[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function corAvatar(nome = '') {
  const cores = [
    '#2563eb', '#16a34a', '#9333ea',
    '#ea580c', '#0891b2', '#d97706',
  ]

  return cores[nome.length % cores.length]
}

function classePerfil(perfil) {
  return perfil === 'Administrador'
    ? 'perfil-purple'
    : 'perfil-green'
}

function classeStatus(status) {
  return status === 'Ativo'
    ? 'badge-green'
    : status === 'Inativo'
      ? 'badge-red'
      : 'badge-gray'
}

onMounted(carregarUsuarios)
</script>


<style scoped>
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.usuarios-page {
  width: 100%;
}

/* ========================================= */
/* CONTEÚDO */
/* ========================================= */

.usuarios-content {
  width: 100%;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #dcdfe4;
  box-sizing: border-box;
}

/* ========================================= */
/* BREADCRUMB */
/* ========================================= */

.breadcrumb {
  display: flex;

  align-items: center;

  gap: 8px;

  color: #718096;

  font-size: 13px;
}

.breadcrumb a {
  color: #2563eb;

  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb-current {
  color: #152238;

  font-weight: 600;
}

/* ========================================= */
/* TÍTULOS DE SEÇÃO */
/* ========================================= */

.section-title {
  display: flex;

  align-items: center;

  gap: 10px;

  margin: 0 0 16px;

  color: #152238;

  font-size: 16px;
  font-weight: 700;
}

.section-icon {
  display: flex;

  justify-content: center;

  align-items: center;

  width: 34px;
  height: 34px;

  flex-shrink: 0;

  border-radius: 10px;

  background: rgba(37, 99, 235, 0.12);

  font-size: 16px;
}

.mensagem-erro {
  color: #b91c1c;
  font-weight: 500;
}

.acoes-listagem {
  display: flex;
  justify-content: flex-end;
}

/* ========================================= */
/* FORMULÁRIO */
/* ========================================= */

.form-card,
.filtros-card,
.tabela-card {
  padding: 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.form-grid {
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;

  gap: 18px;
}

.field {
  display: flex;

  flex-direction: column;

  gap: 6px;

  margin-bottom: 16px;
}

.field label {
  color: #334155;

  font-size: 13px;
  font-weight: 600;
}

.field label em {
  color: #dc2626;

  font-style: normal;
}

.field input,
.field select {
  width: 100%;

  padding: 10px 12px;

  border: 1px solid #dbe3ee;
  border-radius: 10px;

  background: #ffffff;

  color: #152238;

  font-size: 14px;
  font-family: inherit;
}

.field input:focus,
.field select:focus {
  outline: none;

  border-color: #2563eb;

  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

/* Status: radios */

.status-options {
  display: flex;

  flex-wrap: wrap;

  gap: 8px;
}

.status-option {
  display: flex;

  align-items: center;

  gap: 6px;

  padding: 8px 12px;

  border: 1px solid #dbe3ee;
  border-radius: 10px;

  color: #334155;

  font-size: 13px;

  cursor: pointer;
}

.status-option:has(input:checked) {
  border-color: #2563eb;

  background: rgba(37, 99, 235, 0.08);

  color: #2563eb;

  font-weight: 600;
}

/* Ações do formulário */

.form-actions {
  display: flex;

  justify-content: center;

  gap: 12px;

  margin-top: 10px;

  padding-top: 20px;

  border-top: 1px solid #eef2f7;
}

/* ========================================= */
/* FILTROS */
/* ========================================= */

.filtros-row {
  display: grid;

  grid-template-columns: 1fr 1fr 1fr auto auto;

  gap: 14px;

  align-items: end;
}

.filtro-field {
  display: flex;

  flex-direction: column;

  gap: 6px;
}

.filtro-field label {
  color: #334155;

  font-size: 13px;
  font-weight: 600;
}

.filtro-field input,
.filtro-field select {
  width: 100%;

  padding: 10px 12px;

  border: 1px solid #dbe3ee;
  border-radius: 10px;

  background: #ffffff;

  color: #152238;

  font-size: 14px;
  font-family: inherit;
}

.filtro-field input:focus,
.filtro-field select:focus {
  outline: none;

  border-color: #2563eb;

  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

/* ========================================= */
/* CARDS DE INDICADORES */
/* ========================================= */

.stats-grid {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 20px;
}

.stat-card {
  display: flex;

  gap: 14px;

  padding: 20px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.stat-icon {
  width: 48px;
  height: 48px;

  display: flex;

  justify-content: center;

  align-items: center;

  flex-shrink: 0;

  border-radius: 12px;

  font-size: 22px;
}

.stat-icon.blue {
  background: rgba(37, 99, 235, 0.12);
}

.stat-icon.green {
  background: rgba(22, 163, 74, 0.12);
}

.stat-icon.orange {
  background: rgba(234, 88, 12, 0.12);
}

.stat-icon.purple {
  background: rgba(147, 51, 234, 0.12);
}

.stat-data {
  display: flex;

  flex-direction: column;

  gap: 2px;
}

.stat-title {
  color: #64748b;

  font-size: 13px;
  font-weight: 600;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
}

.stat-value.blue {
  color: #2563eb;
}

.stat-value.green {
  color: #16a34a;
}

.stat-value.orange {
  color: #ea580c;
}

.stat-value.purple {
  color: #9333ea;
}

.stat-data small {
  color: #94a3b8;

  font-size: 11px;
}

/* ========================================= */
/* TABELA */
/* ========================================= */

.usuario-table {
  width: 100%;

  border-collapse: collapse;
}

.usuario-table th {
  padding: 12px;

  color: #64748b;

  font-size: 12px;
  font-weight: 600;

  text-align: left;
  text-transform: uppercase;

  border-bottom: 1px solid #eef2f7;

  background: #f8fafc;
}

.usuario-table td {
  padding: 14px 12px;

  color: #334155;

  font-size: 14px;

  border-bottom: 1px solid #f1f5f9;
}

.celula-usuario {
  display: flex;

  align-items: center;

  gap: 10px;
}

.avatar-mini {
  width: 36px;
  height: 36px;

  display: flex;

  justify-content: center;

  align-items: center;

  flex-shrink: 0;

  border-radius: 50%;

  color: #ffffff;

  font-size: 12px;
  font-weight: 700;
}

.celula-usuario strong {
  display: block;

  color: #152238;

  font-size: 14px;
}

.celula-usuario small {
  color: #94a3b8;

  font-size: 11px;
}

/* Badges de perfil */

.perfil-badge {
  display: inline-block;

  padding: 5px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 600;

  white-space: nowrap;
}

.perfil-purple {
  background: rgba(147, 51, 234, 0.12);

  color: #9333ea;
}

.perfil-blue {
  background: rgba(37, 99, 235, 0.1);

  color: #2563eb;
}

.perfil-green {
  background: rgba(22, 163, 74, 0.12);

  color: #16a34a;
}

.perfil-gray {
  background: #eef2f7;

  color: #64748b;
}

/* Badges de status */

.status-badge {
  display: inline-block;

  padding: 5px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 600;

  white-space: nowrap;
}

.badge-green {
  background: rgba(22, 163, 74, 0.12);

  color: #16a34a;
}

.badge-red {
  background: rgba(220, 38, 38, 0.1);

  color: #dc2626;
}

.badge-gray {
  background: #eef2f7;

  color: #64748b;
}

/* Ações da tabela */

.acoes {
  display: flex;

  gap: 6px;
}

.acao-btn {
  width: 30px;
  height: 30px;

  display: flex;

  justify-content: center;

  align-items: center;

  border: 1px solid #dbe3ee;
  border-radius: 8px;

  background: #ffffff;

  font-size: 13px;

  cursor: pointer;
}

.acao-btn:hover {
  background: #eff6ff;

  border-color: #93c5fd;
}

.acao-excluir:hover {
  background: rgba(220, 38, 38, 0.06);

  border-color: #fca5a5;
}

.vazio {
  padding: 28px 12px;

  text-align: center;

  color: #718096;
}

/* Paginação */

.paginacao {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 16px;

  margin-top: 18px;

  flex-wrap: wrap;
}

.paginacao-info {
  color: #718096;

  font-size: 13px;
}

.paginacao-numeros {
  display: flex;

  align-items: center;

  gap: 6px;
}

.pag-btn {
  min-width: 32px;
  height: 32px;

  padding: 0 8px;

  border: 1px solid #dbe3ee;
  border-radius: 8px;

  background: #ffffff;

  color: #334155;

  font-size: 13px;

  cursor: pointer;
}

.pag-btn:hover {
  background: #f8fafc;
}

.pag-btn.active {
  border-color: #2563eb;

  background: #2563eb;

  color: #ffffff;
}

.pag-ellipsis {
  color: #94a3b8;
}

/* ========================================= */
/* BOTÕES */
/* ========================================= */

.btn {
  padding: 11px 22px;

  border: none;
  border-radius: 10px;

  font-size: 14px;
  font-weight: 600;
  font-family: inherit;

  cursor: pointer;

  white-space: nowrap;
}

.btn-primary {
  background: #2563eb;

  color: #ffffff;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #eef2f7;

  color: #334155;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-outline {
  background: transparent;

  border: 1px solid #dbe3ee;

  color: #334155;
}

.btn-outline:hover {
  background: #f8fafc;
}

/* ========================================= */
/* RESPONSIVIDADE */
/* ========================================= */

@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filtros-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 750px) {
  .sidebar {
    display: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filtros-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
