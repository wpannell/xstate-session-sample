import { ActorRef, assign, createMachine, spawn } from "xstate";
import broadcaster, {
  Events as BEvents,
  States as BStates
} from "./broadcast.machine";

export type Context = {
  broadcasts: Map<string, ActorRef<BEvents, BStates>>;
};

export type States =
  | { value: "initiating"; context: Context }
  | { value: "active"; context: Context };

export type Events =
  | { type: "BROADCAST" }

  // actor events
  | { type: "BROADCAST_ENDED"; id: string };

const machine = () => {
  return createMachine<Context, Events, States>(
    {
      initial: "initiating",

      context: {
        broadcasts: new Map()
      },

      states: {
        initiating: {
          invoke: {
            src: "initiate",
            onDone: {
              target: "active",
              actions: assign((_, { data }) => data)
            }
          }
        },

        active: {
          on: {
            BROADCAST_ENDED: {
              actions: assign({
                broadcasts: ({ broadcasts }, { id }) => {
                  console.log("broadcast ended");
                  return broadcasts;
                }
              })
            },

            BROADCAST: {
              actions: ({ broadcasts }) => {
                const id = String(broadcasts.size + 1);

                const actor = spawn(broadcaster(), id);

                broadcasts.set(id, actor as any);

                return broadcasts;
              }
            }
          },

          invoke: {
            src: () => (callback) => {
              return () => {};
            }
          }
        }
      }
    },
    {
      services: {
        initiate: async () => {
          return new Promise((resolve) => {
            setTimeout(resolve, 3000);
          });
        }
      }
    }
  );
};

export default machine;
