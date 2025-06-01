import { StyleProvider } from '@ant-design/cssinjs'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <StyleProvider layer>
        <Outlet />
        <TanStackRouterDevtools />
      </StyleProvider>
    </>
  ),
})
