<template>
  <div class="consulta-page"> 
    <!-- ================================= -->
    <!-- CONTEÚDO -->
    <!-- ================================= -->
    <main class="consulta-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/dashboard">Dashboard</RouterLink>

        <span class="breadcrumb-separator">›</span>

        <RouterLink to="/patrimonios">Patrimônios</RouterLink>

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
            <label for="filtroBloco">Bloco</label>
            <select id="filtroBloco" v-model="filtros.bloco">
              <option value="">Todos os blocos</option>
              <option v-for="bloco in blocos" :key="bloco" :value="bloco">
                {{ bloco }}
              </option>
            </select>
          </div>

          <div class="filtro-field">
            <label for="filtroSala">Sala</label>
            <select id="filtroSala" v-model="filtros.sala">
              <option value="">Todas as salas</option>
              <option v-for="sala in salas" :key="sala" :value="sala">
                {{ sala }}
              </option>
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

            <strong class="stat-value green">{{ totalAtivos }}</strong>

            <small>Patrimônios ativos</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon cyan">❌</span>

          <div class="stat-data">
            <span class="stat-title">Inativos</span>

            <strong class="stat-value cyan">{{ totalInativos }}</strong>

            <small>Patrimônios inativos</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon orange">🛜</span>

          <div class="stat-data">
            <span class="stat-title">Patrimônios com Tag</span>

            <strong class="stat-value orange">{{ totalComTag }}</strong>

            <small>Com tags NFC vinculada</small>
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
                <th>Bloco</th>
                <th>Sala</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in resultadosFiltrados":key="item.id":class="{ 'row-selected': item.id === selecionado?.id }" @click="selecionar(item)">

                <td class="cell-tombo">{{ item.numeroTombo }}</td>
                <td>{{ item.descricao || 'Sem descrição' }}</td>
                <td>{{ item.nomeBloco }}</td>
                <td>{{ item.nomeSala }}</td>

                <td>
                  <span class="status-badge" :class="statusClass(item.ativo)"> {{ formatarStatus(item.ativo) }} </span>
                </td>

                <td>
                  <button type="button" class="acao-btn" title="Visualizar" @click.stop="selecionar(item)" > 👁 </button>
                </td>
              </tr>

              <tr v-if="!carregando && resultadosFiltrados.length === 0">
                <td colspan="6" class="vazio"> Nenhum patrimônio encontrado. </td>
              </tr>

            </tbody>
          </table>

          <!-- Paginação (protótipo estático) -->
          <div class="paginacao">
            <span class="paginacao-info">Mostrando {{ resultadosFiltrados.length }} de {{ totalPatrimonios }} registros</span>

            <p class="paginacao-info"> Mostrando {{ resultadosFiltrados.length }} de {{ totalPatrimonios }} patrimônios </p>

            <select class="pag-por-pagina">
              <option>6 por página</option>

              <option>10 por página</option>

              <option>20 por página</option>
            </select>
          </div>
        </section>

        <!-- Painel de detalhes -->
        <aside v-if="selecionado" class="detalhes-card">
          <h2 class="section-title">Detalhes do Patrimônio</h2>

          <div class="detalhes-preview">
            <div class="detalhes-image">💻</div>

            <div class="detalhes-tombo">
              <span class="detalhes-label">Tombo</span>

              <strong>{{ selecionado.numeroTombo }}</strong>

              <span class="status-badge" :class="statusClass(selecionado.status)">{{ formatarStatus(selecionado.ativo) }}</span>
            </div>
          </div>

          <ul class="detalhes-lista">
            <li>
              <span class="detalhes-label">Estado de conservação</span>

              <strong>{{ selecionado.estadoConservacao }}</strong>
            </li>

            <li>
              <span class="detalhes-label">Localização</span>

              <strong>{{ selecionado.nomeSala }}</strong>
            </li>

            <li>
              <span class="detalhes-label">Bloco</span>

              <strong>{{ selecionado.nomeBloco }}</strong>
            </li>

            <li>
              <span class="detalhes-label">Data de Aquisição</span>

              <strong>{{ formatarData(selecionado.dataAquisicao) }}</strong>
            </li>
          </ul>

          <div class="detalhes-rfid">
            <span class="detalhes-rfid-titulo">✅ RFID Vinculado</span>

            <strong>{{ selecionado.tagNfcId || 'Sem tag vinculada' }}</strong>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>


<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { patrimonioService } from '@/services/patrimonioService'

const patrimonios = ref([])
const selecionado = ref(null)
const carregando = ref(false)
const erroConsulta = ref('')

const filtros = reactive({
  tombo: '',
  sala: '',
  bloco: '',
})

const salas = computed(() =>
  [...new Set(patrimonios.value.map(p => p.nomeSala).filter(Boolean))].sort()
)

const blocos = computed(() =>
  [...new Set(patrimonios.value.map(p => p.nomeBloco).filter(Boolean))].sort()
)

const resultadosFiltrados = computed(() => {
  const tombo = filtros.tombo.trim().toLowerCase()

  return patrimonios.value.filter(item =>
    (!tombo || item.numeroTombo?.toLowerCase().includes(tombo)) &&
    (!filtros.sala || item.nomeSala === filtros.sala) &&
    (!filtros.bloco || item.nomeBloco === filtros.bloco)
  )
})

const totalPatrimonios = computed(() => patrimonios.value.length)

const totalAtivos = computed(() =>
  patrimonios.value.filter(p => p.ativo === true).length
)

const totalInativos = computed(() =>
  patrimonios.value.filter(p => p.ativo === false).length
)

const totalComTag = computed(() =>
  patrimonios.value.filter(p => p.tagNfcId != null).length
)

async function carregarPatrimonios() {
  carregando.value = true
  erroConsulta.value = ''

  try {
    const dados = await patrimonioService.listar()

    if (!Array.isArray(dados)) {
      throw new Error('Resposta inválida da API.')
    }

    patrimonios.value = dados
    selecionado.value = dados[0] ?? null
  } catch (erro) {
    patrimonios.value = []
    selecionado.value = null
    erroConsulta.value = erro.message
  } finally {
    carregando.value = false
  }
}

function selecionar(item) {
  selecionado.value = item
}

function pesquisar() {
  selecionado.value = resultadosFiltrados.value[0] ?? null
}

function limparFiltros() {
  filtros.tombo = ''
  filtros.sala = ''
  filtros.bloco = ''
  selecionado.value = patrimonios.value[0] ?? null
}

function statusClass(ativo) {
  return ativo === true
    ? 'badge-green'
    : ativo === false
      ? 'badge-red'
      : 'badge-gray'
}

function formatarStatus(ativo) {
  return ativo === true
    ? 'Ativo'
    : ativo === false
      ? 'Inativo'
      : 'Não informado'
}

function formatarData(data) {
  if (!data) return 'Não informado'

  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarValor(valor) {
  if (valor == null) return 'Não informado'

  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

onMounted(carregarPatrimonios)
</script>

<style scoped>
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.consulta-page {
  display: flex;
  width: 100%;
  overflow: hidden;
}

/* ========================================= */
/* CONTEÚDO */
/* ========================================= */

.consulta-content {
  flex: 1;
  min-width: 0;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #dcdfe4;
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
