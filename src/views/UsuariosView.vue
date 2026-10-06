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

      <!-- Formulário de cadastro/edição -->
      <section ref="formCard" class="form-card">
        <h2 class="section-title">
          <span class="section-icon">{{ editandoId ? '✏️' : '👤' }}</span>

          {{ editandoId ? 'Editar Usuário' : 'Novo Usuário' }}
        </h2>

        <form @submit.prevent="salvar">
          <div class="form-grid">
            <div class="field">
              <label for="nome">Nome Completo <em>*</em></label>

              <input id="nome" v-model="formulario.nome" type="text" placeholder="Ex: João Silva" required />
            </div>

            <div class="field">
              <label for="email">E-mail <em>*</em></label>

              <input id="email" v-model="formulario.email" type="email" placeholder="Ex: joao.silva@if.edu.br" required />
            </div>

            <div class="field">
              <label for="perfil">Perfil de Acesso <em>*</em></label>

              <select id="perfil" v-model="formulario.perfil" required>
                <option value="" disabled>Selecione o perfil</option>

                <option v-for="perfil in perfis" :key="perfil" :value="perfil">{{ perfil }}</option>
              </select>
            </div>

            <div class="field">
              <label for="setor">Setor <em>*</em></label>

              <select id="setor" v-model="formulario.setor" required>
                <option value="" disabled>Selecione o setor</option>

                <option v-for="setor in setores" :key="setor" :value="setor">{{ setor }}</option>
              </select>
            </div>

            <div class="field">
              <label for="matricula">Matrícula</label>

              <input id="matricula" v-model="formulario.matricula" type="text" placeholder="Ex: 202601245" />
            </div>

            <div class="field">
              <label>Status</label>

              <div class="status-options">
                <label v-for="opcao in opcoesStatus" :key="opcao.valor" class="status-option">
                  <input v-model="formulario.status" type="radio" name="statusUsuario" :value="opcao.valor" />

                  <span>{{ opcao.rotulo }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Ações -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">💾 {{ editandoId ? 'Salvar Alterações' : 'Cadastrar Usuário' }}</button>

            <button
              v-if="editandoId"
              type="button"
              class="btn btn-secondary"
              @click="cancelarEdicao"
            >
              Cancelar
            </button>

            <button type="button" class="btn btn-outline" @click="limparFormulario">🧹 Limpar Campos</button>
          </div>
        </form>
      </section>

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

          <button type="button" class="btn btn-primary" @click="pesquisar">🔍 Pesquisar</button>

          <button type="button" class="btn btn-outline" @click="limparFiltros">Limpar Filtros</button>
        </div>
      </section>

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

              <th>Setor</th>

              <th>Status</th>

              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td class="cell-nome">
                <div class="celula-usuario">
                  <span class="avatar-mini" :style="{ background: corAvatar(usuario.nome) }">{{ iniciais(usuario.nome) }}</span>

                  <div>
                    <strong>{{ usuario.nome }}</strong>

                    <small>{{ usuario.matricula || 'Sem matrícula' }}</small>
                  </div>
                </div>
              </td>

              <td>{{ usuario.email }}</td>

              <td><span class="perfil-badge" :class="classePerfil(usuario.perfil)">{{ usuario.perfil }}</span></td>

              <td>{{ usuario.setor }}</td>

              <td><span class="status-badge" :class="classeStatus(usuario.status)">{{ usuario.status }}</span></td>

              <td>
                <div class="acoes">
                  <button type="button" class="acao-btn" title="Editar" @click="editar(usuario)">✏️</button>

                  <button
                    type="button"
                    class="acao-btn"
                    :title="usuario.status === 'Ativo' ? 'Inativar' : 'Ativar'"
                    @click="alternarStatus(usuario)"
                  >
                    {{ usuario.status === 'Ativo' ? '🔒' : '🔓' }}
                  </button>

                  <button type="button" class="acao-btn acao-excluir" title="Excluir" @click="excluir(usuario)">🗑️</button>
                </div>
              </td>
            </tr>

            <tr v-if="usuarios.length === 0">
              <td colspan="6" class="vazio">Nenhum usuário encontrado com os filtros informados.</td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação (protótipo estático) -->
        <div class="paginacao">
          <span class="paginacao-info">Mostrando {{ usuarios.length }} de {{ totalUsuarios }} registros</span>

          <div class="paginacao-numeros">
            <button type="button" class="pag-btn">‹</button>

            <button type="button" class="pag-btn active">1</button>

            <button type="button" class="pag-btn">2</button>

            <span class="pag-ellipsis">…</span>

            <button type="button" class="pag-btn">›</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const perfis = ['Administrador', 'Gestor Patrimonial', 'Operador', 'Visitante']

const setores = [
  'Administração',
  'Biblioteca',
  'Laboratório de Redes',
  'Laboratório 2',
  'Tecnologia da Informação',
  'Salas de Aula',
]

const opcoesStatus = [
  { rotulo: 'Ativo', valor: 'Ativo' },
  { rotulo: 'Inativo', valor: 'Inativo' },
]

const todosUsuarios = ref([
  {
    id: 1,
    nome: 'Ana Souza',
    email: 'ana.souza@if.edu.br',
    perfil: 'Administrador',
    setor: 'Tecnologia da Informação',
    matricula: '202601001',
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Bruno Costa',
    email: 'bruno.costa@if.edu.br',
    perfil: 'Gestor Patrimonial',
    setor: 'Administração',
    matricula: '202601002',
    status: 'Ativo',
  },
  {
    id: 3,
    nome: 'Carla Mendes',
    email: 'carla.mendes@if.edu.br',
    perfil: 'Operador',
    setor: 'Biblioteca',
    matricula: '202601003',
    status: 'Ativo',
  },
  {
    id: 4,
    nome: 'Diego Almeida',
    email: 'diego.almeida@if.edu.br',
    perfil: 'Operador',
    setor: 'Laboratório de Redes',
    matricula: '202601004',
    status: 'Inativo',
  },
  {
    id: 5,
    nome: 'Elisa Ferreira',
    email: 'elisa.ferreira@if.edu.br',
    perfil: 'Visitante',
    setor: 'Salas de Aula',
    matricula: '',
    status: 'Ativo',
  },
])

const proximoId = ref(6)

const editandoId = ref(null)

const formCard = ref(null)

const formulario = reactive({
  nome: '',

  email: '',

  perfil: '',

  setor: '',

  matricula: '',

  status: 'Ativo',
})

const filtros = reactive({
  nome: '',

  perfil: '',

  status: '',
})

// Protótipo: filtro aplicado em tempo real sobre a lista em memória
// Futuramente: chamada para a API Java
const usuarios = computed(() => {
  const termo = filtros.nome.trim().toLowerCase()

  return todosUsuarios.value.filter((usuario) => {
    const correspondeTermo =
      !termo || usuario.nome.toLowerCase().includes(termo) || usuario.email.toLowerCase().includes(termo)

    const correspondePerfil = !filtros.perfil || usuario.perfil === filtros.perfil

    const correspondeStatus = !filtros.status || usuario.status === filtros.status

    return correspondeTermo && correspondePerfil && correspondeStatus
  })
})

const totalUsuarios = computed(() => todosUsuarios.value.length)

const usuariosAtivos = computed(() => todosUsuarios.value.filter((u) => u.status === 'Ativo').length)

const usuariosInativos = computed(() => todosUsuarios.value.filter((u) => u.status === 'Inativo').length)

const totalAdministradores = computed(() => todosUsuarios.value.filter((u) => u.perfil === 'Administrador').length)

function limparFormulario() {
  formulario.nome = ''

  formulario.email = ''

  formulario.perfil = ''

  formulario.setor = ''

  formulario.matricula = ''

  formulario.status = 'Ativo'
}

function salvar() {
  if (editandoId.value) {
    // Protótipo: atualiza o usuário em memória
    const index = todosUsuarios.value.findIndex((u) => u.id === editandoId.value)

    if (index !== -1) {
      todosUsuarios.value[index] = {
        ...usuarios.value[index],
        nome: formulario.nome,
        email: formulario.email,
        perfil: formulario.perfil,
        setor: formulario.setor,
        matricula: formulario.matricula,
        status: formulario.status,
      }
    }

    alert(`Usuário "${formulario.nome}" atualizado (protótipo)!`)

    editandoId.value = null
  } else {
    // Protótipo: adiciona novo usuário em memória
    todosUsuarios.value.unshift({
      id: proximoId.value++,
      nome: formulario.nome,
      email: formulario.email,
      perfil: formulario.perfil,
      setor: formulario.setor,
      matricula: formulario.matricula,
      status: formulario.status,
    })

    alert(`Usuário "${formulario.nome}" cadastrado (protótipo)!`)
  }

  limparFormulario()
}

function editar(usuario) {
  editandoId.value = usuario.id

  formulario.nome = usuario.nome

  formulario.email = usuario.email

  formulario.perfil = usuario.perfil

  formulario.setor = usuario.setor

  formulario.matricula = usuario.matricula

  formulario.status = usuario.status

  formCard.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function cancelarEdicao() {
  editandoId.value = null

  limparFormulario()
}

function alternarStatus(usuario) {
  usuario.status = usuario.status === 'Ativo' ? 'Inativo' : 'Ativo'
}

function excluir(usuario) {
  // Protótipo: remove apenas em memória após confirmação simples
  const confirmado = window.confirm(`Excluir o usuário "${usuario.nome}"?`)

  if (confirmado) {
    todosUsuarios.value = todosUsuarios.value.filter((u) => u.id !== usuario.id)

    if (editandoId.value === usuario.id) cancelarEdicao()
  }
}

function pesquisar() {
  // Protótipo: o filtro já é aplicado em tempo real (computed).
  // Futuramente: chamada para a API Java.
}

function limparFiltros() {
  filtros.nome = ''

  filtros.perfil = ''

  filtros.status = ''
}

function iniciais(nome) {
  return nome
    .split(' ')
    .map((parte) => parte[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function corAvatar(nome) {
  const cores = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#d97706']

  const indice = nome.length % cores.length

  return cores[indice]
}

function classePerfil(perfil) {
  const mapa = {
    Administrador: 'perfil-purple',
    'Gestor Patrimonial': 'perfil-blue',
    Operador: 'perfil-green',
    Visitante: 'perfil-gray',
  }

  return mapa[perfil] || 'perfil-gray'
}

function classeStatus(status) {
  const mapa = {
    Ativo: 'badge-green',
    Inativo: 'badge-red',
  }

  return mapa[status] || 'badge-gray'
}
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
