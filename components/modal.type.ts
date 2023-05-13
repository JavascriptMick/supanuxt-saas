import { Modal } from '#components';

// seems pretty stoopid that I need to do this in a seperate file but it seems to work
export type ModalType = typeof Modal extends new () => infer T ? T : never;