<script setup lang="ts">
  const supabase = useSupabaseAuthClient();
  const config = useRuntimeConfig();
  const notifyStore = useNotifyStore();

  const loading = ref(false)
  const email = ref('')

  const sendResetPasswordLink = async () => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.value, {
        redirectTo: `${config.public.siteRootUrl}/resetpassword`,
      })
      if (error) throw error
      else notifyStore.notify("Password Reset link sent, check your email.", NotificationType.Success);
    } catch (error) {
      notifyStore.notify(error, NotificationType.Error);
    } finally {
      loading.value = false
    }
  } 
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">Forgot Pasword</h1>
      <form @submit.prevent="sendResetPasswordLink" class="space-y-4">
        <div>
          <label for="email" class="block mb-2 font-bold">Email</label>
          <input v-model="email" id="email" type="email" class="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your email" required>
        </div>
        <button :disabled="loading || email === ''" type="submit"
          class="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Send Reset Password Link</button>
      </form>
    </div>
  </div>
</template>
