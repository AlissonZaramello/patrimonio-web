<template>
  <div class="cadastro-page">
    <!-- ================================= -->
    <!-- CONTEÚDO -->
    <!-- ================================= -->
    <main class="cadastro-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/dashboard">Dashboard</RouterLink>

        <span class="breadcrumb-separator">›</span>

        <RouterLink to="/patrimonios">Patrimônios</RouterLink>

        <span class="breadcrumb-separator">›</span>

        <span class="breadcrumb-current">Cadastro</span>
      </nav>

      <!-- Layout principal: formulário + resumo -->
      <div class="cadastro-layout">
        <!-- ============================== -->
        <!-- FORMULÁRIO -->
        <!-- ============================== -->
        <form class="form-card" @submit.prevent="salvar">
          <h2 class="form-title">
            <span class="form-title-icon">📋</span>

            Dados do Patrimônio

          </h2>

          <!-- Erros de validação -->
          <div v-if="erros.length > 0" class="erros-card" role="alert">
            <strong>⚠️ Não foi possível salvar:</strong>

            <ul>
              <li v-for="(erro, index) in erros" :key="index">{{ erro }}</li>
            </ul>
          </div>

          <div class="form-columns">
            <!-- Coluna 1: informações principais -->
            <section class="form-column">
              <h3 class="column-title">Informações Principais</h3>

              <div class="field">
                <label for="tombamento">Número do Tombamento <em>*</em></label>

                <input id="tombamento" v-model="patrimonio.numeroTombo" type="text" placeholder="Ex: 001245/2026" />
              </div>

              <div class="field">
                <label for="descricao">Descrição do Bem <em>*</em></label>

                <input id="descricao" v-model="patrimonio.descricao" type="text" placeholder="Ex: Computador Desktop Dell OptiPlex" />
              </div>

              <div class="field">
                <label for="sala">Sala <em>*</em></label>

                <select id="sala" v-model="patrimonio.salaId" required :disabled="carregandoSalas">
                  <option value="" disabled>
                    {{ carregandoSalas ? 'Carregando salas...' : 'Selecione uma sala' }}
                  </option>

                  <option v-for="sala in salas" :key="sala.id" :value="sala.id">
                    {{ sala.nome }}
                  </option>

                </select>
              </div>
            </section>
            <!-- Coluna 2: informações complementares -->
            <section class="form-column">
              <h3 class="column-title">Informações Complementares</h3>

              <div class="field">
                <label for="dataAquisicao">Data de Aquisição <em>*</em></label>

                <input id="dataAquisicao" v-model="patrimonio.dataAquisicao" type="date" />
              </div>

              <div class="field">
                <label for="valor">Valor de Aquisição (R$) <em>*</em></label>

                <input id="valor" v-model="patrimonio.valorAquisicao" type="number" min="0" step="0.01" placeholder="0,00" />
              </div>

              <div class="field">
                <label>Estado de Conservação <em>*</em></label>

                <div class="estado-options">
                  <label v-for="estado in estados" :key="estado" class="estado-option">
                    <input v-model="patrimonio.estadoConservacao" type="radio" name="estado" :value="estado" />

                    <span>{{ estado }}</span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          <!-- Ações -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="salvando">
              {{ salvando ? '⏳ Salvando...' : '💾 Salvar' }}
            </button>

            <button type="button" class="btn btn-secondary" @click="router.push('/patrimonios')">
              Cancelar
            </button>

            <button type="button" class="btn btn-outline" @click="limpar">🧹 Limpar Campos</button>
          </div>
        </form>

        <!-- ============================== -->
        <!-- PAINEL RESUMO -->
        <!-- ============================== -->
        <aside class="resumo-card">
          <h2 class="resumo-title">
            <span class="form-title-icon">📦</span>

            Resumo do Patrimônio
          </h2>

          <div class="resumo-preview">
            <div class="preview-image">🖥️</div>

            <span class="preview-id">{{ patrimonio.numeroTombo || 'ID: —' }}</span>
          </div>

          <ul class="resumo-list">
            <li>
              <span class="resumo-label">Descrição</span>

              <strong>{{ patrimonio.descricao || '—' }}</strong>
            </li>

            <li>
              <span class="resumo-label">Sala</span>

              <strong>{{salaSelecionada?.nome || '—' }}</strong>
            </li>

            <li>
              <span class="resumo-label">Data de Aquisição</span>

              <strong>{{ patrimonio.dataAquisicao || '—' }}</strong>
            </li>

            <li>
              <span class="resumo-label">Valor</span>

              <strong>{{ patrimonio.valorAquisicao }}</strong>
            </li>

            <li>
              <span class="resumo-label">Estado de Conservação</span>

              <strong>{{ patrimonio.estadoConservacao || '—' }}</strong>
            </li>

          </ul>
        </aside>
      </div>
    </main>
  </div>
