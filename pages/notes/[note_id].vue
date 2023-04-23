<script setup lang="ts">
const route = useRoute();
const { $client } = useNuxtApp();
const { data: note } = await $client.notes.getById.useQuery({note_id: +route.params.note_id});
</script>
<template>
  <div class="prose lg:prose-xl m-5">
    <h3>Note Detail {{ route.params.note_id }}</h3>
    <div class="prose lg:prose-xl m-5">{{ note?.note.note_text }}</div>

  </div>
</template>
