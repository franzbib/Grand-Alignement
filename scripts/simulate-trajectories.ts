import { mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { INFLUENCE_CAPACITY } from "../src/engine/gameEngine";
import { simulateAllProfiles } from "../src/engine/simulateGame";
import type { GlobalStats } from "../src/types/game";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const reportPath = resolve(repoRoot, "docs/playtests/trajectory-simulation-report.md");

function getCommitHash(): string {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
  } catch {
    return "inconnu";
  }
}

function formatGlobalStats(stats: GlobalStats): string {
  return [
    `cohésion ${stats.cohesionMondiale}`,
    `escalade ${stats.risqueEscalade}`,
    `autonomie ${stats.autonomieHumaine}`,
    `climat ${stats.stressClimatique}`,
    `puissance IA ${stats.puissanceIA}`,
    `soupçon ${stats.soupconIA}`,
  ].join(", ");
}

function formatMarkdownTable(rows: string[][]): string {
  return rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function findAnomalies(results: ReturnType<typeof simulateAllProfiles>): string[] {
  const anomalies: string[] = [];
  const endings = results.filter((result) => result.ending);
  const dominantAt50 = results.map((result) => result.snapshots.find((snapshot) => snapshot.horizon === 50)?.dominantTrajectory ?? "");
  const uniqueDominants = new Set(dominantAt50.map((item) => item.replace(/\s\(\d+\)$/, "")));

  if (endings.length === 0) {
    anomalies.push("Aucune fin ne se déclenche sur 50 tours dans ces profils. Ce n'est pas forcément un bug, mais les fins peuvent être lointaines.");
  }

  if (uniqueDominants.size <= 2) {
    anomalies.push("Les profils convergent vers peu de trajectoires dominantes à 50 tours. Une passe d'équilibrage devra vérifier la diversité.");
  }

  for (const result of results) {
    const snapshot50 = result.snapshots.find((snapshot) => snapshot.horizon === 50);
    if (!snapshot50) continue;

    const values = Object.values(snapshot50.globalStats);
    const saturated = values.filter((value) => value <= 5 || value >= 95);
    if (saturated.length >= 2) {
      anomalies.push(`${result.profile.name} présente plusieurs jauges globales saturées à 50 tours.`);
    }
  }

  return anomalies.length > 0 ? anomalies : ["Aucune anomalie flagrante détectée dans cette passe automatique."];
}

function makeReport(): string {
  const results = simulateAllProfiles();
  const commitHash = getCommitHash();
  const now = new Date().toISOString().slice(0, 10);
  const anomalies = findAnomalies(results);
  const horizons = [5, 10, 30, 50];
  const lines: string[] = [
    "# Rapport de simulation des trajectoires",
    "",
    `Date : ${now}`,
    `Commit testé : ${commitHash}`,
    `Commande : \`npm.cmd run simulate:trajectories\``,
    `Capacité d'influence : ${INFLUENCE_CAPACITY}`,
    "",
    "## Résumé général",
    "",
    "Simulation déterministe de profils de joueur. L'outil observe les trajectoires sans modifier le gameplay, les fins, les opérations, les événements ou l'interface publique.",
    "",
    "## Profils testés",
    "",
    ...results.map((result) => `- **${result.profile.name}** : ${result.profile.description}`),
    "",
  ];

  for (const horizon of horizons) {
    lines.push(`## Résultats à ${horizon} tours`, "");
    lines.push(
      formatMarkdownTable([
        [
          "Profil",
          "Année",
          "Jauges globales",
          "Trajectoire dominante",
          "Secondaires",
          "Fin",
          "Blocs à surveiller",
          "Diagnostic",
        ],
        ["---", "---", "---", "---", "---", "---", "---", "---"],
        ...results.map((result) => {
          const snapshot = result.snapshots.find((item) => item.horizon === horizon) ?? result.snapshots.at(-1);
          if (!snapshot) {
            return [result.profile.name, "-", "-", "-", "-", "-", "-", "Aucun instantané."];
          }

          return [
            result.profile.name,
            String(snapshot.year),
            formatGlobalStats(snapshot.globalStats),
            snapshot.dominantTrajectory,
            snapshot.secondaryTrajectories.join(", ") || "aucune",
            snapshot.ending ?? "aucune",
            [
              `instables: ${snapshot.mostUnstableBlocks.join(", ")}`,
              `IA: ${snapshot.mostAiAlignedBlocks.join(", ")}`,
              `tendus: ${snapshot.mostTenseBlocks.join(", ")}`,
            ].join("; "),
            snapshot.diagnostic,
          ];
        }),
      ]),
    );
    lines.push("");
  }

  lines.push("## Anomalies observées", "", ...anomalies.map((anomaly) => `- ${anomaly}`), "");
  lines.push("## Questions d'équilibrage", "");
  lines.push("- Les profils de sécurité et d'alignement mondial produisent-ils des trajectoires assez distinctes ?");
  lines.push("- Les trajectoires de capture privée et d'abêtissement restent-elles trop dépendantes de proxys faibles ?");
  lines.push("- Les fins diagnostiques doivent-elles apparaître plus tôt après le tour 15 ou rester rares à 50 tours ?");
  lines.push("- Les profils de marché et d'empire algorithmique créent-ils des coûts sociaux assez visibles ?");
  lines.push("");
  lines.push("## Recommandations sans modification automatique", "");
  lines.push("- Lire d'abord les écarts à 10 et 30 tours avant toute retouche d'équilibrage.");
  lines.push("- Ne pas modifier les seuils de fins depuis ce rapport seul.");
  lines.push("- Utiliser ce rapport comme base d'une passe humaine de playtest ciblée.");
  lines.push("- Ajouter un mode debug détaillé seulement si le résumé ne suffit pas.");
  lines.push("");

  return lines.join("\n");
}

const report = makeReport();
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, report, "utf8");

console.log(report);
console.log(`\nRapport écrit : ${reportPath}`);
