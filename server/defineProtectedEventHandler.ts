import {
  type EventHandler,
  type EventHandlerRequest,
  H3Event,
  eventHandler
} from 'h3';

export const defineProtectedEventHandler = <T extends EventHandlerRequest>(
  handler: EventHandler<T>
): EventHandler<T> => {
  handler.__is_handler__ = true;

  return eventHandler((event: H3Event) => {
    const user = event.context.user;
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' });
    }
    return handler(event);
  });
};
