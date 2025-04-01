import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { Home } from '../routes/Home'
import { Strategy } from '../routes/Strategy'
import { Counting } from '../routes/Counting'
import { Play } from '../routes/Play'
import { PlaySettings } from '../routes/PlaySettings'

const rootRoute = createRootRoute({
  component: Layout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const strategyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/strategy',
  component: Strategy,
})

const countingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/counting',
  component: Counting,
})

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play',
  component: Play,
})

const playSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play/settings',
  component: PlaySettings,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  strategyRoute,
  countingRoute,
  playRoute,
  playSettingsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 