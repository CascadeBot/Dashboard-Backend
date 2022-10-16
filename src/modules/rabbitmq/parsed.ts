import { Message } from 'amqplib';
import {
  BroadcastOptions,
  sendBroadcastMessage,
  sendDirectMessage,
  SendOptions,
} from './response';

export class ResponseError extends Error {
  error_code: string;
  status_code: number;

  constructor(msg: RMQResponseError) {
    super(msg.error.message);
    this.name = 'ResponseError';
    this.status_code = msg.status_code;
    this.error_code = msg.error.error_code;
  }
}

interface RMQResponseErrorSub {
  error_code: string;
  message: string;
}

export type Response<T> = RMQResponseSuccess<T> | RMQResponseError;

interface RMQResponseSuccess<T> {
  status_code: number;
  error: undefined;
  data: T;
}

interface RMQResponseError {
  status_code: number;
  error: RMQResponseErrorSub;
  data: undefined;
}

function parseMessage<T>(msg: Message): T {
  const dataObject: Response<T> = JSON.parse(msg.content.toString('utf-8'));
  if (dataObject.error) {
    throw new ResponseError(dataObject as RMQResponseError);
  }
  return dataObject.data;
}

export async function sendParsedDirectMessage<T = null>(
  options: SendOptions,
): Promise<T> {
  const reply = await sendDirectMessage(options);
  if (reply === true) return null;
  const parsedReply = parseMessage<T>(reply[0]);
  return parsedReply;
}

export async function sendParsedBroadcastMessage<T>(
  options: BroadcastOptions,
): Promise<T[]> {
  const replies = await sendBroadcastMessage(options);
  if (replies === true) return null;
  const parsedReplies = replies.map((v) => parseMessage<T>(v));
  return parsedReplies;
}
