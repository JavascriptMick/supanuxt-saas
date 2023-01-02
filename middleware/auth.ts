export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  if(!user.value && to.path === '/dashboard'){
    console.log('auth - navigating to login (from dashboard)')
    navigateTo('login');
  } else if(user.value && to.path === '/') {
    console.log('auth - navigating to dashboard (from root)')
    navigateTo('dashboard');
  } else if(user.value && to.path === '/login') {
    console.log('auth - navigating to dashboard (from login)')
    navigateTo('dashboard');
  }
})