<template>
  <main class="conferencias-page">
    <div class="cabecalho">
      <button
        class="btn-atualizar"
        :disabled="carregando"
        @click="carregarConferencias"
      >
        {{ carregando ? 'Carregando...' : 'Atualizar' }}
      </button>
    </div>

    <p v-if="erro" class="mensagem-erro">
      {{ erro }}
    </p>

    <div v-if="!carregando" class="indicadores">
      <div class="indicador">
        <span>Total</span>
        <strong>{{ conferencias.length }}</strong>
      </div>

      <div class="indicador">
        <span>Pendentes</span>
        <strong>{{ totalPendentes }}</strong>
      </div>

      <div class="indicador">
        <span>Em andamento</span>
        <strong>{{ totalEmAndamento }}</strong>
      </div>

      <div class="indicador">
        <span>Concluídas</span>
        <strong>{{ totalConcluidas }}</strong>
      </div>
    </div>

    <section class="lista-card">
      <div class="lista-cabecalho">
        <h3>Lista de conferências</h3>

        <select v-model="filtroStatus">
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="CONCLUIDA">Concluída</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>

      <p v-if="carregando" class="mensagem">
        Carregando conferências...
      </p>

      <p v-else-if="!erro && !conferenciasFiltradas.length" class="mensagem">
        Nenhuma conferência encontrada.
      </p>

      <div v-else-if="!erro" class="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Conferência</th>
              <th>Sala (ID)</th>
              <th>Status</th>
              <th>Esperados</th>
              <th>Encontrados</th>
              <th>Ausentes</th>
              <th>Divergentes</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="conferencia in conferenciasFiltradas":key="conferencia.id">

              <td :title="conferencia.id"> {{ conferencia.id.slice(0, 8) }} </td>

              <td :title="conferencia.salaId"> {{ conferencia.salaNome || conferencia.salaId }} </td>

              <td>
                <span class="status":class="conferencia.status.toLowerCase()">
                  {{ formatarStatus(conferencia.status) }}
                </span>
              </td>

              <td>{{ conferencia.totalEsperados }}</td>
              <td>{{ conferencia.totalEncontrados }}</td>
              <td>{{ conferencia.totalAusentes }}</td>
              <td>{{ conferencia.totalDivergentes }}</td>

              <td>
                <button class="btn-detalhes" @click="abrirDetalhes(conferencia)"> Detalhes </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="conferenciaSelecionada" class="lista-card detalhes-card">

      <div class="lista-cabecalho">

        <h3>Detalhes da conferência</h3>
        <button class="btn-fechar" @click="fecharDetalhes"> Fechar </button>

      </div>

      <div class="informacoes">

        <p> <strong>Conferência:</strong> {{ conferenciaSelecionada.id }} </p>
        <p> <strong>Sala:</strong> {{ conferenciaSelecionada.salaNome || conferenciaSelecionada.salaId }} </p>
        <p> <strong>Status:</strong> {{ formatarStatus(conferenciaSelecionada.status) }} </p>
        <p> <strong>Patrimônios esperados:</strong> {{ conferenciaSelecionada.totalEsperados }} </p>
        <p> <strong>Responsável:</strong> {{ conferenciaSelecionada.responsavelNome }} </p>
        <p> <strong>Operador:</strong> {{ conferenciaSelecionada.operadorNome || 'Não iniciada' }} </p>

      </div>

      <div v-if="podeGerarCodigo" class="vinculacao">

        <h4>Vinculação com o aplicativo</h4>
        <p> Gere um código para vincular esta conferência ao aplicativo Android. </p>

        <button class="btn-atualizar":disabled="gerandoCodigo"@click="gerarCodigoVinculacao">
          {{ gerandoCodigo ? 'Gerando...' : 'Gerar código' }}
        </button>

        <div v-if="codigoVinculacao" class="codigo-gerado">

          <strong>{{ codigoVinculacao.codigo }}</strong>
          <span> Expira em: {{ formatarData(codigoVinculacao.expiraEm) }} </span>

        </div>

        <p v-if="erroCodigo" class="mensagem-erro"> {{ erroCodigo }} </p>

      </div>

      <div v-if="ehAdministrador && conferenciaSelecionada.status === 'PENDENTE' && !podeGerarCodigo" class="aviso-conferencia">

        <strong>Conferência aguardando início</strong>
        <p>
          O funcionário
          {{ conferenciaSelecionada.responsavelNome }}
          é responsável por iniciar esta conferência.
          O código de vinculação deve ser gerado
          por ele.
        </p>

      </div>

      <h4>Patrimônios da conferência</h4>

      <p v-if="carregandoItens"> Carregando patrimônios... </p>

      <p v-else-if="erroItens" class="mensagem-erro"> {{ erroItens }} </p>

      <p v-else-if="itens.length === 0"> Nenhum patrimônio registrado nesta conferência. </p>

      <div v-else class="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Nº Tombo</th>
              <th>Descrição</th>
              <th>Resultado</th>
              <th>Sala esperada</th>
              <th>Sala lida</th>
              <th>Data da leitura</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in itens" :key="item.id">

              <td> {{ item.numeroTombo }} </td>
              <td> {{ item.descricao || 'Sem descrição' }} </td>
              <td> {{ formatarStatus(item.resultado) }} </td>
              <td>{{ item.salaEsperadaNome }}</td>
              <td>{{ item.salaLidaNome || 'Não informado' }}</td>
              <td>{{ formatarData(item.lidoEm) }}</td>

            </tr>
          </tbody>
        </table>
      </div>

    </section>

  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { conferenciaService } from '@/services/conferenciaService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const usuarioAtual = computed(() => authStore.usuario)

