<template>
  <div class="dashboard-page">
    <main class="dashboard-content">

      <div class="dashboard-acoes">
        <div>
          <h2>Visão geral do patrimônio</h2>
          <p>Indicadores atualizados a partir do sistema.</p>
        </div>

        <button
          type="button"
          class="btn-atualizar"
          :disabled="carregando"
          @click="carregarDashboard"
        >
          {{ carregando ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </div>

      <div v-if="erros.length" class="mensagem-erro">
        <p v-for="erro in erros" :key="erro">{{ erro }}</p>
      </div>

      <section class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon blue">📦</span>
          <div class="stat-data">
            <span class="stat-title">Total de Patrimônios</span>
            <strong class="stat-value blue">
              {{ totalPatrimonios }}
            </strong>
            <small>Registros disponíveis</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon green">✅</span>
          <div class="stat-data">
            <span class="stat-title">Patrimônios Ativos</span>
            <strong class="stat-value green">
              {{ totalAtivos }}
            </strong>
            <small>Patrimônios ativos cadastrados</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon orange">⏰</span>
          <div class="stat-data">
            <span class="stat-title">Conferências Pendentes</span>
            <strong class="stat-value orange">
              {{ totalPendentes }}
            </strong>
            <small>{{ totalEmAndamento }} em andamento</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon purple">📋</span>
          <div class="stat-data">
            <span class="stat-title">Conferências Concluídas</span>
            <strong class="stat-value purple">
              {{ totalConcluidas }}
            </strong>
            <small>Conferências finalizadas</small>
          </div>
        </div>
      </section>

      <section class="charts-grid">
        <div class="chart-card">
          <h2>Patrimônios por Bloco</h2>

          <div v-if="patrimoniosPorBloco.length" class="bar-chart">
            <div
              v-for="bloco in patrimoniosPorBloco"
              :key="bloco.nome"
              class="bar-row"
            >
              <span class="bar-label" :title="bloco.nome">
                {{ bloco.nome }}
              </span>

              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ width: `${bloco.percentual}%` }"
                ></div>
              </div>

              <span class="bar-value">
                {{ bloco.quantidade }}
              </span>
            </div>
          </div>

          <p v-else class="estado-vazio">
            Nenhum patrimônio disponível para o gráfico.
          </p>
        </div>

        <div class="chart-card">
          <h2>Situação dos Patrimônios</h2>

          <div class="donut-layout">
            <div class="donut" :style="estiloRosca">
              <div class="donut-center">
                <strong>{{ percentualAtivos }}%</strong>
              </div>
            </div>

            <ul class="donut-legend">
              <li>
                <span
                  class="legend-dot"
                  style="background: #2563eb"
                ></span>
                Ativos {{ percentualAtivos }}%
                ({{ totalAtivos }})
              </li>

              <li>
                <span
                  class="legend-dot"
                  style="background: #dc2626"
                ></span>
                Inativos {{ percentualInativos }}%
                ({{ totalInativos }})
              </li>

              <li v-if="totalNaoInformados > 0">
                <span
                  class="legend-dot"
                  style="background: #94a3b8"
                ></span>
                Não informados {{ percentualNaoInformados }}%
                ({{ totalNaoInformados }})
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="table-card">
        <h2>Últimas Conferências</h2>

        <div class="tabela-container">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>Sala</th>
                <th>Responsável</th>
                <th>Data</th>
                <th>Resultado</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="conferencia in ultimasConferencias"
                :key="conferencia.id"
              >
                <td>
                  {{ conferencia.salaNome || conferencia.salaId }}
                </td>

                <td>
                  {{ conferencia.responsavelNome || 'Não informado' }}
                </td>

                <td>
                  {{
                    formatarData(
                      conferencia.encerradaEm ||
                      conferencia.iniciadaEm
                    )
                  }}
                </td>

                <td>
                  <span
                    class="status-badge"
                    :class="{
                      concluded: conferencia.status === 'CONCLUIDA',
                      pending: conferencia.status !== 'CONCLUIDA'
                    }"
                  >
                    {{ formatarStatus(conferencia.status) }}
                  </span>
                </td>
              </tr>

              <tr v-if="ultimasConferencias.length === 0">
                <td colspan="4" class="estado-vazio">
                  Nenhuma conferência disponível.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { patrimonioService } from '@/services/patrimonioService'
