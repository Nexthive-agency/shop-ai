// Middleware: hanya user yang sudah login yang bisa akses /chat
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    return navigateTo('/auth')
  }
})
