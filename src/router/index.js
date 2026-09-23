import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PatrimonioCadastroView from '../views/PatrimonioCadastroView.vue'
import PatrimonioConsultaView from '../views/PatrimonioConsultaView.vue'
import InventarioNfcView from '../views/InventarioNfcView.vue'
import RelatoriosView from '../views/RelatoriosView.vue'
import UsuariosView from '../views/UsuariosView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },

    {
      path: '/patrimonios/cadastro',
      name: 'patrimonio-cadastro',
      component: PatrimonioCadastroView,
    },

    {
      path: '/patrimonios/consulta',
      name: 'patrimonio-consulta',
      component: PatrimonioConsultaView,
    },

    {
      path: '/inventario/nfc',
      name: 'inventario-nfc',
      component: InventarioNfcView,
    },

    {
      path: '/relatorios',
      name: 'relatorios',
      component: RelatoriosView,
    },

    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView,
    },
  ],
})

export default router
