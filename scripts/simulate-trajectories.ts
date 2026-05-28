import { simulateDefaultScenarios } from "../src/engine/simulateGame";
import { INFLUENCE_CAPACITY } from "../src/engine/gameEngine";

console.log(
  JSON.stringify(
    {
      influenceCapacity: INFLUENCE_CAPACITY,
      scenarios: simulateDefaultScenarios(),
    },
    null,
    2,
  ),
);
