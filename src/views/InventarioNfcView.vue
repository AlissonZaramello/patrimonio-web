<template>
  <div class="inventario-page">   
    <!-- ================================= -->
    <!-- CONTEÚDO -->
    <!-- ================================= -->
    <main class="inventario-content">
      <!-- Cabeçalho -->
      <header class="inventario-header">
        <div class="header-title">
          <h1>Inventário Patrimonial NFC</h1>

          <p>Leitura e conferência automatizada de patrimônios utilizando RFID e NFC</p>
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

        <span>Inventário</span>

        <span class="breadcrumb-separator">›</span>

        <span class="breadcrumb-current">NFC</span>
      </nav>

      <!-- Layout principal -->
      <div class="inventario-layout">
        <div class="inventario-coluna-principal">
          <!-- Leitura NFC -->
          <section class="leitura-card">
            <div class="leitura-info">
              <div class="leitura-icon">📡</div>

              <div class="leitura-texto">
                <h2>Leitura NFC</h2>

                <p class="leitura-status">
                  Status:

                  <span class="status-leitura" :class="{ 'aguardando': !lido }">
                    {{ lido ? '✅ Leitura Realizada' : '✅ Leitura Disponível' }}
                  </span>
                </p>

                <p class="leitura-instrucao">
                  {{ lido ? 'Tag lida com sucesso. Confira os dados abaixo.' : 'Aproxime o dispositivo NFC da etiqueta RFID para iniciar a conferência' }}
                </p>

                <button type="button" class="btn btn-primary btn-leitura" :disabled="lendo" @click="lerTag">
                  {{ lendo ? '⏳ Lendo...' : '📡 Ler Tag NFC' }}
                </button>

                <small class="leitura-aguardando">{{ lendo ? 'Processando leitura...' : lido ? 'Leitura concluída' : 'Aguardando aproximação...' }}</small>
              </div>
            </div>

            <!-- Ilustração simples (protótipo) -->
            <div class="leitura-ilustracao" :class="{ 'lido': lido }">
              <div class="ilustracao-tag">📡</div>

              <span class="ilustracao-ondas">✨</span>

              <div class="ilustracao-celular">
                <span class="celular-texto">{{ lido ? '✅ Item recebido' : 'Leitura NFC' }}</span>
              </div>
            </div>
          </section>

          <!-- Dados do patrimônio lido -->
          <section class="dados-card">
            <div class="dados-header">
              <h2 class="section-title">Dados do Patrimônio Lido</h2>

              <span v-if="lido" class="badge-leitura">Leitura realizada com sucesso</span>
            </div>

            <div v-if="lido" class="dados-grid">
              <div class="dado-item">
                <span class="dado-label">Identificador RFID</span>

                <strong>{{ leitura.rfid }}</strong>
              </div>

              <div class="dado-item">
                <span class="dado-label">Nome do Patrimônio</span>

                <strong>{{ leitura.nome }}</strong>
              </div>

              <div class="dado-item">
                <span class="dado-label">Número do Tombo</span>

                <strong>{{ leitura.tombo }}</strong>
              </div>

              <div class="dado-item">
                <span class="dado-label">Localização</span>

                <strong>{{ leitura.localizacao }}</strong>
              </div>

              <div class="dado-item">
                <span class="dado-label">Setor</span>

                <strong>{{ leitura.setor }}</strong>
              </div>

              <div class="dado-item">
                <span class="dado-label">Status</span>

                <span class="status-badge badge-green">Patrimônio Localizado</span>
              </div>

              <div class="dado-item">
                <span class="dado-label">Data da Leitura</span>

                <strong>{{ leitura.data }}</strong>
              </div>

              <div class="dado-item">
                <span class="dado-label">Hora da Leitura</span>

                <strong>{{ leitura.hora }}</strong>
              </div>

              <div class="dado-item">
                <span class="dado-label">Usuário</span>

                <strong>Administrador</strong>
              </div>
            </div>

            <p v-else class="dados-vazio">
              Nenhuma leitura realizada ainda. Clique em <strong>"Ler Tag NFC"</strong> para simular.
            </p>
          </section>

          <!-- Últimas leituras -->
          <section class="leituras-card">
            <h2 class="section-title">Últimas Leituras Realizadas</h2>

            <table class="leituras-table">
              <thead>
                <tr>
                  <th>Data/Hora</th>

                  <th>RFID</th>

                  <th>Patrimônio</th>

                  <th>Localização</th>

                  <th>Resultado</th>

                  <th>Usuário</th>

                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in ultimasLeituras" :key="item.id">
                  <td>{{ item.dataHora }}</td>

                  <td class="cell-rfid">{{ item.rfid }}</td>

                  <td>{{ item.patrimonio }}</td>

                  <td>{{ item.localizacao }}</td>

                  <td><span class="status-badge badge-green">{{ item.resultado }}</span></td>

                  <td>{{ item.usuario }}</td>

                  <td><button type="button" class="acao-btn" title="Visualizar">👁</button></td>
                </tr>
              </tbody>
            </table>

            <button type="button" class="ver-todas">Ver todas as leituras ▾</button>
          </section>
        </div>

        <!-- ============================== -->
        <!-- COLUNA LATERAL -->
        <!-- ============================== -->
        <div class="inventario-coluna-lateral">
          <!-- Resultado da conferência -->
          <section class="conferencia-card">
            <div class="conferencia-header">
              <h2 class="section-title">Resultado da Conferência</h2>

              <div class="conferencia-selo" :class="{ 'ok': lido }">{{ lido ? '✅' : '⏳' }}</div>
            </div>

            <ul class="checklist">
              <li v-for="item in checklist" :key="item.label" :class="{ 'ok': lido }">
                <span class="check-icone">{{ lido ? '✅' : '⬜' }}</span>

                {{ item.label }}
              </li>
            </ul>

            <button type="button" class="btn btn-primary btn-block" :disabled="!lido" @click="confirmar">
              ✅ Confirmar Inventário
            </button>

            <button type="button" class="btn btn-outline btn-block" @click="novaLeitura">
              🔄 Nova Leitura
            </button>
          </section>

          <!-- Tecnologias utilizadas -->
          <section class="tecnologias-card">
            <h2 class="section-title">Tecnologias Utilizadas</h2>

            <div class="tecnologias-grid">
              <div class="tecnologia-item">
                <span class="tecnologia-icone">📡</span>

                <span>NFC</span>
              </div>

              <div class="tecnologia-item">
                <span class="tecnologia-icone">🏷️</span>

                <span>RFID</span>
              </div>

              <div class="tecnologia-item">
                <span class="tecnologia-icone">📍</span>

                <span>Rastreamento</span>
              </div>

              <div class="tecnologia-item">
                <span class="tecnologia-icone">🛡️</span>

                <span>Conferência</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const lendo = ref(false)

