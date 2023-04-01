<script setup lang="ts">
  const user = useSupabaseUser()
  const supabase = useSupabaseAuthClient();

  const loading = ref(false)
  const email = ref('')

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

  watchEffect(() => {
    if (user.value) {
      navigateTo('/dashboard', {replace: true})
    }
  })  
</script>
<template>
  <div>
    <h3>Sign Up</h3>
    <form @submit.prevent="handleOtpLogin">
      <label for="email">Email:</label>
      <input class="inputField" type="email" id="email" placeholder="Your email" v-model="email" />
      <p>By proceeding, I agree to the <NuxtLink to="/privacy">Privacy Statement</NuxtLink> and <NuxtLink to="/terms">Terms of Service</NuxtLink>.</p>
      
      <button type="submit" :disabled="loading">Sign Up using Magic Link</button>
    </form>

    <p>or sign up with</p>

    <button @click="supabase.auth.signInWithOAuth({provider: 'google'})">Google</button>
  </div>
</template>
