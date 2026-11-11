import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PatrimonioCadastroView from '../views/PatrimonioCadastroView.vue'
import PatrimonioConsultaView from '../views/PatrimonioConsultaView.vue'
import RelatoriosView from '../views/RelatoriosView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import EsqueciSenhaView from '@/views/EsqueciSenhaView.vue'
import ResetarSenhaView from '@/views/ResetarSenhaView.vue'
import ConferenciasView from '@/views/ConferenciasView.vue'
import CiclosView from '@/views/CiclosView.vue'

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
          path: 'conferencias',
          component: ConferenciasView,
          meta: {
            title: 'Conferências Patrimoniais',
            description: 'Acompanhamento das conferências por sala'
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
          path: 'ciclos-conferencia',
          component: CiclosView,
          meta: {
            title: 'Ciclos de Conferência',
            description: 'Gerenciamento dos ciclos patrimoniais',
            requiresAdmin: true
          },
        },

        {
          path: 'usuarios',
          component: UsuariosView,
          meta: {
            title: 'Gerenciamento de Usuários',
            description: 'Controle de acesso e permissões dos usuários do sistema',
            requiresAdmin: true
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

  // Verifica se a rota exige permissão de administrador.
  const requerAdministrador = to.matched.some(rota => rota.meta.requiresAdmin === true)

  if (estaLogado && requerAdministrador) {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

    const ehAdministrador = ['admin', 'administrador'].includes(usuario?.role?.toLowerCase())

    // Funcionários não podem acessar rotas administrativas.
    if (!ehAdministrador) {
      return { name: 'dashboard' }
    }
  }
})

export default router