import { requisicao } from './conferenciaService'

export const usuarioService = {
  listar() {
    return requisicao('/api/usuarios')
  },
}