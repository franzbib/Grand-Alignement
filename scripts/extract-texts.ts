/**
 * Extraction des textes joueur — outillage des passes littéraires.
 *
 * Génère un relevé markdown de tous les textes statiques que le joueur lit
 * (fins, événements, crises, actions), avec compte de mots et alertes de
 * dépassement des budgets de la charte. Permet de faire une passe purement
 * littéraire dans un seul document, puis de reporter les retouches dans les
 * fichiers de données.
 *
 * Usage : npm run extract:texts   (écrit docs/playtests/releve-textes.md)
 *
 * Budgets indicatifs (passe « Textes digestes », charte littéraire §1 et §5) :
 * fin <= 60 mots ; crise (déclenchement) <= 32 ; crise (issue) <= 26 ;
 * événement <= 24 ; texte d'événement d'action <= 24.
 */
import { writeFileSync } from "node:fs";
import { endings } from "../src/data/endings";
import { systemicEvents } from "../src/data/events";
import { crises } from "../src/data/crises";
import { actions } from "../src/data/actions";

const BUDGETS = {
  fin: 60,
  criseDeclenchement: 32,
  criseIssue: 26,
  evenement: 24,
  actionEvent: 24,
} as const;

type Row = { category: string; id: string; words: number; budget: number; text: string };

const wordCount = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

const rows: Row[] = [];

for (const ending of endings) {
  rows.push({ category: "Fin", id: ending.id, words: wordCount(ending.description), budget: BUDGETS.fin, text: ending.description });
}

for (const crisis of crises) {
  rows.push({ category: "Crise — déclenchement", id: crisis.id, words: wordCount(crisis.text), budget: BUDGETS.criseDeclenchement, text: crisis.text });
  rows.push({ category: "Crise — résolution", id: crisis.id, words: wordCount(crisis.resolutionText), budget: BUDGETS.criseIssue, text: crisis.resolutionText });
  rows.push({ category: "Crise — échec", id: crisis.id, words: wordCount(crisis.failureText), budget: BUDGETS.criseIssue, text: crisis.failureText });
}

for (const event of systemicEvents) {
  rows.push({ category: "Événement", id: event.id, words: wordCount(event.text), budget: BUDGETS.evenement, text: event.text });
}

for (const action of actions) {
  if (action.eventText) {
    rows.push({ category: "Action — événement", id: action.id, words: wordCount(action.eventText), budget: BUDGETS.actionEvent, text: action.eventText });
  }
}

const overBudget = rows.filter((row) => row.words > row.budget).sort((left, right) => right.words - left.words);

const lines: string[] = [
  "# Relevé des textes joueur",
  "",
  `Généré par \`npm run extract:texts\`. ${rows.length} textes statiques, ${overBudget.length} au-dessus du budget de la passe « Textes digestes ».`,
  "",
];

if (overBudget.length > 0) {
  lines.push("## Au-dessus du budget", "");
  for (const row of overBudget) {
    lines.push(`- **${row.category} / ${row.id}** : ${row.words} mots (budget ${row.budget})`);
  }
  lines.push("");
}

lines.push("## Tous les textes", "");
for (const row of rows) {
  const flag = row.words > row.budget ? " ⚠" : "";
  lines.push(`### ${row.category} — \`${row.id}\` (${row.words} mots${flag})`, "", `> ${row.text}`, "");
}

writeFileSync("docs/playtests/releve-textes.md", lines.join("\n"));
console.log(`Relevé écrit : docs/playtests/releve-textes.md (${rows.length} textes, ${overBudget.length} au-dessus du budget)`);
