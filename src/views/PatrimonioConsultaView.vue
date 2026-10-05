<template>
  <div class="consulta-page"> 
    <!-- ================================= -->
    <!-- CONTEÚDO -->
    <!-- ================================= -->
    <main class="consulta-content">
      <!-- Cabeçalho -->
      <header class="consulta-header">
        <div class="header-title">
          <h1>Consulta de Patrimônios</h1>

          <p>Pesquisa e gerenciamento de bens patrimoniais cadastrados</p>
        </div>

        <div class="header-actions">
          <RouterLink to="/patrimonios/cadastro" class="btn btn-primary">＋ Novo Patrimônio</RouterLink>
        </div>

        <div class="user-info">
          <div class="user-avatar"></div>

          <div class="user-details">
            <strong>Administrador</strong>

            <small>admin@sicpat-rfid</small>
          </div>
        </div>
      </header>

      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/dashboard">Dashboard</RouterLink>

        <span class="breadcrumb-separator">›</span>

        <span>Patrimônios</span>

        <span class="breadcrumb-separator">›</span>

        <span class="breadcrumb-current">Consulta</span>
      </nav>

      <!-- Filtros de pesquisa -->
      <section class="filtros-card">
        <h2 class="section-title">
          <span class="section-icon">🔎</span>

          Filtros de Pesquisa
        </h2>

        <div class="filtros-row">
          <div class="filtro-field">
            <label for="filtroTombo">Tombo</label>

            <input id="filtroTombo" v-model="filtros.tombo" type="text" placeholder="Digite o número do tombo" />
          </div>

          <div class="filtro-field">
            <label for="filtroSetor">Setor</label>

            <select id="filtroSetor" v-model="filtros.setor">
              <option value="">Selecione o setor</option>

              <option v-for="setor in setores" :key="setor">{{ setor }}</option>
            </select>
          </div>

          <div class="filtro-field">
            <label for="filtroCategoria">Categoria</label>

            <select id="filtroCategoria" v-model="filtros.categoria">
              <option value="">Selecione a categoria</option>

              <option v-for="categoria in categorias" :key="categoria">{{ categoria }}</option>
            </select>
          </div>

          <button type="button" class="btn btn-primary" @click="pesquisar">🔍 Pesquisar</button>

          <button type="button" class="btn btn-outline" @click="limparFiltros">Limpar Filtros</button>
        </div>
      </section>

      <!-- Cards de indicadores -->
      <section class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon blue">📦</span>

          <div class="stat-data">
            <span class="stat-title">Total de Patrimônios</span>

            <strong class="stat-value blue">{{ totalPatrimonios }}</strong>

            <small>Total registrado no sistema</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon green">✅</span>

          <div class="stat-data">
            <span class="stat-title">Ativos</span>

            <strong class="stat-value green">1.132</strong>

            <small>Patrimônios ativos</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon cyan">📋</span>

          <div class="stat-data">
            <span class="stat-title">Em Inventário</span>

            <strong class="stat-value cyan">87</strong>

            <small>Aguardando conferência</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon orange">🔧</span>

          <div class="stat-data">
            <span class="stat-title">Em Manutenção</span>

            <strong class="stat-value orange">26</strong>

            <small>Em manutenção preventiva</small>
          </div>
        </div>
      </section>

      <!-- Layout: tabela + detalhes -->
      <div class="consulta-layout">
        <!-- Tabela de resultados -->
        <section class="tabela-card">
          <h2 class="section-title">Patrimônios Encontrados</h2>

          <table class="patrimonio-table">
            <thead>
              <tr>
                <th>Tombo</th>

                <th>Descrição</th>

                <th>Setor</th>

                <th>Status</th>

                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in resultadosFiltrados"
                :key="item.tombo"
                :class="{ 'row-selected': item.tombo === selecionado.tombo }"
                @click="selecionar(item)"
              >
                <td class="cell-tombo">{{ item.tombo }}</td>

                <td>{{ item.descricao }}</td>

                <td>{{ item.setor }}</td>

                <td><span class="status-badge" :class="statusClass(item.status)">{{ item.status }}</span></td>

                <td>
                  <div class="acoes">
                    <button type="button" class="acao-btn" title="Visualizar" @click.stop="selecionar(item)">👁</button>

                    <RouterLink class="acao-btn" title="Editar" :to="`/patrimonios/cadastro?tombo=${item.tombo}`">✏️</RouterLink>

                    <button type="button" class="acao-btn" title="Histórico" @click.stop="selecionar(item)">🕐</button>
                  </div>
                </td>
              </tr>

              <tr v-if="resultadosFiltrados.length === 0">
                <td colspan="5" class="vazio">Nenhum patrimônio encontrado com os filtros informados.</td>
              </tr>
            </tbody>
          </table>

          <!-- Paginação (protótipo estático) -->
          <div class="paginacao">
            <span class="paginacao-info">Mostrando {{ resultadosFiltrados.length }} de {{ totalPatrimonios }} registros</span>

            <div class="paginacao-numeros">
              <button type="button" class="pag-btn">‹</button>

              <button type="button" class="pag-btn active">1</button>

              <button type="button" class="pag-btn">2</button>

              <button type="button" class="pag-btn">3</button>

              <span class="pag-ellipsis">…</span>

              <button type="button" class="pag-btn">208</button>

              <button type="button" class="pag-btn">›</button>
            </div>

            <select class="pag-por-pagina">
              <option>6 por página</option>

              <option>10 por página</option>

              <option>20 por página</option>
            </select>
          </div>
        </section>

        <!-- Painel de detalhes -->
        <aside class="detalhes-card">
          <h2 class="section-title">Detalhes do Patrimônio</h2>

          <div class="detalhes-preview">
            <div class="detalhes-image">💻</div>

            <div class="detalhes-tombo">
              <span class="detalhes-label">Tombo</span>

              <strong>{{ selecionado.tombo }}</strong>

              <span class="status-badge" :class="statusClass(selecionado.status)">{{ selecionado.status }}</span>
            </div>
          </div>

          <ul class="detalhes-lista">
            <li>
              <span class="detalhes-label">Categoria</span>

              <strong>{{ selecionado.categoria }}</strong>
            </li>

            <li>
              <span class="detalhes-label">Localização</span>

              <strong>{{ selecionado.localizacao }}</strong>
            </li>

            <li>
              <span class="detalhes-label">Setor Responsável</span>

              <strong>{{ selecionado.setor }}</strong>
            </li>

            <li>
              <span class="detalhes-label">Data de Aquisição</span>

              <strong>{{ selecionado.dataAquisicao }}</strong>
            </li>
          </ul>

          <div class="detalhes-rfid">
            <span class="detalhes-rfid-titulo">✅ RFID Vinculado</span>

            <strong>{{ selecionado.tagRfid }}</strong>
          </div>

          <button type="button" class="btn btn-outline btn-block">🕐 Ver Histórico Completo</button>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import { usePatrimoniosStore } from '@/stores/patrimonios'

