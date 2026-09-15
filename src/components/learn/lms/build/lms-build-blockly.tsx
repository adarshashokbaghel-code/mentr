"use client";

/**
 * Blockly workspace — always-open flyout so steps stay visible.
 * Compact text labels. No custom CSS classes.
 */

import {
  buildMissionPalette,
  matchesBuildSolution,
  type BuildMission,
} from "@/lib/learn-build-missions";
import { cn } from "@/lib/utils";
import * as Blockly from "blockly";
import { useEffect, useRef } from "react";

const PREFIX = "mentr_step_";

function stepHue(id: string): number {
  const map: Record<string, number> = {
    bread_bottom: 45,
    lettuce: 120,
    tomato: 0,
    cheese: 40,
    bread_top: 50,
    cookie: 30,
    wash: 200,
    forward: 20,
    left: 250,
    right: 170,
    power: 45,
    cpu: 270,
    memory: 200,
    screen: 210,
    banana: 55,
    speaker_only: 350,
    water: 195,
    repeat4_water: 160,
    repeat2_forward: 160,
    repeat3_forward: 165,
    repeat4_forward: 170,
    if_gold_take_else_jump: 35,
    always_take: 0,
    always_jump: 200,
    when_flag: 120,
    move: 20,
    say: 200,
    set_score_0: 270,
    change_score_1: 140,
    set_score_99: 0,
    if_else: 35,
  };
  return map[id] ?? 25;
}

function ensureStepBlocks(mission: BuildMission) {
  const palette = buildMissionPalette(mission);
  Blockly.defineBlocksWithJsonArray(
    palette.map((s) => ({
      type: `${PREFIX}${s.id}`,
      message0: s.label,
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: stepHue(s.id),
      tooltip: `${s.glyph} ${s.label}`,
      helpUrl: "",
    })),
  );
}

function loadStarter(workspace: Blockly.WorkspaceSvg, order: string[]) {
  if (!order.length) return;
  let prev: Blockly.Block | null = null;
  order.forEach((id, index) => {
    const block = workspace.newBlock(`${PREFIX}${id}`);
    block.initSvg();
    block.render();
    if (index === 0) {
      block.moveBy(24, 24);
    } else if (prev?.nextConnection && block.previousConnection) {
      prev.nextConnection.connect(block.previousConnection);
    }
    prev = block;
  });
}

function stackIds(top: Blockly.Block): string[] {
  const order: string[] = [];
  let cur: Blockly.Block | null = top;
  while (cur) {
    if (cur.type.startsWith(PREFIX) && !cur.isShadow()) {
      order.push(cur.type.slice(PREFIX.length));
    }
    cur = cur.getNextBlock();
  }
  return order;
}

/** Prefer an exact solution stack; otherwise the best-scoring stack. */
function pickBestOrder(
  workspace: Blockly.WorkspaceSvg,
  mission: BuildMission,
): string[] {
  const tops = workspace
    .getTopBlocks(true)
    .filter((b) => !b.isShadow() && b.isEnabled());
  if (tops.length === 0) return [];

  const stacks = tops.map(stackIds).filter((s) => s.length > 0);
  if (stacks.length === 0) return [];

  const exact = stacks.find((s) => matchesBuildSolution(s, mission));
  if (exact) return exact;

  // Score: reward matching solution prefix, penalize extras/distractors
  const distractorIds = new Set((mission.distractors ?? []).map((d) => d.id));
  let best = stacks[0];
  let bestScore = -Infinity;
  for (const s of stacks) {
    let score = 0;
    const sol = mission.solution;
    for (let i = 0; i < Math.min(s.length, sol.length); i++) {
      if (s[i] === sol[i]) score += 10;
      else break;
    }
    for (const id of s) {
      if (distractorIds.has(id)) score -= 8;
    }
    score -= Math.abs(s.length - sol.length) * 2;
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return best;
}

export type BlocklyRunResult = {
  ok: boolean;
  order: string[];
};

type WorkspaceApi = {
  run: () => BlocklyRunResult;
  reset: () => void;
  getOrder: () => string[];
};

type Props = {
  mission: BuildMission;
  className?: string;
  onReady?: (api: WorkspaceApi) => void;
};

export function LmsBuildBlockly({ mission, className, onReady }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const palette = buildMissionPalette(mission);
    ensureStepBlocks(mission);

    const toolbox = {
      kind: "flyoutToolbox" as const,
      contents: palette.map((s) => ({
        kind: "block" as const,
        type: `${PREFIX}${s.id}`,
      })),
    };

    if (workspaceRef.current) {
      workspaceRef.current.dispose();
      workspaceRef.current = null;
    }
    host.innerHTML = "";

    const theme = Blockly.Theme.defineTheme("mentrLearnCompact", {
      name: "mentrLearnCompact",
      base: Blockly.Themes.Classic,
      componentStyles: {
        workspaceBackgroundColour: "#faf8f4",
        toolboxBackgroundColour: "#fff4e8",
        toolboxForegroundColour: "#1c2434",
        flyoutBackgroundColour: "#fffaf5",
        flyoutForegroundColour: "#1c2434",
        flyoutOpacity: 1,
        scrollbarColour: "#e8e2d8",
        insertionMarkerColour: "#ff6a1a",
        insertionMarkerOpacity: 0.45,
      },
      fontStyle: {
        family: "inherit",
        weight: "bold",
        size: 11,
      },
    });

    const workspace = Blockly.inject(host, {
      toolbox,
      trashcan: true,
      scrollbars: true,
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: {
        controls: false,
        wheel: true,
        startScale: 0.82,
        maxScale: 1.15,
        minScale: 0.65,
      },
      grid: { spacing: 18, length: 1, colour: "#efe6d8", snap: true },
      theme,
      renderer: "zelos",
      horizontalLayout: false,
    });

    workspaceRef.current = workspace;

    if (mission.starterOrder?.length) {
      loadStarter(workspace, mission.starterOrder);
    }

    const getOrder = () => pickBestOrder(workspace, mission);

    const run = (): BlocklyRunResult => {
      const order = getOrder();
      return { ok: matchesBuildSolution(order, mission), order };
    };

    const reset = () => {
      workspace.clear();
      if (mission.starterOrder?.length) {
        loadStarter(workspace, mission.starterOrder);
      }
    };

    onReadyRef.current?.({ run, reset, getOrder });

    const ro = new ResizeObserver(() => {
      Blockly.svgResize(workspace);
    });
    ro.observe(host);
    requestAnimationFrame(() => Blockly.svgResize(workspace));

    return () => {
      ro.disconnect();
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [mission]);

  return (
    <div
      ref={hostRef}
      className={cn("h-full min-h-0 w-full overflow-hidden bg-[#faf8f4]", className)}
    />
  );
}
