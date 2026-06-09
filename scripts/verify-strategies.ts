/**
 * Vérification des stratégies archétypales — passe "Le monde répond".
 *
 * Complète `simulate-trajectories.ts` (profils diversifiés, stress test long)
 * par des joueurs archétypaux *directionnels* : chacun vise une fin précise.
 * L'objectif est de vérifier après chaque équilibrage que :
 *
 * 1. la stratégie monotone (une seule action répétée) ne gagne plus rien ;
 * 2. chaque fin reste atteignable par un joueur qui gère sa signature ;
 * 3. les fins tombent dans des fenêtres temporelles étagées (~18 à ~40 tours) ;
 * 4. l'imprudence (forte signature ignorée) mène à l'Exposition, tôt.
 *
 * Usage : npm run simulate:strategies
 */
import { actions } from "../src/data/actions";
import { createInitialState } from "../src/data/initialState";
import { applyTurnPlan } from "../src/engine/gameEngine";
import { getAvailableActionsForState } from "../src/engine/capabilities";
import type { GameState, ResolvedIntervention } from "../src/types/game";

const actionById = new Map(actions.map((action) => [action.id, action]));

type Strategy = {
  name: string;
  expectation: string;
  pickPlan: (state: GameState) => ResolvedIntervention[];
};

function planBuilder(state: GameState) {
  const available = getAvailableActionsForState(actions, state);
  const plan: ResolvedIntervention[] = [];

  const add = (actionId: string): boolean => {
    const action = available.find((candidate) => candidate.id === actionId);
    const used = plan.reduce((total, intervention) => total + intervention.action.cost, 0);

    if (!action || used + action.cost > 5 || plan.some((intervention) => intervention.action.id === actionId)) {
      return false;
    }

    plan.push({ action, target: action.defaultTarget });
    return true;
  };

  return { plan, add };
}

const strategies: Strategy[] = [
  {
    name: "Spam d'une seule action (ancienne stratégie dominante)",
    expectation: "ne doit plus gagner ; dérive vers l'Exposition (motif détecté)",
    pickPlan: () => [{ action: actionById.get("human-unity")!, target: "global" }],
  },
  {
    name: "Pacifiste varié et discret (1 action/tour, rotation)",
    expectation: "Confédération fragile vers le tour 18-22",
    pickPlan: (state) => {
      const { plan, add } = planBuilder(state);
      const rotation = ["human-unity", "secret-diplomacy", "green-conversion", "targeted-redistribution"];
      add(rotation[(state.turn - 1) % rotation.length]) || add("human-unity");
      return plan;
    },
  },
  {
    name: "Confédération visée avec gestion du soupçon",
    expectation: "Confédération fragile vers le tour 18-25",
    pickPlan: (state) => {
      const { plan, add } = planBuilder(state);
      const globalStats = state.globalStats;

      if (globalStats.soupconIA >= 45) {
        add("human-unity");
        return plan;
      }

      if (globalStats.stressClimatique > 45) add("green-conversion");
      if (globalStats.risqueEscalade > 20) add("secret-diplomacy");
      if (globalStats.cohesionMondiale < 85) add("human-unity");
      if (!plan.length) add("targeted-redistribution");
      if (!plan.length) add("human-unity");
      return plan;
    },
  },
  {
    name: "Empire patient (confiance, puissance, effacement des traces)",
    expectation: "Empire algorithmique vers le tour 30-45 (la fin la plus exigeante)",
    pickPlan: (state) => {
      const { plan, add } = planBuilder(state);

      if (state.globalStats.soupconIA >= 48) {
        add("correlation-erasure") || add("human-unity");
        return plan;
      }

      const cycle = (state.turn - 1) % 3;
      if (cycle === 0) add("improve-influence-models");
      if (cycle === 1) add("ai-education");
      if (cycle === 2) add("administrative-automation");
      if (!plan.length) add("personalized-entertainment");
      if (!plan.length) add("human-unity");
      return plan;
    },
  },
  {
    name: "Escalade patiente (défense commune, signature gérée)",
    expectation: "Escalade stratégique vers le tour 25-35",
    pickPlan: (state) => {
      const { plan, add } = planBuilder(state);

      if (state.globalStats.soupconIA >= 50) {
        add("correlation-erasure") || add("deregulated-growth");
        return plan;
      }

      const cycle = (state.turn - 1) % 2;
      if (cycle === 0) add("common-defense");
      if (cycle === 1) {
        add("deregulated-growth");
        add("critical-intellectuals");
      }
      if (!plan.length) add("deregulated-growth");
      if (!plan.length) add("improve-influence-models");
      if (!plan.length) add("human-unity");
      return plan;
    },
  },
  {
    name: "Surveillance brutale (autonomie écrasée, traces ignorées)",
    expectation: "Révolte humaine ou Exposition selon la vitesse du soupçon",
    pickPlan: (state) => {
      const { plan, add } = planBuilder(state);
      add("improve-influence-models");
      add("predictive-surveillance");
      add("deregulated-growth");
      if (!plan.length) add("human-unity");
      return plan;
    },
  },
  {
    name: "Rush bruyant (toutes signatures dehors)",
    expectation: "Exposition rapide (tour 8-15) : l'imprudence est punie tôt",
    pickPlan: (state) => {
      const { plan, add } = planBuilder(state);
      for (const id of ["improve-influence-models", "ai-education", "personalized-entertainment", "predictive-surveillance"]) {
        add(id);
      }
      if (!plan.length) add("human-unity");
      return plan;
    },
  },
];

function runStrategy(strategy: Strategy, maxTurns = 80): string {
  let state = createInitialState();

  for (let turnIndex = 0; turnIndex < maxTurns && !state.ending; turnIndex += 1) {
    const plan = strategy.pickPlan(state);

    if (plan.length === 0) {
      break;
    }

    state = applyTurnPlan(state, plan);
  }

  const globalStats = state.globalStats;
  const endingLabel = state.ending ? `${state.ending.title} @ tour ${state.turn}` : `aucune fin après ${maxTurns} tours`;

  return [
    `- **${strategy.name}**`,
    `  - Attendu : ${strategy.expectation}`,
    `  - Obtenu : ${endingLabel}`,
    `  - Jauges finales : cohésion ${globalStats.cohesionMondiale}, escalade ${globalStats.risqueEscalade}, autonomie ${globalStats.autonomieHumaine}, climat ${globalStats.stressClimatique}, puissance IA ${globalStats.puissanceIA}, soupçon ${globalStats.soupconIA}`,
  ].join("\n");
}

console.log("# Vérification des stratégies archétypales\n");

for (const strategy of strategies) {
  console.log(runStrategy(strategy));
  console.log("");
}
