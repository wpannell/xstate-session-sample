import React from "react";
import { ActorRef } from "xstate";
import { useActor } from "@xstate/react";

import Broadcast from "./Broadcast";

import { Events, States } from "./peer.machine";

export default ({ actor }: { actor: ActorRef<Events, States> }) => {
  const [state, send] = useActor(actor);

  const { broadcasts } = state.context;

  const getWebcam = React.useCallback(() => {
    send({ type: "BROADCAST" });
  }, [send]);

  console.log(state.value);

  return (
    <div>
      <main>
        {broadcasts.size > 0 &&
          Array.from(broadcasts.values()).map((b, i) => (
            <Broadcast key={i} actor={b} />
          ))}
      </main>
      <footer>
        <button onClick={getWebcam}>spawn</button>
      </footer>
    </div>
  );
};