import { conferenciaService } from '@/services/conferenciaService'

const patrimonios = ref([])
const conferencias = ref([])
const carregando = ref(false)
const erros = ref([])

const totalPatrimonios = computed(() => patrimonios.value.length)

const totalAtivos = computed(() =>
  patrimonios.value.filter(p => p.ativo === true).length
)

const totalInativos = computed(() =>
  patrimonios.value.filter(p => p.ativo === false).length
)

const totalNaoInformados = computed(() =>
  patrimonios.value.filter(p => p.ativo == null).length
)

const totalPendentes = computed(() =>
  conferencias.value.filter(c => c.status === 'PENDENTE').length
)

const totalEmAndamento = computed(() =>
  conferencias.value.filter(c => c.status === 'EM_ANDAMENTO').length
)

const totalConcluidas = computed(() =>
  conferencias.value.filter(c => c.status === 'CONCLUIDA').length
)

const percentualAtivos = computed(() =>
  totalPatrimonios.value
    ? Math.round(totalAtivos.value / totalPatrimonios.value * 100)
    : 0
)

const percentualInativos = computed(() =>
  totalPatrimonios.value
    ? Math.round(totalInativos.value / totalPatrimonios.value * 100)
    : 0
)

const percentualNaoInformados = computed(() =>
  totalPatrimonios.value
    ? Math.round(totalNaoInformados.value / totalPatrimonios.value * 100)
    : 0
)

const estiloRosca = computed(() => {
  const total = totalPatrimonios.value

  if (!total) {
    return { background: '#e2e8f0' }
  }

  const ativos = totalAtivos.value / total * 100
  const inativos = ativos + totalInativos.value / total * 100

  return {
    background: `conic-gradient(
      #2563eb 0% ${ativos}%,
      #dc2626 ${ativos}% ${inativos}%,
      #94a3b8 ${inativos}% 100%
    )`,
  }
})

const patrimoniosPorBloco = computed(() => {
  const contagem = {}

  for (const patrimonio of patrimonios.value) {
    const bloco = patrimonio.nomeBloco || 'Não informado'
    contagem[bloco] = (contagem[bloco] || 0) + 1
  }

  const grupos = Object.entries(contagem)
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)

  const maior = Math.max(1, ...grupos.map(g => g.quantidade))

  return grupos.map(grupo => ({
    ...grupo,
    percentual: grupo.quantidade / maior * 100,
  }))
})

const ultimasConferencias = computed(() =>
  [...conferencias.value]
    .sort((a, b) => {
      const dataA = a.encerradaEm || a.iniciadaEm || ''
      const dataB = b.encerradaEm || b.iniciadaEm || ''

      return dataB.localeCompare(dataA)
    })
    .slice(0, 5)
)

function formatarStatus(status) {
  const nomes = {
    PENDENTE: 'Pendente',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
  }

  return nomes[status] || status
}

function formatarData(data) {
  if (!data) return 'Não iniciada'

  const dataConvertida = new Date(data)

  return Number.isNaN(dataConvertida.getTime())
    ? 'Data indisponível'
    : dataConvertida.toLocaleDateString('pt-BR')
}

