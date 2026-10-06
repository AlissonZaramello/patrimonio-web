<template>
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="@/assets/images/logo-sicpat.png" alt="SICPAT-RFID" />
      </div>

      <nav class="sidebar-nav">
        <!-- Item ativo -->
        <RouterLink to="/dashboard" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />

            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>

          <span>Dashboard</span>
        </RouterLink>

        <RouterLink to="/patrimonios" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />

            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />

            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>

          <span>Patrimônios</span>
        </RouterLink>

        <RouterLink to="/inventario/nfc" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4" />

            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>

          <span>Inventário</span>
        </RouterLink>

        <RouterLink to="/relatorios" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="20" x2="18" y2="10" />

            <line x1="12" y1="20" x2="12" y2="4" />

            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>

          <span>Relatórios</span>
        </RouterLink>

        <RouterLink to="/usuarios" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />

            <circle cx="9" cy="7" r="4" />

            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />

            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>

          <span>Usuários</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <strong>Instituto Federal</strong>

        <small>Campus Exemplo</small>
      </div>
    </aside>
</template>

<style>

.sidebar {
  width: 250px;

  height: 100vh;

  display: flex;
  flex-direction: column;

  padding: 20px 14px;

  background: #152436;

  color: #ffffff;

  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 10px;
  margin-bottom: 28px;

  background: #ffffff;
  border-radius: 10px;
}

.sidebar-logo img {
  width: 200px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;

  gap: 6px;

  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 13px 16px;

  border-radius: 10px;

  color: #a9bdd6;

  font-size: 15px;
  font-weight: 500;

  text-decoration: none;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);

  color: #ffffff;
}

.nav-item.router-link-active {
  background: #094794;
  color: #ffffff;
}

.nav-item svg {
  width: 20px;
  height: 20px;

  flex-shrink: 0;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;

  padding-top: 16px;

  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar-footer strong {
  font-size: 13px;
}

.sidebar-footer small {
  color: #a9bdd6;

  font-size: 11px;
}

</style>