
<template>
  <div class="relatorios-page">
    <main class="relatorios-content">

      <nav class="breadcrumb">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">Relatórios</span>
      </nav>

      <section class="filtros-card">
        <h2 class="section-title">
          <span class="section-icon">📊</span>
          Relatórios Patrimoniais
        </h2>

        <div class="filtros-row">
          <div class="filtro-field">
            <label for="sala">Sala</label>
            <select id="sala" v-model="filtros.sala">
              <option value="">Todas as salas</option>
              <option
                v-for="sala in salas"
                :key="sala"
                :value="sala"
              >
                {{ sala }}
              </option>
            </select>
          </div>

          <div class="filtro-field">
            <label for="dataInicial">Data inicial</label>
            <input
              id="dataInicial"
              v-model="filtros.dataInicial"
              type="date"
            />
          </div>

          <div class="filtro-field">
            <label for="dataFinal">Data final</label>
            <input
              id="dataFinal"
              v-model="filtros.dataFinal"
              type="date"
              :min="filtros.dataInicial || undefined"
            />
          </div>

          <div class="filtro-field">
            <label for="status">Status</label>
            <select id="status" v-model="filtros.status">
              <option value="">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="CONCLUIDA">Concluída</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <button
            type="button"
            class="btn btn-outline"
            @click="limparFiltros"
          >
            Limpar
          </button>

          <button
            type="button"
            class="btn btn-primary"
            :disabled="carregando"
            @click="carregarRelatorio"
          >
            {{ carregando ? 'Carregando...' : 'Atualizar' }}
          </button>
        </div>
      </section>

      <div v-if="erros.length" class="mensagem-erro">
        <p v-for="erro in erros" :key="erro">{{ erro }}</p>
      </div>

      <section class="stats-grid">
        <div
          v-for="stat in stats"
          :key="stat.titulo"
          class="stat-card"
        >
          <div class="stat-topo">
            <span class="stat-icon" :class="stat.cor">
              {{ stat.icone }}
            </span>
            <div class="stat-data">
              <span class="stat-title">{{ stat.titulo }}</span>
              <strong class="stat-value" :class="stat.cor">
                {{ stat.valor }}
              </strong>
              <small>{{ stat.subtitulo }}</small>
            </div>
          </div>
        </div>
      </section>

      <section class="graficos-grid">
        <div class="grafico-card">
          <h2 class="section-title">Patrimônios por Bloco</h2>

          <div v-if="barrasBloco.length" class="bar-chart">
            <div
              v-for="barra in barrasBloco"
              :key="barra.label"
              class="bar-col"
            >
              <span class="bar-valor">{{ barra.valor }}</span>
              <div class="bar-area">
                <div
                  class="bar-fill"
                  :style="{ height: `${barra.percentual}%` }"
                ></div>
              </div>
              <span class="bar-label">{{ barra.label }}</span>
            </div>
          </div>

          <p v-else class="estado-vazio">
            Nenhum patrimônio disponível.
          </p>
        </div>

        <div class="grafico-card">
          <h2 class="section-title">
            Resultados das Conferências
          </h2>

          <div class="donut-layout">
            <div class="donut" :style="estiloRosca">
              <div class="donut-center">
                <span>{{ totalResultados }}</span>
                <small>ocorrências</small>
              </div>
            </div>

            <ul class="donut-legend">
              <li
                v-for="item in donutStatus"
                :key="item.label"
              >
                <span
                  class="legend-dot"
                  :style="{ background: item.cor }"
                ></span>
                <span class="legend-label">{{ item.label }}</span>
                <strong>
                  {{ item.percentual }}%
                  ({{ item.quantidade }})
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="tabela-card">
        <h2 class="section-title">Resumo das Conferências</h2>

        <div class="tabela-container">
          <table class="resumo-table">
            <thead>
              <tr>
                <th>Sala</th>
                <th>Responsável</th>
                <th>Status</th>
                <th>Encontrados</th>
                <th>Ausentes</th>
                <th>Divergentes</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="linha in resumoConferencias"
                :key="linha.id"
              >
                <td class="cell-setor">{{ linha.sala }}</td>
                <td>{{ linha.responsavel }}</td>
                <td>{{ formatarStatus(linha.status) }}</td>
                <td>{{ linha.encontrados }}</td>
                <td>{{ linha.ausentes }}</td>
                <td>{{ linha.divergentes }}</td>
              </tr>

              <tr v-if="!resumoConferencias.length">
                <td colspan="6" class="estado-vazio">
                  Nenhuma conferência encontrada.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="paginacao">
          <span class="paginacao-info">
            Mostrando {{ resumoConferencias.length }}
            conferências
          </span>
        </div>
      </section>

      <p class="observacao-relatorio">
        Os resultados representam ocorrências das conferências
        selecionadas, não necessariamente patrimônios únicos.
        O gráfico de patrimônios por bloco apresenta o cadastro
        acessível ao usuário e não é afetado pelos filtros de
        conferência.
      </p>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { patrimonioService } from '@/services/patrimonioService'
