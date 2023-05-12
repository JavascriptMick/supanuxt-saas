<script setup lang="ts">
  const user = useSupabaseUser()
  const supabase = useSupabaseAuthClient();

  const notifyStore = useNotifyStore();

  const loading = ref(false)
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const signUpOk = ref(false)

  const handleStandardSignup = async () => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signUp({ email: email.value, password: password.value })
      if (error) {
        throw error
      }
      else {
        signUpOk.value = true;
      }
    } catch (error) {
      notifyStore.notify(error, NotificationType.Error);
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    if (user.value) {
      navigateTo('/dashboard', { replace: true })
    }
  })
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">Sign up</h1>
      <form @submit.prevent="handleStandardSignup" class="space-y-4">
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
        <div>
          <label for="confirmPassword" class="block mb-2 font-bold">Confirm Password</label>
          <input v-model="confirmPassword" id="confirmPassword" type="password"
            class="w-full p-2 border border-gray-400 rounded-md" placeholder="Confirm your password" required>
        </div>
        <button :disabled="loading || password === '' || (confirmPassword !== password)" type="submit"
          class="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign up</button>
        
          <p v-if="signUpOk" class="mt-4 text-lg text-center">You have successfully signed up.  Please check your email for a link to confirm your email address and proceed.</p>
      </form>
      <p class="text-center">or</p>
      <button @click="supabase.auth.signInWithOAuth({ provider: 'google' })"
        class="w-full py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
        <span class="flex items-center justify-center space-x-2">
          <Icon name="fa-brands:google" class="w-5 h-5" />
          <span>Sign up with Google</span>
        </span>
      </button>
      <p class="mt-4 text-xs text-center text-gray-500">
        By proceeding, I agree to the <NuxtLink to="/privacy">Privacy Statement</NuxtLink> and <NuxtLink to="/terms">Terms
          of Service</NuxtLink>
      </p>
    </div>
  </div>
</template>
