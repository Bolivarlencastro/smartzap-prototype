#!/usr/bin/env tsx
/**
 * stitch-refine.ts
 * Iteratively refines a Stitch screen to match a reference screenshot.
 * Uses "claude -p --allowedTools Read" so Claude views both PNGs visually.
 */

import { execFileSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const STITCH_API_KEY = 'AQ.Ab8RN6IOq0pR1q90Z30H58L_j3_ZWaURwfLVo4k9-kzthwWPvA';
const PROJECT_ID = '1816446961006382078';
const SCREEN_ID = 'ac682af767464377810148ba8a620866';
const REF_PATH = join(process.cwd(), '.claude/smartzap-reference/screens/courses.png');
const MAX_ITER = 4;
const CLAUDE_BIN = '/Users/bolivaralencastro/.local/bin/claude';

process.env.STITCH_API_KEY = STITCH_API_KEY;

const TMP_DIR = join(tmpdir(), 'stitch-refine');
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

async function downloadToFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function askClaude(refPath: string, genPath: string, iteration: number): string {
  const prompt = `You are visually comparing two screenshots to produce a precise fix prompt for a UI design tool called Stitch.

Use the Read tool to view BOTH images:
- IMAGE A (reference — what it should look like): ${refPath}
- IMAGE B (generated — current output to fix): ${genPath}

After viewing both, identify every visual difference between them. Then write a concise edit prompt (max 250 words) with ONLY the specific corrections needed to make IMAGE B match IMAGE A exactly.

Rules for the edit prompt:
- Start each correction with an action verb: Remove, Change, Replace, Add, Fix
- Be specific (e.g. "Remove text labels under sidebar icons", "Change sidebar background from gradient to solid flat #6d37df")
- No preamble, no explanations — ONLY the edit instructions
- This is iteration ${iteration} of ${MAX_ITER}`;

  return execFileSync(CLAUDE_BIN, ['--print', '-p', prompt, '--allowedTools', 'Read'], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    timeout: 120_000,
  }).trim();
}

async function main() {
  console.log('🎨  Stitch Refiner — SmartZap Courses Page');
  console.log(`    Project   : ${PROJECT_ID}`);
  console.log(`    Screen    : ${SCREEN_ID}`);
  console.log(`    Iterations: ${MAX_ITER}`);
  console.log(`    Strategy  : visual (claude -p --allowedTools Read)\n`);

  const { stitch } = await import('@google/stitch-sdk');
  const project = stitch.project(PROJECT_ID);
  let screen = await project.getScreen(SCREEN_ID);

  for (let i = 1; i <= MAX_ITER; i++) {
    console.log(`\n━━ Iteration ${i}/${MAX_ITER} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // 1. Get current Stitch screenshot
    const imageUrl = await screen.getImage();
    const genPath = join(TMP_DIR, `gen-iter-${i}.png`);
    console.log('  [stitch] Downloading current screenshot...');
    await downloadToFile(imageUrl, genPath);
    console.log(`  [stitch] Saved to ${genPath}`);

    // 2. Ask Claude to visually compare and produce edit prompt
    console.log('  [claude] Comparing screenshots visually...');
    const editPrompt = askClaude(REF_PATH, genPath, i);

    console.log('\n  ┌─ Edit prompt ───────────────────────────────────────');
    editPrompt.split('\n').forEach((l) => console.log(`  │ ${l}`));
    console.log('  └────────────────────────────────────────────────────\n');

    // 3. Apply the edit in Stitch
    console.log('  [stitch] Applying edit...');
    screen = await screen.edit(editPrompt);

    const newImgUrl = await screen.getImage();
    console.log(`  [stitch] New screen ID : ${screen.screenId}`);
    console.log(`  [stitch] Screenshot    : ${newImgUrl}`);
  }

  const finalHtmlUrl = await screen.getHtml();
  console.log('\n✅  Done!');
  console.log(`    Final screen ID : ${screen.screenId}`);
  console.log(`    HTML download   : ${finalHtmlUrl}`);

  // Cleanup temp files
  rmSync(TMP_DIR, { recursive: true, force: true });
}

main().catch((err) => {
  console.error('\n❌  Error:', err.message);
  process.exit(1);
});