import { conferenciaService } from '@/services/conferenciaService'

const patrimonios = ref([])
const conferencias = ref([])
const carregando = ref(false)
const erros = ref([])

const filtros = reactive({
  sala: '',
  dataInicial: '',
  dataFinal: '',
  status: '',
})

const salas = computed(() =>
  [...new Set(
    conferencias.value.map(c => c.salaNome || c.salaId)
  )].sort()
)

const conferenciasFiltradas = computed(() => {
  return conferencias.value.filter(c => {
    const sala = c.salaNome || c.salaId
    const data = (
      c.encerradaEm || c.iniciadaEm || ''
    ).slice(0, 10)

    return (
      (!filtros.sala || sala === filtros.sala) &&
      (!filtros.status || c.status === filtros.status) &&
      (!filtros.dataInicial ||
        (data && data >= filtros.dataInicial)) &&
      (!filtros.dataFinal ||
        (data && data <= filtros.dataFinal))
    )
  })
})

const totais = computed(() =>
  conferenciasFiltradas.value.reduce(
    (acc, c) => {
      acc.esperados += c.totalEsperados || 0
      acc.encontrados += c.totalEncontrados || 0
      acc.ausentes += c.totalAusentes || 0
      acc.divergentes += c.totalDivergentes || 0
      return acc
    },
    {
      esperados: 0,
      encontrados: 0,
      ausentes: 0,
      divergentes: 0,
    }
  )
)

const stats = computed(() => [
  {
    titulo: 'Conferências',
    valor: conferenciasFiltradas.value.length,
    subtitulo: 'Conferências selecionadas',
    icone: '📋',
    cor: 'blue',
  },
  {
    titulo: 'Encontrados',
    valor: totais.value.encontrados,
    subtitulo: 'Ocorrências registradas',
    icone: '✅',
    cor: 'green',
  },
  {
    titulo: 'Divergentes',
    valor: totais.value.divergentes,
    subtitulo: 'Ocorrências divergentes',
    icone: '⚠️',
    cor: 'cyan',
  },
  {
    titulo: 'Ausentes',
    valor: totais.value.ausentes,
    subtitulo: 'Ocorrências não encontradas',
    icone: '🔍',
    cor: 'red',
  },
])

const barrasBloco = computed(() => {
  const contagem = {}

  for (const patrimonio of patrimonios.value) {
    const nome = patrimonio.nomeBloco || 'Não informado'
    contagem[nome] = (contagem[nome] || 0) + 1
  }

  const grupos = Object.entries(contagem)
    .map(([label, valor]) => ({ label, valor }))
    .sort((a, b) => b.valor - a.valor)

  const maximo = Math.max(1, ...grupos.map(g => g.valor))

  return grupos.map(g => ({
    ...g,
    percentual: (g.valor / maximo) * 100,
  }))
})

const donutStatus = computed(() => {
  const grupos = [
    { label: 'Encontrados', quantidade: totais.value.encontrados, cor: '#16a34a' },
    { label: 'Ausentes', quantidade: totais.value.ausentes, cor: '#dc2626' },
    { label: 'Divergentes', quantidade: totais.value.divergentes, cor: '#f59e0b' },
  ]

  const total = grupos.reduce((soma, item) => soma + item.quantidade, 0)

  return grupos.map(item => ({
    ...item,
    percentual: total
      ? Math.round(item.quantidade / total * 100)
      : 0,
  }))
})

const totalResultados = computed(() =>
  totais.value.encontrados +
  totais.value.ausentes +
  totais.value.divergentes
)

