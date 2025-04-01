import React from 'react'
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Layout } from './components/Layout'
import { Home } from './routes/Home'
import { Strategy } from './routes/Strategy'
import { Counting } from './routes/Counting'
import { MiniGames } from './routes/MiniGames'
import { Play } from './routes/Play'

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

const miniGamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mini-games',
  component: MiniGames,
})

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play',
  component: Play,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  strategyRoute,
  countingRoute,
  miniGamesRoute,
  playRoute,
])

export const router = createRouter({ routeTree }) 