<script setup lang="ts">
  const user = useSupabaseUser()
  const supabase = useSupabaseAuthClient();

  const loading = ref(false)
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')

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

  const handleStandardSignup = async () => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signUp({ email: email.value, password: password.value })
      if (error) throw error
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
    <form @submit.prevent="handleStandardSignup">
      <label for="email">Email:</label>
      <input class="inputField" type="email" id="email" placeholder="Your email" v-model="email" />
      <label for="password">Password:</label>
      <input class="inputField" type="password" id="password" placeholder="Password" v-model="password" />
      <label for="confirm_password">Confirm Password:</label>
      <input class="inputField" type="password" id="convirm_password" placeholder="Confirm Password" v-model="confirmPassword" />
      <p>By proceeding, I agree to the <NuxtLink to="/privacy">Privacy Statement</NuxtLink> and <NuxtLink to="/terms">Terms of Service</NuxtLink>.</p>
      
      <button type="submit" :disabled="loading || (confirmPassword !== password)">Sign Up</button>
    </form>

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