const lido = ref(false)

const leitura = reactive({
  rfid: 'RFID-A8F7-34C2-9D8E',
  nome: 'Notebook Dell Latitude 5420',
  tombo: '10025',
  localizacao: 'Laboratório de Redes - Sala B12',
  setor: 'Tecnologia da Informação',
  data: '',
  hora: '',
})

const checklist = [
  { label: 'Patrimônio Encontrado' },
  { label: 'RFID Válido' },
  { label: 'Localização Confirmada' },
  { label: 'Inventário Atualizado' },
]

const ultimasLeituras = ref([
  {
    id: 1,
    dataHora: '15/05/2026 14:32',
    rfid: 'RFID-A8F7',
    patrimonio: 'Notebook Dell Latitude 5420',
    localizacao: 'Lab Redes - Sala B12',
    resultado: 'Confirmado',
    usuario: 'Administrador',
  },
  {
    id: 2,
    dataHora: '15/05/2026 14:28',
    rfid: 'RFID-C7B1',
    patrimonio: 'Projetor Epson PowerLite',
    localizacao: 'Sala de Aula 04',
    resultado: 'Confirmado',
    usuario: 'Administrador',
  },
  {
    id: 3,
    dataHora: '15/05/2026 14:20',
    rfid: 'RFID-D4F9',
    patrimonio: 'Impressora HP LaserJet',
    localizacao: 'Administração',
    resultado: 'Confirmado',
    usuario: 'Administrador',
  },
])

