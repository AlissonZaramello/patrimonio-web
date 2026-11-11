<template>
  <main class="pagina">
    <header class="cabecalho">
      <button :disabled="carregando" @click="carregarCiclos">
        {{ carregando ? 'Carregando...' : 'Atualizar' }}
      </button>
    </header>

    <p v-if="erro" class="erro">{{ erro }}</p>

    <section class="card">
      <h3>Novo ciclo</h3>

      <form class="formulario" @submit.prevent="criarCiclo">
        <label> Nome do ciclo <input v-model.trim="formulario.nome" required maxlength="100" placeholder="Conferência Novembro 2026"/> </label>

        <label>
          Mês de referência
          <select v-model.number="formulario.mesReferencia" required>
            <option v-for="mes in meses" :key="mes.numero" :value="mes.numero"> {{ mes.nome }} </option>
          </select>
        </label>

        <label>
          Ano de referência
          <input v-model.number="formulario.anoReferencia" type="number" min="2000" max="2100" required/>
        </label>

        <label>
          Data de início
          <input v-model="formulario.dataInicio" type="date" required />
        </label>

        <label>
          Data de término
          <input v-model="formulario.dataFim" type="date" :min="formulario.dataInicio || undefined" required/>
        </label>

        <div class="acoes">
          <button type="submit" :disabled="salvando"> {{ salvando ? 'Salvando...' : 'Cadastrar ciclo' }} </button>
        </div>
      </form>

      <p v-if="erroCadastro" class="erro"> {{ erroCadastro }} </p>

      <p v-if="mensagemSucesso" class="sucesso"> {{ mensagemSucesso }} </p>

    </section>

    <section class="card">
      <h3>Ciclos cadastrados</h3>

      <p v-if="erroAcao" class="erro"> {{ erroAcao }} </p>

      <p v-if="mensagemAcao" class="sucesso"> {{ mensagemAcao }} </p>

      <p v-if="carregando">Carregando ciclos...</p>

      <p v-else-if="!erro && ciclos.length === 0"> Nenhum ciclo cadastrado. </p>

      <div v-else-if="!erro" class="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Referência</th>
              <th>Início</th>
              <th>Término</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="ciclo in ciclos" :key="ciclo.id">
              <td>{{ ciclo.nome }}</td>

              <td>
                {{ String(ciclo.mesReferencia).padStart(2, '0') }}/{{ ciclo.anoReferencia }}
              </td>

              <td>{{ formatarData(ciclo.dataInicio) }}</td>
              <td>{{ formatarData(ciclo.dataFim) }}</td>

              <td>
                <span class="status" :class="ciclo.status.toLowerCase()"> {{ formatarStatus(ciclo.status) }} </span>
              </td>
              <td>
                <div class="botoes-acoes">
                  <template v-if="ciclo.status === 'PLANEJADO'">
                    <button type="button" class="btn-ativar":disabled="processandoId !== null" @click="ativarCiclo(ciclo)">
                      {{ processandoId === ciclo.id ? 'Processando...' : 'Ativar' }}
                    </button>

                    <button type="button" class="btn-cancelar":disabled="processandoId !== null" @click="cancelarCiclo(ciclo)">
                      Cancelar
                    </button>
                  </template>

                  <span v-else class="sem-acoes">—</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { cicloService } from '@/services/cicloService'

const ciclos = ref([])
const carregando = ref(false)
const salvando = ref(false)
const erro = ref('')
const erroCadastro = ref('')
const mensagemSucesso = ref('')
const processandoId = ref(null)
const erroAcao = ref('')
const mensagemAcao = ref('')

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
].map((nome, indice) => ({
  numero: indice + 1,
  nome,
}))

const criarFormularioInicial = () => ({
  nome: '',
  mesReferencia: new Date().getMonth() + 1,
  anoReferencia: new Date().getFullYear(),
  dataInicio: '',
  dataFim: '',
})

const formulario = reactive(criarFormularioInicial())

