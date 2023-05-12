<script setup lang="ts">
  const supabase = useSupabaseAuthClient();

  const notifyStore = useNotifyStore();

  const loading = ref(false)
  const password = ref('')
  const confirmPassword = ref('')

  const changePassword = async () => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.updateUser({
        password: password.value
      });
      if (error) throw error
      else {
        notifyStore.notify("password changed", NotificationType.Success);
        navigateTo('/signin', {replace: true}); // navigate to signin because it is best practice although the auth session seems to be valid so it immediately redirects to dashboard
      }
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
      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label for="password" class="block mb-2 font-bold">New Password</label>
          <input v-model="password" id="password" type="password" class="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Enter your new password" required>
        </div>
        <div>
          <label for="confirmPassword" class="block mb-2 font-bold">Confirm New Password</label>
          <input v-model="confirmPassword" id="confirmPassword" type="password" class="w-full p-2 border border-gray-400 rounded-md"
            placeholder="Confirm new password" required>
        </div>
        <button :disabled="loading || password === '' || (confirmPassword !== password)" type="submit"
          class="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Change Password</button>
      </form>
    </div>
  </div>
</template>
