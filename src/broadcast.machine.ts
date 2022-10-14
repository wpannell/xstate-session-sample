import { assign, createMachine, sendParent } from "xstate";

export type Context = {
  tracks: MediaStreamTrack[];
};

export type States =
  | { value: "creating"; context: Context }
  | {
      context: Context;
      value: "broadcasting" | { broadcasting: "idle" | "stoppping" };
    }
  | { value: "stopped"; context: Context };

export type Events = { type: "STOP" };

const delay = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

const machine = () => {
  return createMachine<Context, Events, States>(
    {
      id: "broadcaster",
      initial: "creating",

      states: {
        creating: {
          entry: () => console.log("create entry"),

          invoke: {
            src: "createBroadcast",
            onDone: {
              target: "broadcasting",
              actions: assign((_, { data }) => data)
            },
            onError: {
              actions: (_, { data }) => console.log("error creating", data)
            }
          }
        },
        broadcasting: {
          initial: "idle",

          states: {
            idle: {
              on: {
                STOP: "stopping"
              },
              invoke: {
                src: () => () => {
                  return () => {};
                }
              }
            },
            stopping: {
              invoke: {
                src: "stopBroadcast",
                onDone: "#broadcaster.stopped"
              }
            }
          }
        },
        stopped: {
          entry: sendParent({ type: "BROADCAST_STOPPED" })
        }
      }
    },
    {
      services: {
        stopBroadcast: () => {
          return delay();
        },
        createBroadcast: async () => {
          console.log("creating broadcast");
          return delay();
        }
      }
    }
  );
};

export default machine;
