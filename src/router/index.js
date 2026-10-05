import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PatrimonioCadastroView from '../views/PatrimonioCadastroView.vue'
import PatrimonioConsultaView from '../views/PatrimonioConsultaView.vue'
import InventarioNfcView from '../views/InventarioNfcView.vue'
import RelatoriosView from '../views/RelatoriosView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [   
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/',
      component: AppLayout,

      children: [
        
        {
          path: 'dashboard',
          component: DashboardView
        },

        {
          path: 'patrimonios/cadastro',
          component: PatrimonioCadastroView
        },

        {
          path: 'patrimonios/consulta',
          component: PatrimonioConsultaView
        },

        {
          path: 'inventario/nfc',
          component: InventarioNfcView
        },

        {
          path: 'relatorios',
          component: RelatoriosView
        },

        {
          path: 'usuarios',
          component: UsuariosView
        }

      ]
    }
  ],
})

export default router