</template>


<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { patrimonioService } from '@/services/patrimonioService'
import { requisicao } from '@/services/conferenciaService'

const router = useRouter()

const salas = ref([])
const carregandoSalas = ref(false)
const salvando = ref(false)
const erros = ref([])

const estados = ['Novo', 'Bom', 'Regular', 'Em Manutenção']

const formularioInicial = () => ({
  numeroTombo: '',
  descricao: '',
  salaId: '',
  dataAquisicao: '',
  valorAquisicao: '',
  estadoConservacao: 'Novo',
})

const patrimonio = reactive(formularioInicial())

const valorFormatado = computed(() => {
  if (patrimonio.valorAquisicao === '') return '—'

  return Number(patrimonio.valorAquisicao).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
})

const salaSelecionada = computed(() =>
  salas.value.find(sala => sala.id === patrimonio.salaId)
)

async function carregarSalas() {
  carregandoSalas.value = true

  try {
    const dados = await requisicao('/api/salas')

    if (!Array.isArray(dados)) {
      throw new Error('Resposta inválida ao consultar as salas.')
    }

    salas.value = dados
  } catch (erro) {
    erros.value = [
      erro.message || 'Não foi possível carregar as salas.'
    ]
  } finally {
    carregandoSalas.value = false
  }
}

function limpar() {
  Object.assign(patrimonio, formularioInicial())
  erros.value = []
}

async function salvar() {
  if (salvando.value) return

  erros.value = []

  if (!patrimonio.numeroTombo.trim()) {
    erros.value.push('Informe o número do tombamento.')
  }

  if (!patrimonio.descricao.trim()) {
    erros.value.push('Informe a descrição.')
  }

  if (!patrimonio.salaId) {
    erros.value.push('Selecione uma sala.')
  }

  if (!patrimonio.dataAquisicao) {
    erros.value.push('Informe a data de aquisição.')
  }

  if (
    patrimonio.valorAquisicao === '' ||
    Number(patrimonio.valorAquisicao) < 0
  ) {
    erros.value.push('Informe um valor de aquisição válido.')
  }

  if (erros.value.length) return

  salvando.value = true

  try {
    await patrimonioService.criar({
      numeroTombo: patrimonio.numeroTombo.trim(),
      descricao: patrimonio.descricao.trim(),
      valorAquisicao: Number(patrimonio.valorAquisicao),
      dataAquisicao: patrimonio.dataAquisicao,
      estadoConservacao: patrimonio.estadoConservacao,
      salaId: patrimonio.salaId,
      fotoUrl: null,
      tagNfcId: null,
      ativo: true,
    })

    alert('Patrimônio cadastrado com sucesso!')
    router.push('/patrimonios')
  } catch (erro) {
    erros.value = [
      erro.message || 'Não foi possível cadastrar o patrimônio.'
    ]
  } finally {
    salvando.value = false
  }
}

onMounted(carregarSalas)
</script>


<style scoped>
/* ========================================= */
/* PÁGINA */
/* ========================================= */

.cadastro-page {
  display: flex;
  width: 100%;
  overflow: hidden;
}

/* ========================================= */
/* CONTEÚDO */
/* ========================================= */

