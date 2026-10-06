<template>
  <div class="dashboard-page">
    <!-- ================================= -->
    <!-- CONTEÚDO -->
    <!-- ================================= -->
    <main class="dashboard-content">      
      <!-- Cards de indicadores -->
      <section class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon blue">👥</span>

          <div class="stat-data">
            <span class="stat-title">Total de Patrimônios</span>

            <strong class="stat-value blue">1.245</strong>

            <small>Total registrados no sistema</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon green">✅</span>

          <div class="stat-data">
            <span class="stat-title">Patrimônios Conferidos</span>

            <strong class="stat-value green">1.132</strong>

            <small>Conferidos com sucesso</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon orange">⏰</span>

          <div class="stat-data">
            <span class="stat-title">Patrimônios Pendentes</span>

            <strong class="stat-value orange">113</strong>

            <small>Aguardando conferência</small>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-icon purple">📅</span>

          <div class="stat-data">
            <span class="stat-title">Últimos Inventários</span>

            <strong class="stat-value purple">28</strong>

            <small>Inventários realizados</small>
          </div>
        </div>
      </section>

      <!-- Gráficos -->
      <section class="charts-grid">
        <div class="chart-card">
          <h2>Patrimônios por Setor</h2>

          <!-- Protótipo simples: barras com CSS -->
          <div class="bar-chart">
            <div class="bar-row">
              <span class="bar-label">Administração</span>

              <div class="bar-track">
                <div class="bar-fill" style="width: 100%"></div>
              </div>

              <span class="bar-value">420</span>
            </div>

            <div class="bar-row">
              <span class="bar-label">Biblioteca</span>

              <div class="bar-track">
                <div class="bar-fill" style="width: 60%"></div>
              </div>

              <span class="bar-value">250</span>
            </div>

            <div class="bar-row">
              <span class="bar-label">Laboratórios</span>

              <div class="bar-track">
                <div class="bar-fill" style="width: 76%"></div>
              </div>

              <span class="bar-value">320</span>
            </div>

            <div class="bar-row">
              <span class="bar-label">Salas de Aula</span>

              <div class="bar-track">
                <div class="bar-fill" style="width: 43%"></div>
              </div>

              <span class="bar-value">180</span>
            </div>

            <div class="bar-row">
              <span class="bar-label">Tecnologia da Informação</span>

              <div class="bar-track">
                <div class="bar-fill" style="width: 18%"></div>
              </div>

              <span class="bar-value">75</span>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h2>Status dos Patrimônios</h2>

          <!-- Protótipo simples: rosca com conic-gradient -->
          <div class="donut-layout">
            <div class="donut">
              <div class="donut-center">
                <strong>65%</strong>
              </div>
            </div>

            <ul class="donut-legend">
              <li>
                <span class="legend-dot" style="background: #2563eb"></span>

                Ativos 65% (809)
              </li>

              <li>
                <span class="legend-dot" style="background: #16a34a"></span>

                Em Inventário 20% (249)
              </li>

              <li>
                <span class="legend-dot" style="background: #f59e0b"></span>

                Em Manutenção 10% (125)
              </li>

              <li>
                <span class="legend-dot" style="background: #dc2626"></span>

                Não Localizados 5% (62)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Últimos inventários -->
      <section class="table-card">
        <h2>Últimos Inventários Realizados</h2>

        <table class="inventory-table">
          <thead>
            <tr>
              <th>Data</th>

              <th>Setor</th>

              <th>Responsável</th>

              <th>Resultado</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>15/05/2026</td>

              <td>Biblioteca</td>

              <td>João Silva</td>

              <td><span class="status-badge concluded">Concluído</span></td>
            </tr>

            <tr>
              <td>14/05/2026</td>

              <td>Laboratório 2</td>

              <td>Maria Santos</td>

              <td><span class="status-badge concluded">Concluído</span></td>
            </tr>

            <tr>
              <td>13/05/2026</td>

              <td>Administração</td>

              <td>Carlos Lima</td>

              <td><span class="status-badge pending">Pendente</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.dashboard-page {
  display: flex;  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* ========================================= */
/* CONTEÚDO */
/* ========================================= */

.dashboard-content {
  flex: 1;

  height: 100vh;

  padding: 28px 32px;

  overflow-y: auto;

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
</style>
