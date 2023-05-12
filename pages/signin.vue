<script setup lang="ts">
  const user = useSupabaseUser()
  const supabase = useSupabaseAuthClient();

  const accountStore = useAccountStore()
  const notifyStore = useNotifyStore();

  const loading = ref(false)
  const email = ref('')
  const password = ref('')

  const handleStandardSignin = async () => {
    console.log(`handleStandardSignin email.value:${email.value}, password.value:${password.value}`);
    try {
      loading.value = true
      const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
      if (error) throw error
    } catch (error) {
      notifyStore.notify(error, NotificationType.Error);
    } finally {
      loading.value = false
    }
  }

  const handleGoogleSignin = async () => {
    console.log('handleGoogleSignin');
    try {
      loading.value = true
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (error) throw error
    } catch (error) {
      notifyStore.notify(error, NotificationType.Error);
    } finally {
      loading.value = false
    }
  }


  watchEffect(async () => {
    if (user.value) {
      await accountStore.init();
      navigateTo('/dashboard', {replace: true})
    }
  })  
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">Sign in</h1>
      <form @submit.prevent="handleStandardSignin" class="space-y-4">
        <div>
          <label for="email" class="block mb-2 font-bold">Email</label>
          <input v-model="email" id="email" type="email" class="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your email" required>
        </div>
        <div>
          <label for="password" class="block mb-2 font-bold">Password</label>
          <input v-model="password" id="password" type="password" class="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your password" required>
        </div>
        <NuxtLink id="forgotPasswordLink" to="/forgotpassword" class="text-right block">Forgot your password?</NuxtLink>
        <button :disabled="loading || password === ''" type="submit"
          class="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign in</button>
      </form>
      <p class="text-center">or</p>
      <button @click="handleGoogleSignin()"
        class="w-full py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
        <span class="flex items-center justify-center space-x-2">
          <Icon name="fa-brands:google" class="w-5 h-5" />
          <span>Sign in with Google</span>
        </span>
      </button>
    </div>
  </div>
</template>
