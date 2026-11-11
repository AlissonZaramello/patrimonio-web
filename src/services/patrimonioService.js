import { requisicao } from './conferenciaService'

export const patrimonioService = {

    listar() {
        return requisicao('/api/patrimonios')
    },

    buscarPorId(id) {
        return requisicao(`/api/patrimonios/${id}`)
    },

    criar(dados) {
        return requisicao('/api/patrimonios', {
            method: 'POST',
            body: JSON.stringify(dados),
        })
    },
}