function formatarData(data) {
  if (!data) return '-'

  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarStatus(status) {
  const nomes = {
    PLANEJADO: 'Planejado',
    ATIVO: 'Ativo',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
  }

  return nomes[status] || status
}

async function carregarCiclos() {
  carregando.value = true
  erro.value = ''

  try {
    ciclos.value = await cicloService.listar()

  } catch (e) {
    ciclos.value = []
    erro.value = e.message

  } finally {
    carregando.value = false
  }
}

async function criarCiclo() {
  erroCadastro.value = ''
  mensagemSucesso.value = ''

  if (formulario.dataFim < formulario.dataInicio) {
    erroCadastro.value = 'A data de término não pode ser anterior à data de início.'
    return
  }

  salvando.value = true

  try {
    await cicloService.criar({ ...formulario })

    Object.assign(formulario, criarFormularioInicial())

    await carregarCiclos()

    mensagemSucesso.value = 'Ciclo cadastrado com sucesso.'

  } catch (e) {
    erroCadastro.value = e.message

  } finally {
    salvando.value = false
  }
}

async function ativarCiclo(ciclo) {
  if (processandoId.value !== null) return

  const confirmou = window.confirm(
    `Deseja ativar o ciclo "${ciclo.nome}"?\n\n` +
    'Essa operação irá gerar as conferências e os itens ' + 'dos patrimônios para as salas cadastradas.'
  )

  if (!confirmou) return

  processandoId.value = ciclo.id
  erroAcao.value = ''
  mensagemAcao.value = ''

  try {
    await cicloService.ativar(ciclo.id)

    mensagemAcao.value = `Ciclo "${ciclo.nome}" ativado com sucesso.`
    await carregarCiclos()

  } catch (erro) {
    erroAcao.value = erro.message

  } finally {
    processandoId.value = null
  }
}

async function cancelarCiclo(ciclo) {
  if (processandoId.value !== null) return

  if (ciclo.status !== 'PLANEJADO') {
    erroAcao.value = 'Somente ciclos planejados podem ser cancelados nesta tela.'
    return
  }

  const confirmou = window.confirm(
    `Deseja cancelar o ciclo "${ciclo.nome}"?\n\n` + 'Essa operação não poderá ser desfeita.'
  )

  if (!confirmou) return

  processandoId.value = ciclo.id
  erroAcao.value = ''
  mensagemAcao.value = ''

  try {
    await cicloService.cancelar(ciclo.id)

    mensagemAcao.value = `Ciclo "${ciclo.nome}" cancelado com sucesso.`
    await carregarCiclos()

  } catch (erro) {
    erroAcao.value = erro.message

  } finally {
    processandoId.value = null
  }
}


onMounted(carregarCiclos)
</script>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

.cabecalho {
  display: flex;
  justify-content: end;
  gap: 16px;
}


.card {
  background: white;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.card h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.formulario label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.botoes-acoes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-ativar {
  background: #15803d;
}

.btn-ativar:hover:not(:disabled) {
  background: #166534;
}

.btn-cancelar {
  background: #dc2626;
}

.btn-cancelar:hover:not(:disabled) {
  background: #b91c1c;
}

.sem-acoes {
  color: #94a3b8;
}

input, select {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font: inherit;
}

button {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.acoes {
  grid-column: 1 / -1;
}

.tabela-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  padding: 14px;
  border-bottom: 1px solid #e2e8f0;
}

th {
  color: #64748b;
  font-weight: 500;
}

.status {
  font-weight: 600;
}

.status.planejado { 
    color: #a16207; 
}

.status.ativo { 
    color: #2563eb; 
}

.status.concluido { 
    color: #15803d; 
}

.status.cancelado { 
    color: #b91c1c; 
}

.erro { 
    color: #b91c1c; 
}

.sucesso { 
    color: #15803d; 
}

@media (max-width: 700px) {
  .formulario {
    grid-template-columns: 1fr;
  }

  .cabecalho {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
