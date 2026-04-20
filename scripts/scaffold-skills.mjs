#!/usr/bin/env node
// One-shot scaffolder for skill pointers.
// Reads every SKILL.md shipped under node_modules/diagramkit/skills/ and
// node_modules/@pagesmith/site/skills/, writes a canonical pointer at
// .agents/skills/<name>/SKILL.md, and mirrors a thin pointer at
// .claude/skills/<name>/SKILL.md and .cursor/skills/<name>/SKILL.md.
//
// Idempotent: safe to re-run after `npm install <package>` to pick up new
// skills. Existing pointer files are overwritten so descriptions track the
// installed package version.

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

const sources = [
  {
    pkg: "diagramkit",
    dir: resolve(projectRoot, "node_modules/diagramkit/skills"),
    note:
      "Always anchor on the local install (`npx diagramkit ...`). Read " +
      "`node_modules/diagramkit/REFERENCE.md` first if you have not already.",
  },
  {
    pkg: "@pagesmith/site",
    dir: resolve(projectRoot, "node_modules/@pagesmith/site/skills"),
    note:
      "Always invoke through `npx pagesmith-site ...` so it resolves to the " +
      "project-local binary. Read `node_modules/@pagesmith/site/REFERENCE.md` " +
      "first if you have not already.",
  },
];

function readDescription(skillFile) {
  const text = readFileSync(skillFile, "utf-8");
  const fmEnd = text.indexOf("\n---", 4);
  const fm = text.slice(0, fmEnd);
  const m = fm.match(/^description:\s*(.+)$/m);
  return m ? m[1].trim() : "";
}

function ensureWrite(filePath, body) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, body);
  console.log(`  wrote ${relative(projectRoot, filePath)}`);
}

function canonicalPointer(name, description, source, sourceRel) {
  return `---
name: ${name}
description: ${description}
---

# ${name}

Follow the version-pinned skill that ships with the locally installed \`${source.pkg}\` package:

→ [\`${sourceRel}\`](${relative(`.agents/skills/${name}`, sourceRel)})

${source.note}
`;
}

function harnessPointer(name, description) {
  return `---
name: ${name}
description: ${description}
---

# ${name}

Follow [\`.agents/skills/${name}/SKILL.md\`](../../../.agents/skills/${name}/SKILL.md). Do not duplicate its content here.
`;
}

const harnessRoots = [".claude/skills", ".cursor/skills"];

for (const source of sources) {
  console.log(`\n[${source.pkg}]`);
  let entries;
  try {
    entries = readdirSync(source.dir, { withFileTypes: true });
  } catch {
    console.log(`  skipped: ${source.dir} not found`);
    continue;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const skillFile = join(source.dir, name, "SKILL.md");
    let description;
    try {
      description = readDescription(skillFile);
    } catch {
      console.log(`  skipped ${name}: no SKILL.md`);
      continue;
    }
    if (!description) {
      console.log(`  skipped ${name}: no description`);
      continue;
    }
    const sourceRel = relative(projectRoot, skillFile);
    const canonicalPath = resolve(projectRoot, ".agents/skills", name, "SKILL.md");
    ensureWrite(canonicalPath, canonicalPointer(name, description, source, sourceRel));
    for (const harness of harnessRoots) {
      const harnessPath = resolve(projectRoot, harness, name, "SKILL.md");
      ensureWrite(harnessPath, harnessPointer(name, description));
    }
  }
}

// Ensure project-specific prj-* skills get matching harness mirrors.
const prjDir = resolve(projectRoot, ".agents/skills");
console.log(`\n[prj-*]`);
for (const entry of readdirSync(prjDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith("prj-")) continue;
  const name = entry.name;
  const skillFile = join(prjDir, name, "SKILL.md");
  let description;
  try {
    description = readDescription(skillFile);
  } catch {
    console.log(`  skipped ${name}: no SKILL.md`);
    continue;
  }
  for (const harness of harnessRoots) {
    const harnessPath = resolve(projectRoot, harness, name, "SKILL.md");
    ensureWrite(harnessPath, harnessPointer(name, description));
  }
}

console.log("\nDone.");