const estiloRosca = computed(() => {
  if (!totalResultados.value) {
    return { background: '#e2e8f0' }
  }

  const encontrados =
    totais.value.encontrados / totalResultados.value * 100

  const ausentes =
    encontrados + totais.value.ausentes / totalResultados.value * 100

  return {
    background: `conic-gradient(
      #16a34a 0% ${encontrados}%,
      #dc2626 ${encontrados}% ${ausentes}%,
      #f59e0b ${ausentes}% 100%
    )`,
  }
})

const resumoConferencias = computed(() =>
  conferenciasFiltradas.value.map(c => ({
    id: c.id,
    sala: c.salaNome || c.salaId,
    responsavel: c.responsavelNome || 'Não informado',
    status: c.status,
    encontrados: c.totalEncontrados || 0,
    ausentes: c.totalAusentes || 0,
    divergentes: c.totalDivergentes || 0,
  }))
)

function formatarStatus(status) {
  return {
    PENDENTE: 'Pendente',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
  }[status] || status
}

function limparFiltros() {
  Object.assign(filtros, {
    sala: '',
    dataInicial: '',
    dataFinal: '',
    status: '',
  })
}

async function carregarRelatorio() {
  carregando.value = true
  erros.value = []

  const [resultadoPatrimonios, resultadoConferencias] =
    await Promise.allSettled([
      patrimonioService.listar(),
      conferenciaService.listar(),
    ])

  if (resultadoPatrimonios.status === 'fulfilled' &&
      Array.isArray(resultadoPatrimonios.value)) {
    patrimonios.value = resultadoPatrimonios.value
  } else {
    patrimonios.value = []
    erros.value.push('Falha ao carregar patrimônios.')
  }

  if (resultadoConferencias.status === 'fulfilled' &&
      Array.isArray(resultadoConferencias.value)) {
    conferencias.value = resultadoConferencias.value
  } else {
    conferencias.value = []
    erros.value.push('Falha ao carregar conferências.')
  }

  carregando.value = false
}

onMounted(carregarRelatorio)
</script>

<style scoped>
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.relatorios-page {
  display: flex;  
  width: 100%;
}

/* ========================================= */
/* CONTEÚDO */
/* ========================================= */

.relatorios-content {
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

  grid-template-columns: 1fr 1fr 1fr 1fr auto auto;

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
  padding: 20px 20px 12px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);

  overflow: hidden;
}

