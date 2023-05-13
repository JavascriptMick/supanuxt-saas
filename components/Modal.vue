<script lang="ts" setup>
  /*
    pre-requisites.. Tailwind + DaisyUI

    setup...
    import { ModalType } from '~~/components/modal.type';
    const myCoolModal = ref<ModalType>();

    myCoolModal.value!.open();

    template...
    <Modal ref="myCoolModal" showCancel @closeOk="doSomethingUsefulOnClose()">
      <h3 class="font-bold text-xl">Modal Title</h3>
      <p class="py-4">Some kind of text</p>
    </Modal>
  */
  import { ref } from 'vue';

  // component property that controls the visibility of the modal
  const modalIsVisible = ref(false);

  // props for which buttons to show
  interface Props {
    showOk?: boolean
    showCancel?: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    showOk: true,
    showCancel: false,
  })

  // open event (exposed to parent)
  const open = () => {
    modalIsVisible.value = true;
  }
  defineExpose({ open });

  // close events emitted on modal close
  const emit = defineEmits(['closeOk', 'closeCancel']);
  const closeOk = () => {
    emit('closeOk');
    modalIsVisible.value = false;
  }
  const closeCancel = () => {
    emit('closeCancel');
    modalIsVisible.value = false;
  }
</script>

<template>
  <!-- the input controls the visibility of the modal (css shenanigans) the v-model allows me to control it in turn from the wrapper component -->
  <input type="checkbox" id="my-modal" class="modal-toggle" v-model="modalIsVisible" />
  <div class="modal">
    <div class="modal-box">
      <slot />
      <div class="flex justify-end space-x-2">
        <!-- I decided not to use the 'for' directives which do the close in css so I can control the emission of events explicitly -->
        <div class="modal-action" v-if="showOk">
          <label class="btn btn-success" @click="closeOk()">Ok</label>
        </div>
        <div class="modal-action" v-if="showCancel">
          <label class="btn btn-error" @click="closeCancel()">Cancel</label>
        </div>
      </div>
    </div>
  </div>
</template>