export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('Authentication')

  const isAuthenticated = !!token.value

  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