.stat-topo {
  display: flex;

  gap: 14px;

  margin-bottom: 12px;
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

.stat-icon.red {
  background: rgba(220, 38, 38, 0.1);
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

.stat-value.red {
  color: #dc2626;
}

.stat-data small {
  color: #94a3b8;

  font-size: 11px;
}

.sparkline {
  width: 100%;

  height: 24px;
}

/* ========================================= */
/* GRÁFICOS */
/* ========================================= */

.graficos-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 20px;
}

.grafico-card {
  padding: 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

/* Barras verticais com CSS */

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;

  gap: 12px;

  height: 200px;

  padding-bottom: 6px;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  flex: 1;

  height: 100%;
}

.bar-valor {
  color: #334155;

  font-size: 12px;
  font-weight: 600;
}

.bar-area {
  flex: 1;

  width: 100%;

  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.bar-fill {
  width: 60%;

  border-radius: 8px 8px 0 0;

  background: #2563eb;
}

.bar-label {
  color: #64748b;

  font-size: 11px;

  text-align: center;
}

.bar-eixo {
  display: flex;
  justify-content: space-between;

  margin-top: 8px;

  padding-top: 8px;

  border-top: 1px solid #f1f5f9;

  color: #94a3b8;

  font-size: 10px;
}

/* Rosca com conic-gradient */

.donut-layout {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 28px;

  padding: 10px 0;
}

.donut {
  width: 170px;
  height: 170px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background: conic-gradient(
    #2563eb 0% 61%,
    #16a34a 61% 81%,
    #f59e0b 81% 95%,
    #dc2626 95% 100%
  );
}

.donut-center {
  width: 95px;
  height: 95px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background: #ffffff;
}

.donut-center span {
  color: #152238;

  font-size: 20px;
  font-weight: 700;
}

.donut-center small {
  color: #94a3b8;

  font-size: 11px;
}

.donut-legend {
  display: flex;
  flex-direction: column;

  gap: 12px;

  margin: 0;

  padding: 0;

  list-style: none;

  font-size: 13px;
}

.donut-legend li {
  display: flex;
  align-items: center;

  gap: 8px;
}

.legend-dot {
  width: 10px;
  height: 10px;

  flex-shrink: 0;

  border-radius: 50%;
}

.legend-label {
  color: #334155;
}

.donut-legend strong {
  color: #152238;
}

/* ========================================= */
/* LAYOUT: RESUMO + EXPORTAÇÃO */
/* ========================================= */

.relatorios-layout {
  display: grid;

  grid-template-columns: 1fr 300px;

  gap: 20px;

  align-items: start;
}

/* ========================================= */
/* TABELA RESUMO */
/* ========================================= */

.tabela-card {
  padding: 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.resumo-table {
  width: 100%;

  border-collapse: collapse;
}

.resumo-table th {
  padding: 12px;

  color: #64748b;

  font-size: 12px;
  font-weight: 600;

  text-align: left;
  text-transform: uppercase;

  border-bottom: 1px solid #eef2f7;

  background: #f8fafc;
}

.resumo-table td {
  padding: 14px 12px;

  color: #334155;

  font-size: 14px;

  border-bottom: 1px solid #f1f5f9;
}

.cell-setor {
  font-weight: 600;

  color: #152238;
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

.pag-por-pagina {
  padding: 8px 10px;

  border: 1px solid #dbe3ee;
  border-radius: 8px;

  color: #334155;

  font-size: 13px;

  background: #ffffff;
}

/* ========================================= */
/* EXPORTAÇÃO */
/* ========================================= */

.exportacao-card {
  padding: 20px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);

  position: sticky;

  top: 0;
}

.export-btn {
  display: flex;
  align-items: center;

  gap: 12px;

  width: 100%;

  margin-bottom: 10px;

  padding: 12px;

  border: 1px solid #e2e8f0;
  border-radius: 12px;

  background: #ffffff;

  cursor: pointer;

  text-align: left;
}

.export-btn:hover {
  background: #f8fafc;

  border-color: #dbe3ee;
}

.export-icone {
  width: 40px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;

  border-radius: 10px;

  font-size: 18px;
}

.export-texto {
  display: flex;
  flex-direction: column;
}

.export-texto strong {
  color: #152238;

  font-size: 14px;
}

.export-texto small {
  color: #718096;

  font-size: 12px;
}

.geracao-info {
  display: flex;
  flex-direction: column;

  gap: 6px;

  margin-top: 16px;

  padding-top: 16px;

  border-top: 1px solid #f1f5f9;
}

.geracao-label {
  color: #64748b;

  font-size: 12px;
  font-weight: 600;
}

.geracao-data {
  display: flex;
  align-items: center;

  gap: 8px;

  margin: 0;

  color: #334155;

  font-size: 13px;
}

.geracao-user {
  margin: 0;

  color: #152238;

  font-size: 13px;
  font-weight: 600;

  line-height: 1.4;
}

.geracao-user small {
  color: #718096;

  font-size: 11px;
  font-weight: 400;
}

.geracao-sucesso {
  display: flex;
  flex-direction: column;

  gap: 2px;

  margin-top: 8px;

  padding: 12px;

  border-radius: 12px;

  background: rgba(22, 163, 74, 0.1);

  color: #16a34a;

  font-size: 13px;
}

.geracao-sucesso small {
  color: #94a3b8;

  font-size: 11px;
}

/* ========================================= */
/* BADGES */
/* ========================================= */

.status-badge {
  display: inline-block;

  padding: 4px 10px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 600;

  white-space: nowrap;
}

.badge-green {
  background: rgba(22, 163, 74, 0.12);

  color: #16a34a;
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

.filtros-row {
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto auto;
}

.stat-value.cyan {
  color: #0891b2;
}

.tabela-container {
  width: 100%;
  overflow-x: auto;
}

.mensagem-erro {
  padding: 14px 18px;
  color: #b91c1c;
  background: #fef2f2;
  border-radius: 10px;
}

.estado-vazio {
  padding: 18px;
  color: #64748b;
}

.observacao-relatorio {
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

/* ========================================= */
/* RESPONSIVIDADE */
/* ========================================= */

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .graficos-grid,
  .relatorios-layout {
    grid-template-columns: 1fr;
  }

  .exportacao-card {
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

  .donut-layout {
    flex-direction: column;
  }
}

@media (max-width: 1100px) {
  .filtros-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .filtros-row {
    grid-template-columns: 1fr;
  }
}

</style>
