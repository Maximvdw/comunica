import type { IActorQueryOperationTypedMediatedArgs,
  IActorQueryOperationOutputBindings } from '@comunica/bus-query-operation';
import {
  ActorQueryOperation,
  ActorQueryOperationTypedMediated,
} from '@comunica/bus-query-operation';
import type { ActorRdfJoin, IActionRdfJoin } from '@comunica/bus-rdf-join';
import type { IActorTest, Mediator } from '@comunica/core';
import type { IMediatorTypeIterations } from '@comunica/mediatortype-iterations';
import type { IActorQueryOperationOutput, ActionContext } from '@comunica/types';
import type { Algebra } from 'sparqlalgebrajs';

/**
 * A comunica Join Query Operation Actor.
 */
export class ActorQueryOperationJoin extends ActorQueryOperationTypedMediated<Algebra.Join> {
  public readonly mediatorJoin: Mediator<ActorRdfJoin,
  IActionRdfJoin, IMediatorTypeIterations, IActorQueryOperationOutput>;

  public constructor(args: IActorQueryOperationJoinArgs) {
    super(args, 'join');
  }

  public async testOperation(pattern: Algebra.Join, context: ActionContext): Promise<IActorTest> {
    return true;
  }

  public async runOperation(pattern: Algebra.Join, context: ActionContext): Promise<IActorQueryOperationOutput> {
    const entries: IActorQueryOperationOutputBindings[] = (await Promise.all(pattern.input
      .map(subOperation => this.mediatorQueryOperation.mediate({ operation: subOperation, context }))))
      .map(ActorQueryOperation.getSafeBindings);

    return this.mediatorJoin.mediate({ entries });
  }
}

export interface IActorQueryOperationJoinArgs extends IActorQueryOperationTypedMediatedArgs {
  mediatorJoin: Mediator<ActorRdfJoin, IActionRdfJoin, IMediatorTypeIterations, IActorQueryOperationOutput>;
}
