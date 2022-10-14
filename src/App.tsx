import React from "react";
import { useMachine } from "@xstate/react";

import sessionMachine from "./main.machine";

import Peer from "./Peer";

export default () => {
  const [state] = useMachine(sessionMachine);

  const { peer } = state.context;

  return (
    <div>
      {state.matches("active") ? (
        <Peer actor={peer} />
      ) : (
        <div>
          <p>loading</p>
        </div>
      )}
    </div>
  );
};
