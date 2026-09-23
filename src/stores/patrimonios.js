import { ref } from 'vue'

import { defineStore } from 'pinia'

// Protótipo: dados em memória, compartilhados entre Cadastro, Consulta e Dashboard.
// Futuramente: substituir pelas chamadas da API Java.
export const usePatrimoniosStore = defineStore('patrimonios', () => {
  const patrimonios = ref([
    {
      id: 1,
      tombo: '10025',
      descricao: 'Notebook Dell Latitude 5420',
      setor: 'TI',
      status: 'Ativo',
      categoria: 'Equipamento de Informática',
      localizacao: 'Bloco B - Sala 12',
      dataAquisicao: '15/05/2024',
      tagRfid: 'RFID-8F7A-23B1',
    },
    {
      id: 2,
      tombo: '10026',
      descricao: 'Projetor Epson PowerLite',
      setor: 'Sala de Aula 04',
      status: 'Em Uso',
      categoria: 'Eletrônico',
      localizacao: 'Bloco A - Sala 04',
      dataAquisicao: '10/03/2023',
      tagRfid: 'RFID-4C2D-91E0',
    },
    {
      id: 3,
      tombo: '10027',
      descricao: 'Impressora HP LaserJet',
      setor: 'Administração',
      status: 'Em Inventário',
      categoria: 'Eletrônico',
      localizacao: 'Bloco A - Secretaria',
      dataAquisicao: '22/08/2022',
      tagRfid: 'RFID-7B3A-55F2',
    },
    {
      id: 4,
      tombo: '10028',
      descricao: 'Switch Cisco Catalyst',
      setor: 'Laboratório de Redes',
      status: 'Ativo',
      categoria: 'Equipamento de Informática',
      localizacao: 'Bloco C - Laboratório',
      dataAquisicao: '05/11/2023',
      tagRfid: 'RFID-2E9C-08A7',
    },
    {
      id: 5,
      tombo: '10029',
      descricao: 'Computador Lenovo ThinkCentre',
      setor: 'Biblioteca',
      status: 'Em Manutenção',
      categoria: 'Equipamento de Informática',
      localizacao: 'Biblioteca Central',
      dataAquisicao: '18/06/2021',
      tagRfid: 'RFID-9D1B-77C4',
    },
    {
      id: 6,
      tombo: '10030',
      descricao: 'Cadeira Ergonômica',
      setor: 'Administração',
      status: 'Não Localizado',
      categoria: 'Mobiliário',
      localizacao: 'Bloco A - Sala 02',
      dataAquisicao: '30/01/2020',
      tagRfid: 'RFID-5A8E-33D9',
    },
  ])

  const proximoId = ref(7)

  // Converte AAAA-MM-DD (input date) para DD/MM/AAAA, padrão da tabela
  function formatarData(data) {
    if (!data) return '—'

    return `${data.slice(8, 10)}/${data.slice(5, 7)}/${data.slice(0, 4)}`
  }

  function adicionar(dados) {
    const dataAtual = new Date()

    patrimonios.value.unshift({
      id: proximoId.value++,

      ...dados,

      dataAquisicao: formatarData(dados.dataAquisicao),

      tagRfid: dados.tagRfid || '—',

      status: 'Ativo',

      fabricante: dados.fabricante || '—',

      valor: dados.valor || null,

      estado: dados.estado || 'Novo',

      registradoEm: dataAtual.toLocaleString('pt-BR'),
    })

    return patrimonios.value[0]
  }

  function atualizar(tomboOriginal, dados) {
    const index = patrimonios.value.findIndex((p) => p.tombo === tomboOriginal)

    if (index === -1) return null

    patrimonios.value[index] = {
      ...patrimonios.value[index],

      ...dados,

      dataAquisicao: formatarData(dados.dataAquisicao),

      tagRfid: dados.tagRfid || '—',

      fabricante: dados.fabricante || '—',
    }

    return patrimonios.value[index]
  }

  function buscarPorTombo(tombo) {
    return patrimonios.value.find((p) => p.tombo === tombo)
  }

  return { patrimonios, proximoId, adicionar, atualizar, buscarPorTombo }
})
