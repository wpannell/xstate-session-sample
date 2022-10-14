import { ActorRef, assign, createMachine, spawn } from "xstate";
import peerMachine, {
  Events as PEvents,
  States as PStates
} from "./peer.machine";

type Context = {
  error?: Error;
  peer?: ActorRef<PEvents, PStates>;
};

type States =
  | { value: "idle"; context: Context }
  | { value: "initiating"; context: Context }
  | { value: "active"; context: Context }
  | { value: "inactive"; context: Context }
  | { value: "error"; context: Context };

type Events = { type: "LEAVE" } | { type: "INITIATE" };

const machine = createMachine<Context, Events, States>(
  {
    initial: "initiating",

    states: {
      idle: {
        on: {
          INITIATE: "initiating"
        }
      },

      initiating: {
        invoke: {
          src: "joinSession",
          onDone: {
            target: "active",
            actions: "spawnPeer"
          },
          onError: {
            actions: (_, { data }) => {
              console.log(data);
            }
          }
        }
      },

      active: {
        invoke: {
          src: () => () => {
            return () => {};
          }
        }
      }
    }
  },
  {
    services: {
      joinSession: () => {
        return new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });
      }
    },
    actions: {
      spawnPeer: assign({
        peer: () => spawn(peerMachine())
      })
    }
  }
);

export default machine;
