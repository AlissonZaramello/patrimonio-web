<template>
  <div class="relatorios-page">
    <!-- ================================= -->
    <!-- CONTEÚDO -->
    <!-- ================================= -->
    <main class="relatorios-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/dashboard">Dashboard</RouterLink>

        <span class="breadcrumb-separator">›</span>

        <span class="breadcrumb-current">Relatórios</span>
      </nav>

      <!-- Filtros do relatório -->
      <section class="filtros-card">
        <h2 class="section-title">
          <span class="section-icon">📊</span>

          Filtros do Relatório
        </h2>

        <div class="filtros-row">
          <div class="filtro-field">
            <label for="filtroSetor">Setor</label>

            <select id="filtroSetor" v-model="filtros.setor">
              <option value="">Todos os setores</option>

              <option v-for="setor in setores" :key="setor">{{ setor }}</option>
            </select>
          </div>

          <div class="filtro-field">
            <label for="dataInicial">Data Inicial</label>

            <input id="dataInicial" v-model="filtros.dataInicial" type="date" />
          </div>

          <div class="filtro-field">
            <label for="dataFinal">Data Final</label>

            <input id="dataFinal" v-model="filtros.dataFinal" type="date" />
          </div>

          <div class="filtro-field">
            <label for="situacao">Situação</label>

            <select id="situacao" v-model="filtros.situacao">
              <option value="">Todos</option>

              <option>Ativos</option>

              <option>Em Inventário</option>

              <option>Em Manutenção</option>

              <option>Não Localizados</option>
            </select>
          </div>

          <button type="button" class="btn btn-primary" @click="gerarPdf">📄 Gerar PDF</button>

          <button type="button" class="btn btn-outline" @click="visualizar">👁 Visualizar Relatório</button>
        </div>
      </section>

      <!-- Cards de indicadores com sparkline -->
      <section class="stats-grid">
        <div v-for="stat in stats" :key="stat.titulo" class="stat-card">
          <div class="stat-topo">
            <span class="stat-icon" :class="stat.cor">{{ stat.icone }}</span>

            <div class="stat-data">
              <span class="stat-title">{{ stat.titulo }}</span>

              <strong class="stat-value" :class="stat.cor">{{ stat.valor }}</strong>

              <small>{{ stat.subtitulo }}</small>
            </div>
          </div>

          <!-- Sparkline simples com SVG -->
          <svg class="sparkline" viewBox="0 0 200 24" preserveAspectRatio="none">
            <polyline :points="stat.sparkline" fill="none" :stroke="stat.corHex" stroke-width="2" />
          </svg>
        </div>
      </section>

      <!-- Gráficos -->
      <section class="graficos-grid">
        <!-- Barras verticais (CSS) -->
        <div class="grafico-card">
          <h2 class="section-title">Patrimônios por Setor</h2>

          <div class="bar-chart">
            <div v-for="barra in barrasSetor" :key="barra.label" class="bar-col">
              <span class="bar-valor">{{ barra.valor }}</span>

              <div class="bar-area">
                <div class="bar-fill" :style="{ height: barra.percentual + '%' }"></div>
              </div>

              <span class="bar-label">{{ barra.label }}</span>
            </div>
          </div>

          <div class="bar-eixo">
            <span>500</span>

            <span>400</span>

            <span>300</span>

            <span>200</span>

            <span>100</span>

            <span>0</span>
          </div>
        </div>

        <!-- Rosca (conic-gradient) -->
        <div class="grafico-card">
          <h2 class="section-title">Distribuição dos Status</h2>

          <div class="donut-layout">
            <div class="donut">
              <div class="donut-center">
                <span>1.245</span>

                <small>total</small>
              </div>
            </div>

            <ul class="donut-legend">
              <li v-for="item in donutStatus" :key="item.label">
                <span class="legend-dot" :style="{ background: item.cor }"></span>

                <span class="legend-label">{{ item.label }}</span>

                <strong>{{ item.percentual }}% ({{ item.quantidade }})</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Layout: resumo + exportação -->
      <div class="relatorios-layout">
        <!-- Tabela resumo -->
        <section class="tabela-card">
          <h2 class="section-title">Resumo Patrimonial</h2>

          <table class="resumo-table">
            <thead>
              <tr>
                <th>Setor</th>

                <th>Quantidade</th>

                <th>Ativos</th>

                <th>Pendentes</th>

                <th>Não Localizados</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="linha in resumoPatrimonial" :key="linha.setor">
                <td class="cell-setor">🏢 {{ linha.setor }}</td>

                <td>{{ linha.quantidade }}</td>

                <td>{{ linha.ativos }}</td>

                <td>{{ linha.pendentes }}</td>

                <td>{{ linha.naoLocalizados }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Paginação estática -->
          <div class="paginacao">
            <span class="paginacao-info">Mostrando 1 a 5 de 5 registros</span>

            <div class="paginacao-numeros">
              <button type="button" class="pag-btn">‹</button>

              <button type="button" class="pag-btn active">1</button>

              <button type="button" class="pag-btn">›</button>
            </div>

            <select class="pag-por-pagina">
              <option>5 por página</option>

              <option>10 por página</option>
            </select>
          </div>
        </section>

        <!-- Exportação -->
        <aside class="exportacao-card">
          <h2 class="section-title">Exportação</h2>

          <button
            v-for="opcao in opcoesExportacao"
            :key="opcao.titulo"
            type="button"
            class="export-btn"
            @click="exportar(opcao.titulo)"
          >
            <span class="export-icone" :style="{ background: opcao.corFundo }">{{ opcao.icone }}</span>

            <span class="export-texto">
              <strong>{{ opcao.titulo }}</strong>

              <small>{{ opcao.descricao }}</small>
            </span>
          </button>

          <div class="geracao-info">
            <span class="geracao-label">Última geração do relatório</span>

            <p class="geracao-data">📅 15/05/2026 às 14:35 <span class="status-badge badge-green">Concluído</span></p>

            <span class="geracao-label">Gerado por</span>

            <p class="geracao-user">👤 Administrador<br /><small>admin@sicpat-rfid</small></p>

            <div class="geracao-sucesso">
              ✅ <strong>Relatório gerado com sucesso!</strong>

              <small>Todas as informações estão atualizadas.</small>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const setores = [
  'Administração',
  'Biblioteca',
  'Laboratórios',
  'Tecnologia da Informação',
  'Salas de Aula',
]

const filtros = reactive({
  setor: '',

  dataInicial: '2026-05-01',

  dataFinal: '2026-05-15',

  situacao: '',
})

const stats = [
  {
    titulo: 'Total de Patrimônios',
    valor: '1.245',
    subtitulo: 'Total registrados no sistema',
    icone: '🏢',
    cor: 'blue',
    corHex: '#2563eb',
    sparkline: '0,18 33,14 66,16 100,12 133,15 166,10 200,12',
  },
  {
    titulo: 'Patrimônios Ativos',
    valor: '1.132',
    subtitulo: 'Patrimônios ativos',
    icone: '✅',
    cor: 'green',
    corHex: '#16a34a',
    sparkline: '0,20 33,16 66,18 100,14 133,16 166,12 200,10',
  },
  {
    titulo: 'Em Inventário',
    valor: '87',
    subtitulo: 'Aguardando conferência',
    icone: '📋',
    cor: 'cyan',
    corHex: '#0891b2',
    sparkline: '0,10 33,14 66,12 100,16 133,14 166,18 200,15',
  },
  {
    titulo: 'Não Localizados',
    valor: '26',
    subtitulo: 'Patrimônios não localizados',
    icone: '⚠️',
    cor: 'red',
    corHex: '#dc2626',
    sparkline: '0,16 33,18 66,14 100,17 133,13 166,16 200,14',
  },
]

const barrasSetor = [
  { label: 'Administração', valor: 214, percentual: 43 },
  { label: 'Biblioteca', valor: 152, percentual: 30 },
  { label: 'Laboratórios', valor: 398, percentual: 80 },
  { label: 'Tecnologia da Informação', valor: 281, percentual: 56 },
  { label: 'Salas de Aula', valor: 200, percentual: 40 },
]

const donutStatus = [
  { label: 'Ativos', percentual: 61, quantidade: 1132, cor: '#2563eb' },
  { label: 'Inventariados', percentual: 20, quantidade: 249, cor: '#16a34a' },
  { label: 'Em Manutenção', percentual: 14, quantidade: 178, cor: '#f59e0b' },
  { label: 'Não Localizados', percentual: 5, quantidade: 62, cor: '#dc2626' },
]

const resumoPatrimonial = [
  { setor: 'Administração', quantidade: 214, ativos: 205, pendentes: 7, naoLocalizados: 2 },
  { setor: 'Biblioteca', quantidade: 152, ativos: 147, pendentes: 3, naoLocalizados: 2 },
  { setor: 'Laboratórios', quantidade: 398, ativos: 374, pendentes: 18, naoLocalizados: 6 },
  { setor: 'Tecnologia da Informação', quantidade: 281, ativos: 270, pendentes: 7, naoLocalizados: 4 },
  { setor: 'Salas de Aula', quantidade: 200, ativos: 196, pendentes: 2, naoLocalizados: 2 },
]

const opcoesExportacao = [
  { titulo: 'Exportar PDF', descricao: 'Relatório completo', icone: '📄', corFundo: 'rgba(220, 38, 38, 0.12)' },
  { titulo: 'Exportar Excel', descricao: 'Planilha detalhada', icone: '📊', corFundo: 'rgba(22, 163, 74, 0.12)' },
  { titulo: 'Exportar CSV', descricao: 'Dados brutos', icone: '📋', corFundo: 'rgba(245, 158, 11, 0.14)' },
]

function gerarPdf() {
  // Protótipo: apenas simula a geração
  alert('Relatório PDF gerado (protótipo)!')
}

function visualizar() {
  alert('Visualização do relatório (protótipo)!')
}

function exportar(tipo) {
  alert(`Exportação ${tipo} (protótipo)!`)
}
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
</style>
