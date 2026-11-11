
import { requisicao } from './conferenciaService'

export const cicloService = {
  listar() {
    return requisicao('/api/ciclos-conferencia')
  },

  buscarPorId(id) {
    return requisicao(`/api/ciclos-conferencia/${id}`)
  },

  criar(dados) {
    return requisicao('/api/ciclos-conferencia', {
      method: 'POST',
      body: JSON.stringify(dados),
    })
  },

  ativar(id) {
    return requisicao(`/api/ciclos-conferencia/${id}/ativar`, {
      method: 'PATCH',
    })
  },

  cancelar(id) {
    return requisicao(`/api/ciclos-conferencia/${id}/cancelar`, {
      method: 'PATCH',
    })
  },
}