const patrimoniosStore = usePatrimoniosStore()

const setores = [
  'Administração',
  'Biblioteca',
  'Laboratório de Redes',
  'Sala de Aula 04',
  'Tecnologia da Informação',
  'TI',
]

const categorias = [
  'Equipamento de Informática',
  'Mobiliário',
  'Equipamento de Laboratório',
  'Eletrônico',
]

const filtros = reactive({
  tombo: '',

  setor: '',

  categoria: '',
})

// Protótipo: usa os dados do store Pinia (compartilhado com o Cadastro).
// Futuramente: chamada para a API Java.
const patrimonios = computed(() => patrimoniosStore.patrimonios)

const selecionado = ref({ ...patrimonios.value[0] })

// Protótipo: filtros aplicados em tempo real sobre os dados do store
const resultadosFiltrados = computed(() => {
  const termo = filtros.tombo.trim().toLowerCase()

  return patrimonios.value.filter((item) => {
    const correspondeTombo = !termo || item.tombo.toLowerCase().includes(termo)

    const correspondeSetor = !filtros.setor || item.setor === filtros.setor

    const correspondeCategoria = !filtros.categoria || item.categoria === filtros.categoria

    return correspondeTombo && correspondeSetor && correspondeCategoria
  })
})

const totalPatrimonios = computed(() => patrimonios.value.length)

function selecionar(item) {
  selecionado.value = { ...item }
}

function statusClass(status) {
  const mapa = {
    Ativo: 'green',
    'Em Uso': 'blue',
    'Em Inventário': 'blue',
    'Em Manutenção': 'orange',
    'Não Localizado': 'red',
  }

  return `badge-${mapa[status] || 'gray'}`
}

function pesquisar() {
  // Protótipo: o filtro do tombo já é aplicado em tempo real (computed).
  // Futuramente: chamada para a API Java.
  const termo = filtros.tombo.trim()

  if (termo) {
    const encontrado = patrimonios.value.find((p) => p.tombo.includes(termo))

    if (encontrado) selecionar(encontrado)
  }
}

function limparFiltros() {
  filtros.tombo = ''

  filtros.setor = ''

  filtros.categoria = ''
}
</script>

<style scoped>
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.consulta-page {
  display: flex;

  width: 100%;

  height: 100vh;

  overflow: hidden;
}

/* ========================================= */
/* CONTEÚDO */
/* ========================================= */

.consulta-content {
  flex: 1;

  height: 100vh;

  padding: 28px 32px;

  overflow-y: auto;

  display: flex;
  flex-direction: column;

  gap: 20px;

  background: #f1f5f9;
}

/* ========================================= */
/* CABEÇALHO */
/* ========================================= */.consulta-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 16px;
}

