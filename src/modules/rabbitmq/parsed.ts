import {
  BroadcastOptions,
  sendBroadcastMessage,
  sendDirectMessage,
  SendOptions,
} from './response';

// TODO parsing
// TODO wrap in request object

export function sendParsedDirectMessage<T>(options: SendOptions) {
  return sendDirectMessage(options) as T;
}

export function sendParsedBroadcastMessage<T>(options: BroadcastOptions) {
  return sendBroadcastMessage(options) as any as T[];
}
