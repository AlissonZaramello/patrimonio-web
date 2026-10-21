import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PatrimonioCadastroView from '../views/PatrimonioCadastroView.vue'
import PatrimonioConsultaView from '../views/PatrimonioConsultaView.vue'
import InventarioNfcView from '../views/InventarioNfcView.vue'
import RelatoriosView from '../views/RelatoriosView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import EsqueciSenhaView from '@/views/EsqueciSenhaView.vue'
import ResetarSenhaView from '@/views/ResetarSenhaView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/esqueci-senha',
      name: 'esqueci-senha',
      component: EsqueciSenhaView,
      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/resetar-senha',
      name: 'resetar-senha',
      component: ResetarSenhaView,
      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/',
      component: AppLayout,
      // Primeiro acesso na raiz "/" redireciona pro dashboard,
      // que por sua vez será barrado pelo guard abaixo e mandado pro login
      // se não houver token.
      redirect: '/dashboard',

      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: {
            title: 'Dashboard',
            description: 'Bem-vindo ao Sistema Integrado de Controle Patrimonial'
          }
        },

        {
          path: 'patrimonios',
          component: PatrimonioConsultaView,
          meta: {
            title: 'Consulta de Patrimônios',
            description: 'Pesquisa e gerenciamento de bens patrimoniais cadastrados',
            headerAction: {
              label: '＋ Novo Patrimônio',
              to: '/patrimonios/cadastro'
            }
          }
        },

        {
          path: 'patrimonios/cadastro',
          component: PatrimonioCadastroView,
          meta: {
            title: 'Cadastro de Patrimônio',
            description: 'Registro e gerenciamento de bens patrimoniais'
          }
        },

        {
          path: 'inventario/nfc',
          component: InventarioNfcView,
          meta: {
            title: 'Inventário Patrimonial NFC',
            description: 'Leitura e conferência automatizada de patrimônios utilizando RFID e NFC'
          }
        },

        {
          path: 'relatorios',
          component: RelatoriosView,
          meta: {
            title: 'Relatórios Patrimoniais',
            description: 'Análise e acompanhamento dos bens patrimoniais da instituição'
          }
        },

        {
          path: 'usuarios',
          component: UsuariosView,
          meta: {
            title: 'Gerenciamento de Usuários',
            description: 'Controle de acesso e permissões dos usuários do sistema'
          }
        },
      ],
    },

    // Qualquer rota não mapeada também cai no login
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

// Guard global: roda antes de cada navegação
router.beforeEach((to) => {
  const estaLogado = !!localStorage.getItem('token')

  const rotasPublicas = [
    'login',
    'esqueci-senha',
    'resetar-senha',
  ]

  // Usuário sem autenticação só pode acessar rotas públicas.
  if (!estaLogado && !rotasPublicas.includes(to.name)) {
    return { name: 'login' }
  }

  // Usuário autenticado que tenta acessar o login
  // é redirecionado para o dashboard.
  if (to.name === 'login' && estaLogado) {
    return { name: 'dashboard' }
  }
})

export default router