<template>
  <div class="dashboard-page">
    <!-- ================================= -->
    <!-- SIDEBAR -->
    <!-- ================================= -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="@/assets/images/logo-sicpat.png" alt="SICPAT-RFID" />
      </div>

      <nav class="sidebar-nav">
        <!-- Item ativo -->
        <a href="#" class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />

            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>

          <span>Dashboard</span>
        </a>

        <RouterLink to="/patrimonios/consulta" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />

            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />

            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>

          <span>Patrimônios</span>
        </RouterLink>

        <RouterLink to="/inventario/nfc" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4" />

            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>

          <span>Inventário</span>
        </RouterLink>

        <RouterLink to="/relatorios" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="20" x2="18" y2="10" />

            <line x1="12" y1="20" x2="12" y2="4" />

            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>

          <span>Relatórios</span>
        </RouterLink>

        <RouterLink to="/usuarios" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />

            <circle cx="9" cy="7" r="4" />

            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />

            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>

          <span>Usuários</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <strong>Instituto Federal</strong>

        <small>Campus Exemplo</small>
      </div>
    </aside>

    <!-- ================================= -->
    <!-- CONTEÚDO -->
    <!-- ================================= -->
    <main class="dashboard-content">
      <!-- Cabeçalho -->
      <header class="dashboard-header">
        <div class="header-title">
          <h1>Dashboard</h1>

          <p>Bem-vindo ao Sistema Integrado de Controle Patrimonial</p>
        </div>

        <div class="user-info">
          <div class="user-avatar"></div>

          <div class="user-details">
            <strong>Administrador</strong>

            <small>admin@sicpat-rfid</small>
          </div>
        </div>
      </header>

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
/* SIDEBAR */
/* ========================================= */

.sidebar {
  width: 250px;

  height: 100vh;

  display: flex;
  flex-direction: column;

  padding: 20px 14px;

  background: #0f2a4d;

  color: #ffffff;

  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  justify-content: center;

  margin-bottom: 28px;
}

.sidebar-logo img {
  width: 150px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;

  gap: 6px;

  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 13px 16px;

  border-radius: 10px;

  color: #a9bdd6;

  font-size: 15px;
  font-weight: 500;

  text-decoration: none;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);

  color: #ffffff;
}

.nav-item.active {
  background: #2563eb;

  color: #ffffff;
}

.nav-item svg {
  width: 20px;
  height: 20px;

  flex-shrink: 0;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;

  padding-top: 16px;

  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar-footer strong {
  font-size: 13px;
}

.sidebar-footer small {
  color: #a9bdd6;

  font-size: 11px;
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

  background: #f1f5f9;
}

/* ========================================= */
/* CABEÇALHO */
/* ========================================= */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