.header-actions {
  display: flex;

  gap: 10px;

  margin-left: auto;
}

.header-actions .btn {
  text-decoration: none;
}

.header-title h1 {
  margin: 0;

  color: #152238;

  font-size: 28px;
  font-weight: 700;
}

.header-title p {
  margin: 4px 0 0;

  color: #718096;

  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;

  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;

  border-radius: 50%;

  background: #d8e4f5;
}

.user-details {
  display: flex;
  flex-direction: column;

  line-height: 1.3;
}

.user-details strong {
  color: #152238;

  font-size: 14px;
}

.user-details small {
  color: #718096;

  font-size: 12px;
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
/* FILTROS */
/* ========================================= */

.filtros-card {
  padding: 20px 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.filtros-card .section-title {
  margin-bottom: 12px;
}

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

.stat-icon.cyan {
  background: rgba(6, 182, 212, 0.12);
}

.stat-icon.orange {
  background: rgba(234, 88, 12, 0.12);
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

.stat-value.cyan {
  color: #0891b2;
}

.stat-value.orange {
  color: #ea580c;
}

.stat-data small {
  color: #94a3b8;

  font-size: 11px;
}

/* ========================================= */
/* LAYOUT: TABELA + DETALHES */
/* ========================================= */

.consulta-layout {
  display: grid;

  grid-template-columns: 1fr 320px;

  gap: 20px;

  align-items: start;
}

/* ========================================= */
/* TABELA */
/* ========================================= */

.tabela-card {
  padding: 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.patrimonio-table {
  width: 100%;

  border-collapse: collapse;
}

.patrimonio-table th {
  padding: 12px;

  color: #64748b;

  font-size: 12px;
  font-weight: 600;

  text-align: left;
  text-transform: uppercase;

  border-bottom: 1px solid #eef2f7;

  background: #f8fafc;
}

.patrimonio-table td {
  padding: 14px 12px;

  color: #334155;

  font-size: 14px;

  border-bottom: 1px solid #f1f5f9;
}

.patrimonio-table tbody tr {
  cursor: pointer;
}

.patrimonio-table tbody tr:hover {
  background: #f8fafc;
}

.patrimonio-table tbody tr.row-selected {
  background: rgba(37, 99, 235, 0.06);
}

.cell-tombo {
  font-weight: 600;

  color: #152238;
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

.badge-blue {
  background: rgba(37, 99, 235, 0.1);

  color: #2563eb;
}

.badge-orange {
  background: rgba(245, 158, 11, 0.14);

  color: #d97706;
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

  text-decoration: none;
}

.acao-btn:hover {
  background: #eff6ff;

  border-color: #93c5fd;
}

/* Linha vazia */

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

.pag-por-pagina {
  padding: 8px 10px;

  border: 1px solid #dbe3ee;
  border-radius: 8px;

  color: #334155;

  font-size: 13px;

  background: #ffffff;
}

/* ========================================= */
/* PAINEL DE DETALHES */
/* ========================================= */

.detalhes-card {
  padding: 20px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);

  position: sticky;

  top: 0;
}

.detalhes-preview {
  display: flex;
  align-items: center;

  gap: 14px;

  margin-bottom: 16px;

  padding-bottom: 16px;

  border-bottom: 1px solid #f1f5f9;
}

.detalhes-image {
  width: 70px;
  height: 70px;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;

  border: 1px dashed #cbd5e1;
  border-radius: 12px;

  background: #f8fafc;

  font-size: 30px;
}

.detalhes-tombo {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.detalhes-tombo strong {
  color: #152238;

  font-size: 22px;
}

.detalhes-label {
  color: #64748b;

  font-size: 12px;
}

.detalhes-lista {
  display: flex;
  flex-direction: column;

  margin: 0;

  padding: 0;

  list-style: none;
}

.detalhes-lista li {
  display: flex;
  flex-direction: column;

  gap: 2px;

  padding: 10px 0;

  border-bottom: 1px solid #f1f5f9;
}

.detalhes-lista strong {
  color: #152238;

  font-size: 14px;
}

.detalhes-rfid {
  margin-top: 16px;

  padding: 14px;

  border-radius: 12px;

  background: rgba(22, 163, 74, 0.1);

  display: flex;
  flex-direction: column;

  gap: 4px;
}

.detalhes-rfid-titulo {
  color: #334155;

  font-size: 12px;
  font-weight: 600;
}

.detalhes-rfid strong {
  color: #2563eb;

  font-size: 15px;
}

.btn-block {
  width: 100%;

  margin-top: 16px;
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
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .consulta-layout {
    grid-template-columns: 1fr;
  }

  .detalhes-card {
    position: static;
  }

  .filtros-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 750px) {
  .sidebar {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filtros-row {
    grid-template-columns: 1fr;
  }
}
</style>
