<script setup lang="ts">
const route = useRoute();
const { $client } = useNuxtApp();
const { data: note } = await $client.notes.getById.useQuery({note_id: +route.params.note_id});
</script>
<template>
  <div>
    <h3>Note Detail {{ route.params.note_id }}</h3>
    <pre>{{ note?.note.note_text }}</pre>

    <NuxtLink to="/notes/1">Back to Note 1 via an internal link (should not reload page)</NuxtLink>
  </div>
</template>
