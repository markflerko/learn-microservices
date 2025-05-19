import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { CONTEXT, NatsContext, RequestContext } from '@nestjs/microservices';

@Injectable({ scope: Scope.REQUEST })
export class TracingLogger extends ConsoleLogger {
  constructor(
    @Inject(CONTEXT) private readonly ctx: RequestContext<unknown, NatsContext>,
    @Inject(INQUIRER) host: object,
  ) {
    const clsNames = host?.constructor?.name;
    super(clsNames);
  }
}
