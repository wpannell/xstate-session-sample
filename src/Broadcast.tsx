import React from "react";
import { ActorRef } from "xstate";
import { useActor } from "@xstate/react";

import { Events, States } from "./broadcast.machine";

export default ({ actor }: { actor: ActorRef<Events, States> }) => {
  const [state, send] = useActor(actor);
  const ref = React.createRef<HTMLVideoElement>();

  console.log(state.value);

  return (
    <div>
      <video ref={ref} />
    </div>
  );
};
