/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NATS_BROKER } from '@app/tracing/nats-client/constants';
import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  ClientProxy,
  CONTEXT,
  NatsContext,
  NatsRecord,
  NatsRecordBuilder,
  RequestContext,
} from '@nestjs/microservices';
import * as nats from 'nats';
import { Observable } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export class NatsClientProxy {
  constructor(
    @Inject(NATS_BROKER) private readonly client: ClientProxy,
    @Inject(CONTEXT) private readonly ctx: RequestContext<unknown, NatsContext>,
  ) {}

  send<TResult = any, TInput = any>(
    pattern: any,
    data: TInput,
  ): Observable<TResult> {
    return this.client.send(pattern, this.setTraceId(data));
  }

  emit<TResult = any, TInput = any>(
    pattern: any,
    data: TInput,
  ): Observable<TResult> {
    return this.client.emit(pattern, this.setTraceId(data));
  }

  private setTraceId(dataOrRecord: any) {
    const headers = dataOrRecord?.headers ?? nats.headers();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    headers.set('traceId', this.ctx.getContext().getHeaders().get('traceId'));

    if (dataOrRecord instanceof NatsRecord) {
      return new NatsRecordBuilder(dataOrRecord.data)
        .setHeaders(headers)
        .build();
    }

    return new NatsRecordBuilder().setData(dataOrRecord).setHeaders(headers);
  }
}
