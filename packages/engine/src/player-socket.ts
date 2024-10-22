import { Socket } from "socket.io";
import { TimeoutPromise } from "./utils/timeout-promise";
import { SelectActionType } from "./server-actions.const";

type ServerPlayerActionRequest<T> = {
  type: SelectActionType | (string & {});
  payload: T;
};

type ServerPlayerActionResponse<T> = {
  type: SelectActionType | (string & {});
  payload: T;
  success: boolean;
};

export class ServerPlayer {
  constructor(public socket: Socket) {}

  public requestAction<T, R>(
    request: ServerPlayerActionRequest<T>,
    timeout: number,
  ): TimeoutPromise<R> {
    return new TimeoutPromise<R>((resolve, reject, onCancel) => {
      const responseHandler = (response: ServerPlayerActionResponse<R>) => {
        if (response.type === request.type) {
          if (response.success) {
            resolve(response.payload);
          } else {
            reject("Player failed to fulfill the request");
          }
          this.socket.off("playerResponse", responseHandler);
        }
      };

      this.socket.on("playerResponse", responseHandler);
      this.socket.emit("requestAction", request);

      onCancel(() => {
        this.socket.off("playerResponse", responseHandler);
        this.socket.emit("cancelAction", { type: request.type });
      });
    }, timeout);
  }
}

// enum JokenpoAction {
//   Rock = "rock",
//   Paper = "paper",
//   Scissors = "scissors",
// }

// type JokenpoRequestPayload = {
//   action: JokenpoAction;
// };

// const player1 = null as unknown as ServerPlayer;
// const player2 = null as unknown as ServerPlayer;

// const jokenpoTimeout = 10000;

// function determineWinner(
//   action1: JokenpoAction,
//   action2: JokenpoAction,
// ): ServerPlayer | null {
//   return null;
// }

// const playJokenpo = async () => {
//     // Request both players to select their actions
//     const [response1, response2] = await Promise.all([
//       player1.requestAction<JokenpoRequestPayload, JokenpoRequestPayload>(
//         {
//           type: "jokenpo-action",
//           payload: { action: JokenpoAction.Rock },
//         },
//         jokenpoTimeout,
//       ),
//       player2.requestAction<JokenpoRequestPayload, JokenpoRequestPayload>(
//         {
//           type: "jokenpo-action",
//           payload: { action: JokenpoAction.Scissors },
//         },
//         jokenpoTimeout,
//       ),
//     ]);

//     console.log("Both players responded.");

//     // Determine the winner
//     const winner = determineWinner(
//       response1.action,
//       response2.action,
//     );

//     if (winner === null) {
//       console.log("It's a tie!");
//     }

//     console.log("Winner:", winner);
// };