function lerTag() {
  if (lido.value || lendo.value) return

  lendo.value = true

  // Protótipo: simula o tempo de leitura NFC
  setTimeout(() => {
    const agora = new Date()

    leitura.data = agora.toLocaleDateString('pt-BR')

    leitura.hora = agora.toLocaleTimeString('pt-BR')

    lendo.value = false

    lido.value = true
  }, 900)
}

function novaLeitura() {
  lido.value = false
}

function confirmar() {
  // Protótipo: adiciona a leitura atual no topo da tabela e reseta
  ultimasLeituras.value.unshift({
    id: Date.now(),
    dataHora: `${leitura.data} ${leitura.hora}`,
    rfid: leitura.rfid.slice(0, 9),
    patrimonio: leitura.nome,
    localizacao: leitura.localizacao.replace('Laboratório de Redes - ', 'Lab Redes - '),
    resultado: 'Confirmado',
    usuario: 'Administrador',
  })

  lido.value = false
}
</script>

<style scoped>
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.inventario-page {
  display: flex;  width: 100%;

  height: 100vh;

  overflow: hidden;
}

/* ========================================= */
/* CONTEÚDO */
/* ========================================= */

.inventario-content {
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
/* ========================================= */

.inventario-header {
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
/* LAYOUT PRINCIPAL */
/* ========================================= */

.inventario-layout {
  display: grid;

  grid-template-columns: 1fr 320px;

  gap: 20px;

  align-items: start;
}

.inventario-coluna-principal,
.inventario-coluna-lateral {
  display: flex;
  flex-direction: column;

  gap: 20px;
}

/* ========================================= */
/* TÍTULOS DE SEÇÃO */
/* ========================================= */

.section-title {
  margin: 0;

  color: #152238;

  font-size: 16px;
  font-weight: 700;
}

/* ========================================= */
/* LEITURA NFC */
/* ========================================= */

.leitura-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 24px;

  padding: 24px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.leitura-info {
  display: flex;

  gap: 16px;
}

.leitura-icon {
  width: 52px;
  height: 52px;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;

  border-radius: 12px;

  background: rgba(37, 99, 235, 0.12);

  font-size: 24px;
}

.leitura-texto {
  display: flex;
  flex-direction: column;

  gap: 6px;

  align-items: flex-start;
}

.leitura-texto h2 {
  margin: 0;

  color: #152238;

  font-size: 18px;
}

.leitura-status {
  margin: 0;

  color: #64748b;

  font-size: 13px;
}

.status-leitura {
  color: #16a34a;

  font-weight: 600;
}

.leitura-instrucao {
  margin: 0;

  color: #718096;

  font-size: 13px;

  max-width: 340px;
}

.btn-leitura {
  margin-top: 10px;
}

.btn-leitura:disabled {
  opacity: 0.7;

  cursor: not-allowed;
}

.leitura-aguardando {
  color: #94a3b8;

  font-size: 12px;
}

/* Ilustração simplificada do celular + tag */

.leitura-ilustracao {
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 18px 22px;

  border-radius: 14px;

  background: #f8fafc;

  border: 1px dashed #dbe3ee;

  transition: border-color 0.3s;
}

.leitura-ilustracao.lido {
  border-color: #86efac;

  background: rgba(22, 163, 74, 0.06);
}

.ilustracao-tag {
  width: 56px;
  height: 56px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 12px;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  font-size: 26px;
}

.ilustracao-ondas {
  font-size: 18px;

  color: #2563eb;
}

.ilustracao-celular {
  width: 90px;
  height: 130px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 14px;

  background: #0f2a4d;

  padding: 8px;

  text-align: center;
}

.celular-texto {
  color: #ffffff;

  font-size: 11px;

  line-height: 1.4;
}

/* ========================================= */
/* DADOS LIDOS */
/* ========================================= */

.dados-card {
  padding: 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.dados-header {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 16px;
}

.badge-leitura {
  padding: 5px 12px;

  border-radius: 999px;

  background: rgba(22, 163, 74, 0.12);

  color: #16a34a;

  font-size: 12px;
  font-weight: 600;
}

.dados-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 1px;

  border: 1px solid #f1f5f9;
  border-radius: 12px;

  overflow: hidden;

  background: #f1f5f9;
}

.dado-item {
  display: flex;
  flex-direction: column;

  gap: 4px;

  padding: 14px 16px;

  background: #ffffff;
}

.dado-label {
  color: #64748b;

  font-size: 12px;
}

.dado-item strong {
  color: #152238;

  font-size: 14px;
}

.dados-vazio {
  margin: 0;

  padding: 24px;

  text-align: center;

  color: #718096;

  font-size: 14px;

  background: #f8fafc;

  border-radius: 12px;
}

/* ========================================= */
/* ÚLTIMAS LEITURAS */
/* ========================================= */

.leituras-card {
  padding: 22px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.leituras-card .section-title {
  margin-bottom: 14px;
}

.leituras-table {
  width: 100%;

  border-collapse: collapse;
}

.leituras-table th {
  padding: 12px;

  color: #64748b;

  font-size: 12px;
  font-weight: 600;

  text-align: left;
  text-transform: uppercase;

  border-bottom: 1px solid #eef2f7;

  background: #f8fafc;
}

.leituras-table td {
  padding: 14px 12px;

  color: #334155;

  font-size: 14px;

  border-bottom: 1px solid #f1f5f9;
}

.cell-rfid {
  font-weight: 600;

  color: #152238;
}

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

.ver-todas {
  display: block;

  margin: 14px auto 0;

  border: none;

  background: transparent;

  color: #2563eb;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

/* ========================================= */
/* CONFERÊNCIA (LATERAL) */
/* ========================================= */

.conferencia-card,
.tecnologias-card {
  padding: 20px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.conferencia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 14px;
}

.conferencia-header .section-title {
  font-size: 15px;
}

.conferencia-selo {
  width: 44px;
  height: 44px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background: #f1f5f9;

  font-size: 20px;
}

.conferencia-selo.ok {
  background: rgba(22, 163, 74, 0.12);
}

.checklist {
  display: flex;
  flex-direction: column;

  gap: 12px;

  margin: 0 0 18px;

  padding: 0;

  list-style: none;
}

.checklist li {
  display: flex;
  align-items: center;

  gap: 10px;

  color: #94a3b8;

  font-size: 14px;
}

.checklist li.ok {
  color: #334155;
}

.check-icone {
  font-size: 15px;
}

/* ========================================= */
/* TECNOLOGIAS */
/* ========================================= */

.tecnologias-grid {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 8px;

  margin-top: 14px;
}

.tecnologia-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  padding: 14px 6px;

  border-radius: 12px;

  background: #f8fafc;

  color: #334155;

  font-size: 12px;
  font-weight: 600;

  text-align: center;
}

.tecnologia-icone {
  font-size: 22px;
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
}

.btn-primary {
  background: #2563eb;

  color: #ffffff;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}

.btn-outline {
  background: transparent;

  border: 1px solid #dbe3ee;

  color: #2563eb;
}

.btn-outline:hover {
  background: #f8fafc;
}

.btn-block {
  width: 100%;

  margin-bottom: 10px;
}

/* ========================================= */
/* RESPONSIVIDADE */
/* ========================================= */

@media (max-width: 1200px) {
  .inventario-layout {
    grid-template-columns: 1fr;
  }

  .dados-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 750px) {
  .sidebar {
    display: none;
  }

  .leitura-card {
    flex-direction: column;
  }

  .dados-grid {
    grid-template-columns: 1fr;
  }
}
</style>
