import {Engine} from './Engine';

/**
 * Systems are logic bricks in your application.
 * If you want ot manipulate entities and their components - it is the right place to that.
 */
export abstract class System {
  private _priority: number = 0;
  private _engine?: Engine;

  /**
   * Gets an {@link Engine} instance that system attached to
   * @returns {Engine}
   * @throws An error if system is not attached to the engine
   */
  public get engine(): Engine {
    if (this._engine === undefined) throw new Error(`Property "engine" can't be accessed when system is not added to the engine`);
    return this._engine;
  }

  /**
   * Gets a priority of the system
   */
  public get priority(): number {
    return this._priority;
  }

  /**
   * All logic aimed at making changes in entities and their components must be placed in this method.
   * @param dt - The time in seconds it took from previous update call.
   */
  public update(dt: number) {}

  /**
   * This method will be called after the system will be added to the Engine.
   * @param engine - {@link Engine} instance
   * In the version 3.0.0 `engine` parameter will be removed, use `this.engine` instead
   */
  public onAddedToEngine(engine: Engine) {}

  /**
   * Callback that will be invoked after removing system from engine
   * @param engine - Engine instance
   * In the version 3.0.0 `engine` parameter will be removed, use `this.engine` instead
   */
  public onRemovedFromEngine(engine: Engine) {}

  /**
   * Dispatches a message, that can be caught via {@link Engine#subscribe}.
   * It's the best way to send a message outside. This mechanism allows you not to invent the signals/dispatchers
   * mechanism for your systems, to report an event. For example, you can dispatch that the game round has been
   * completed.
   *
   * @param {T} message
   * @throws An error if system is not attached to the engine
   * @example
   * ```ts
   * class RoundCompleted {
   *   public constructor(
   *      public readonly win:boolean
   *   ) {}
   * }
   *
   * const engine = new Engine();
   * engine.subscribe(RoundCompleted, (message:RoundCompleted) => {
   *   if (message.win) {
   *     this.showWinDialog();
   *   } else {
   *     this.showLoseDialog();
   *   }
   * })
   *
   * class RoundCompletionSystem extends System {
   *   public update(dt:number) {
   *     if (heroesQuery.isEmpty) {
   *       this.dispatch(new RoundCompleted(false));
   *     } else if (enemiesQuery.isEmpty) {
   *       this.dispatch(new RoundCompleted(true));
   *     }
   *   }
   * }
   * ```
   */
  public dispatch<T>(message: T): void {
    if (this._engine === undefined) {
      throw new Error('Dispatching a message can\'t be done while system is not attached to the engine');
    }
    this.engine.dispatch(message);
  }

  /**
   * @internal
   */
  public setEngine(engine: Engine | undefined): void {
    this._engine = engine;
  }

  /**
   * @internal
   */
  public setPriority(priority: number): void {
    this._priority = priority;
  }
}
