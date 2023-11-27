import { describe, test, expect, beforeEach } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils';
import { useNotifyStore, NotificationType } from '../stores/notify.store';
import { setActivePinia, createPinia } from 'pinia';

describe('Notify Store', async () => {
  await setup({
    // test context options
  });

  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
  });

  test('should add a notification', () => {
    const notifyStore = useNotifyStore();
    const message = 'Test notification';
    const type = NotificationType.Info;

    notifyStore.notify(message, type);

    expect(notifyStore.notifications).toHaveLength(1);
    expect(notifyStore.notifications[0].message).toBe(message);
    expect(notifyStore.notifications[0].type).toBe(type);
  });

  test('should add an Error notification', () => {
    const notifyStore = useNotifyStore();
    const error = new Error('Test error');
    const type = NotificationType.Error;

    notifyStore.notify(error, type);

    expect(notifyStore.notifications).toHaveLength(1);
    expect(notifyStore.notifications[0].message).toBe(error.message);
    expect(notifyStore.notifications[0].type).toBe(type);
  });

  test('should remove a notification', () => {
    const notifyStore = useNotifyStore();
    const message = 'Test notification';
    const type = NotificationType.Info;

    notifyStore.notify(message, type);
    const notification = notifyStore.notifications[0];

    notifyStore.removeNotification(notification);

    expect(notifyStore.notifications).toHaveLength(0);
  });
});