.cadastro-content {
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
/* LAYOUT: FORMULÁRIO + RESUMO */
/* ========================================= */

.cadastro-layout {
  display: grid;

  grid-template-columns: 1fr 320px;

  gap: 20px;

  align-items: start;
}

/* ========================================= */
/* FORMULÁRIO */
/* ========================================= */

.form-card {
  padding: 24px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.form-title {
  display: flex;
  align-items: center;

  gap: 10px;

  margin: 0 0 20px;

  color: #152238;

  font-size: 16px;
  font-weight: 700;
}

.form-title-icon {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 34px;
  height: 34px;

  border-radius: 10px;

  background: rgba(37, 99, 235, 0.12);

  font-size: 16px;
}

.modo-edicao-badge {
  margin-left: auto;

  padding: 5px 12px;

  border-radius: 999px;

  background: rgba(245, 158, 11, 0.14);

  color: #d97706;

  font-size: 12px;
  font-weight: 600;

  white-space: nowrap;
}

.form-columns {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 28px;
}

.column-title {
  margin: 0 0 14px;

  color: #2563eb;

  font-size: 11px;
  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.4px;
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

/* Estado de conservação: radios */

.estado-options {
  display: flex;

  flex-wrap: wrap;

  gap: 8px;
}

.estado-option {
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

.estado-option:has(input:checked) {
  border-color: #2563eb;

  background: rgba(37, 99, 235, 0.08);

  color: #2563eb;

  font-weight: 600;
}

/* ========================================= */
/* ERROS DE VALIDAÇÃO */
/* ========================================= */

.erros-card {
  margin-bottom: 20px;

  padding: 14px 18px;

  border: 1px solid #fecaca;
  border-radius: 12px;

  background: rgba(220, 38, 38, 0.06);

  color: #dc2626;

  font-size: 13px;
}

.erros-card ul {
  margin: 8px 0 0;

  padding-left: 20px;
}

.erros-card li + li {
  margin-top: 4px;
}

.btn:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* ========================================= */
/* ASSOCIAÇÃO RFID */
/* ========================================= */

.rfid-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 16px;

  margin-top: 8px;

  padding: 16px 18px;

  border: 1px solid #bfdbfe;
  border-radius: 12px;

  background: #eff6ff;
}

.rfid-card h4 {
  margin: 0 0 4px;

  color: #1e40af;

  font-size: 14px;
}

.rfid-card p {
  margin: 0;

  color: #475569;

  font-size: 13px;
}

.rfid-badge {
  padding: 6px 14px;

  border-radius: 999px;

  background: rgba(22, 163, 74, 0.14);

  color: #16a34a;

  font-size: 12px;
  font-weight: 600;

  white-space: nowrap;
}

/* ========================================= */
/* AÇÕES */
/* ========================================= */

.form-actions {
  display: flex;
  justify-content: center;

  gap: 12px;

  margin-top: 24px;

  padding-top: 20px;

  border-top: 1px solid #eef2f7;
}

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
/* PAINEL RESUMO */
/* ========================================= */

.resumo-card {
  padding: 20px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;

  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);

  position: sticky;

  top: 0;
}

.resumo-title {
  display: flex;
  align-items: center;

  gap: 10px;

  margin: 0 0 16px;

  color: #152238;

  font-size: 15px;
  font-weight: 700;
}

.resumo-preview {
  display: flex;
  flex-direction: column;

  gap: 8px;

  margin-bottom: 16px;
}

.preview-image {
  height: 110px;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px dashed #cbd5e1;
  border-radius: 12px;

  background: #f8fafc;

  font-size: 40px;
}

.preview-id {
  align-self: flex-start;

  padding: 4px 10px;

  border-radius: 8px;

  background: rgba(37, 99, 235, 0.1);

  color: #2563eb;

  font-size: 12px;
  font-weight: 600;
}

.resumo-list {
  display: flex;
  flex-direction: column;

  margin: 0;

  padding: 0;

  list-style: none;
}

.resumo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 10px;

  padding: 10px 0;

  border-bottom: 1px solid #f1f5f9;
}

.resumo-label {
  color: #64748b;

  font-size: 13px;
}

.resumo-list strong {
  color: #152238;

  font-size: 13px;

  text-align: right;
}

.resumo-status {
  margin-top: 16px;

  padding: 14px;

  border-radius: 12px;

  background: rgba(22, 163, 74, 0.1);

  display: flex;
  flex-direction: column;

  gap: 2px;
}

.resumo-status-label {
  color: #64748b;

  font-size: 12px;
  font-weight: 600;
}

.resumo-status-value {
  color: #16a34a;

  font-size: 15px;
}

.resumo-status small {
  color: #94a3b8;

  font-size: 11px;
}

/* ========================================= */
/* RESPONSIVIDADE */
/* ========================================= */

@media (max-width: 1200px) {
  .cadastro-layout {
    grid-template-columns: 1fr;
  }

  .resumo-card {
    position: static;
  }
}

@media (max-width: 900px) {
  .form-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 750px) {
  .sidebar {
    display: none;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
