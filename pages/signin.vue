<script setup lang="ts">
  const user = useSupabaseUser()
  const supabase = useSupabaseAuthClient();

  const accountStore = useAccountStore()

  const loading = ref(false)
  const email = ref('')
  const password = ref('')

  const handleOtpLogin = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signInWithOtp({ email: email.value })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error)
    } finally {
      loading.value = false
    }
  }

  const handleStandardLogin = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
      if (error) throw error
    } catch (error) {
      alert(error)
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
  <div>
    <h3>Sign In</h3>
    <form @submit.prevent="handleStandardLogin">
      <label for="email">Email:</label>
      <input class="inputField" type="email" id="email" placeholder="Your email" v-model="email" />
      <label for="password">Password:</label>
      <input class="inputField" type="password" id="password" placeholder="Password" v-model="password" />
      <p>By signing in, I agree to the <NuxtLink to="/privacy">Privacy Statement</NuxtLink> and <NuxtLink to="/terms">Terms of Service</NuxtLink>.</p>

      <button type="submit" :disabled="loading">Sign In</button>
    </form>

    <form @submit.prevent="handleOtpLogin">
      <label for="email">Email:</label>
      <input class="inputField" type="email" id="email" placeholder="Your email" v-model="email" />
      <p>By signing in, I agree to the <NuxtLink to="/privacy">Privacy Statement</NuxtLink> and <NuxtLink to="/terms">Terms of Service</NuxtLink>.</p>

      <button type="submit" :disabled="loading">Sign In using Magic Link</button>
    </form>

    <p>or sign in with</p>

    <button @click="supabase.auth.signInWithOAuth({provider: 'google'})">Google</button>
  </div>
</template>
