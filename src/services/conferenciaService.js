
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

export async function requisicao(caminho, opcoes = {}) {
  const token = localStorage.getItem('token')

  if (!apiUrl) {
    throw new Error('A URL da API não está configurada.')
  }

  const resposta = await fetch(`${apiUrl}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  })

  if (!resposta.ok) {
    let mensagem = 'Erro ao comunicar com a API.'

    try {
      const erro = await resposta.json()
      mensagem = erro.mensagem || mensagem
    } catch {
      // Mantém a mensagem padrão.
    }

    throw new Error(mensagem)
  }

  if (resposta.status === 204) {
    return null
  }

  return resposta.json()
}

export const conferenciaService = {

  listar() {
    return requisicao('/api/conferencias')
  },

  buscarPorId(id) {
    return requisicao(`/api/conferencias/${id}`)
  },

  listarItens(id) {
    return requisicao(`/api/conferencias/${id}/itens`)
  },

  gerarCodigo(id) {
    return requisicao(
      `/api/conferencias/${id}/codigo-vinculacao`,
      { method: 'POST' }
    )
  },

}