const conferencias = ref([])
const carregando = ref(false)
const erro = ref('')
const filtroStatus = ref('')
const conferenciaSelecionada = ref(null)
const itens = ref([])
const carregandoItens = ref(false)
const erroItens = ref('')

const gerandoCodigo = ref(false)
const codigoVinculacao = ref(null)
const erroCodigo = ref('')

let consultaAtual = 0

const ehAdministrador = computed(() => ['admin', 'administrador'].includes(usuarioAtual.value?.role?.toLowerCase()))

const podeGerarCodigo = computed(() => {
  const conferencia = conferenciaSelecionada.value

  if (!conferencia || !usuarioAtual.value) {
    return false
  }

  return (
    conferencia.status === 'PENDENTE' &&
    conferencia.responsavelId === usuarioAtual.value.id
  )
})

const conferenciasFiltradas = computed(() =>
  conferencias.value.filter(
    conferencia => !filtroStatus.value || conferencia.status === filtroStatus.value
  )
)

const totalPendentes = computed(() => conferencias.value.filter(c => c.status === 'PENDENTE').length)

const totalEmAndamento = computed(() => conferencias.value.filter(c => c.status === 'EM_ANDAMENTO').length)

const totalConcluidas = computed(() => conferencias.value.filter(c => c.status === 'CONCLUIDA').length)

function formatarStatus(status) {
  const nomes = {
    PENDENTE: 'Pendente',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
  }

  return nomes[status] ?? status
}

async function carregarConferencias() {
  carregando.value = true
  erro.value = ''

  try {
    conferencias.value = await conferenciaService.listar()
  } catch (e) {
    conferencias.value = []
    erro.value = e.message
  } finally {
    carregando.value = false
  }
}

async function abrirDetalhes(conferencia) {
  const consulta = ++consultaAtual

  conferenciaSelecionada.value = conferencia
  itens.value = []
  erroItens.value = ''
  codigoVinculacao.value = null
  erroCodigo.value = ''
  carregandoItens.value = true

  try {
    const resultado = await conferenciaService.listarItens(conferencia.id)

    if (consulta === consultaAtual) {
      itens.value = resultado
    }

  } catch (erro) {
    if (consulta === consultaAtual) {
      erroItens.value = erro.message
    }

  } finally {
    if (consulta === consultaAtual) {
      carregandoItens.value = false
    }
  }
}

function fecharDetalhes() {
  consultaAtual++
  conferenciaSelecionada.value = null
  itens.value = []
  codigoVinculacao.value = null
  erroCodigo.value = ''
  erroItens.value = ''
}

async function gerarCodigoVinculacao() {
  if (!podeGerarCodigo.value || gerandoCodigo.value) return

  if (!conferenciaSelecionada.value || gerandoCodigo.value) return

  const conferenciaId = conferenciaSelecionada.value.id

  gerandoCodigo.value = true
  erroCodigo.value = ''
  codigoVinculacao.value = null

  try {
    const resultado = await conferenciaService.gerarCodigo(conferenciaId)

    if (conferenciaSelecionada.value?.id === conferenciaId) {
      codigoVinculacao.value = resultado
    }

  } catch (erro) {
    if (conferenciaSelecionada.value?.id === conferenciaId) {
      erroCodigo.value = erro.message
    }

  } finally {
    gerandoCodigo.value = false
  }
}

function formatarData(data) {
  if (!data) return 'Não informado'

  return new Date(data).toLocaleString('pt-BR')
}

onMounted(carregarConferencias)
</script>

<style scoped>
.conferencias-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

.cabecalho{
  display: flex;
  justify-content: end;
}

.lista-cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.btn-atualizar {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
}

.btn-atualizar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.indicadores {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.indicador,
.lista-card {
  background: white;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.indicador {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.indicador span {
  color: #64748b;
  font-size: 14px;
}

.indicador strong {
  font-size: 28px;
}

.lista-cabecalho {
  margin-bottom: 20px;
}

.lista-cabecalho h3 {
  margin: 0;
}

.btn-detalhes,
.btn-fechar {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

.btn-detalhes:hover,
.btn-fechar:hover {
  background: #e2e8f0;
}

.detalhes-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.informacoes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  overflow-wrap: anywhere;
}

.informacoes p {
  margin: 0;
}

.vinculacao {
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.codigo-gerado {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.codigo-gerado strong {
  font-size: 32px;
  letter-spacing: 4px;
  color: #1d4ed8;
}

.codigo-gerado span {
  color: #64748b;
}

.aviso-conferencia {
  padding: 16px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  border-radius: 10px;
}

.aviso-conferencia p {
  margin-bottom: 0;
  color: #64748b;
}

select {
  padding: 9px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.tabela-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 14px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

th {
  color: #64748b;
}

.status {
  font-weight: 600;
}

.status.pendente {
  color: #a16207;
}

.status.em_andamento {
  color: #2563eb;
}

.status.concluida {
  color: #15803d;
}

.status.cancelada {
  color: #b91c1c;
}

.mensagem {
  color: #64748b;
}

.mensagem-erro {
  color: #b91c1c;
}

@media (max-width: 900px) {
  .indicadores {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cabecalho {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .indicadores {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .informacoes {
    grid-template-columns: 1fr;
  }
}
</style>