async function carregarDashboard() {
  carregando.value = true
  erros.value = []

  const resultados = await Promise.allSettled([
    patrimonioService.listar(),
    conferenciaService.listar(),
  ])

  if (resultados[0].status === 'fulfilled' &&
      Array.isArray(resultados[0].value)) {
    patrimonios.value = resultados[0].value
  } else {
    patrimonios.value = []
    erros.value.push('Não foi possível carregar os patrimônios.')
  }

  if (resultados[1].status === 'fulfilled' &&
      Array.isArray(resultados[1].value)) {
    conferencias.value = resultados[1].value
  } else {
    conferencias.value = []
    erros.value.push('Não foi possível carregar as conferências.')
  }

  carregando.value = false
}

onMounted(carregarDashboard)
</script>

<style scoped>
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.dashboard-page {
  display: flex;  
  width: 100%;
  min-height: 100%;
}

/* ========================================= */
/* CONTEÚDO */
/* ========================================= */

.dashboard-content {
  flex: 1;
  min-width: 0;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #dcdfe4;
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
/* GRÁFICOS */
/* ========================================= */

.charts-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;

  gap: 20px;
}

.chart-card {
  padding: 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.chart-card h2 {
  margin: 0 0 18px;

  color: #152238;

  font-size: 16px;
  font-weight: 700;
}

/* Barras horizontais com CSS */

.bar-chart {
  display: flex;
  flex-direction: column;

  gap: 14px;
}

.bar-row {
  display: flex;
  align-items: center;

  gap: 12px;
}

.bar-label {
  width: 150px;

  color: #64748b;

  font-size: 12px;
}

.bar-track {
  flex: 1;

  height: 22px;

  border-radius: 6px;

  background: #eef2f7;

  overflow: hidden;
}

.bar-fill {
  height: 100%;

  border-radius: 6px;

  background: #2563eb;
}

.bar-value {
  width: 36px;

  color: #334155;

  font-size: 12px;
  font-weight: 600;

  text-align: right;
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
    #2563eb 0% 65%,
    #16a34a 65% 85%,
    #f59e0b 85% 95%,
    #dc2626 95% 100%
  );
}

.donut-center {
  width: 95px;
  height: 95px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background: #ffffff;
}

.donut-center strong {
  color: #152238;

  font-size: 20px;
}

.donut-legend {
  display: flex;
  flex-direction: column;

  gap: 12px;

  margin: 0;

  padding: 0;

  list-style: none;

  color: #334155;

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

/* ========================================= */
/* TABELA DE INVENTÁRIOS */
/* ========================================= */

.table-card {
  padding: 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.table-card h2 {
  margin: 0 0 14px;

  color: #152238;

  font-size: 16px;
  font-weight: 700;
}

.inventory-table {
  width: 100%;

  border-collapse: collapse;
}

.inventory-table th {
  padding: 12px;

  color: #64748b;

  font-size: 12px;
  font-weight: 600;

  text-align: left;
  text-transform: uppercase;

  border-bottom: 1px solid #eef2f7;

  background: #f8fafc;
}

.inventory-table td {
  padding: 14px 12px;

  color: #334155;

  font-size: 14px;

  border-bottom: 1px solid #f1f5f9;
}

.status-badge {
  display: inline-block;

  padding: 5px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 600;
}

.status-badge.concluded {
  background: rgba(22, 163, 74, 0.12);

  color: #16a34a;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.14);

  color: #d97706;
}

.dashboard-acoes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.dashboard-acoes h2 {
  margin: 0 0 6px;
  color: #152238;
  font-size: 22px;
}

.dashboard-acoes p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.btn-atualizar {
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.btn-atualizar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensagem-erro {
  padding: 12px 16px;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
}

.mensagem-erro p {
  margin: 4px 0;
}

.estado-vazio {
  color: #64748b;
  padding: 16px;
}

.tabela-container {
  width: 100%;
  overflow-x: auto;
}

.bar-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ========================================= */
/* RESPONSIVIDADE */
/* ========================================= */

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 750px) {
  .sidebar {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .donut-layout {
    flex-direction: column;
  }
}

@media (max-width: 750px) {
  .dashboard-acoes {
    align-items: flex-start;
    flex-direction: column;
  }
}

</style>
