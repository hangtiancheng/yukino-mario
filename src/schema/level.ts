import { z } from "zod";

const horizontalDirectionSchema = z.union([z.literal(-1), z.literal(1)]);
const platformToneSchema = z.union([
  z.literal("breakable"),
  z.literal("mario"),
  z.literal("grass"),
  z.literal("ground"),
]);
const platformMotionAxisSchema = z.union([z.literal("x"), z.literal("y")]);

const vectorSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const sizeSchema = z.object({
  height: z.number().positive(),
  width: z.number().positive(),
});

const rectSchema = vectorSchema.extend(sizeSchema.shape);

const platformMotionSchema = z.object({
  axis: platformMotionAxisSchema,
  direction: horizontalDirectionSchema,
  distance: z.number().positive(),
  origin: z.number(),
  speed: z.number().positive(),
});

const platformSchema = rectSchema.extend({
  id: z.string().min(1),
  motion: platformMotionSchema.optional(),
  tone: platformToneSchema,
});

const levelCoinSchema = rectSchema.extend({
  id: z.string().min(1),
});

const baseEnemySchema = rectSchema.extend({
  direction: horizontalDirectionSchema,
  id: z.string().min(1),
  originX: z.number(),
  patrolDistance: z.number().positive(),
  speed: z.number().positive(),
});

const walkerEnemySchema = baseEnemySchema.extend({
  type: z.literal("walker"),
});

const hopperEnemySchema = baseEnemySchema.extend({
  hopHeight: z.number().positive(),
  hopPhaseMs: z.number().nonnegative(),
  originY: z.number(),
  type: z.literal("hopper"),
});

const flyerEnemySchema = baseEnemySchema.extend({
  originY: z.number(),
  type: z.literal("flyer"),
  waveHeight: z.number().positive(),
  wavePhaseMs: z.number().nonnegative(),
});

const enemySchema = z.discriminatedUnion("type", [
  walkerEnemySchema,
  hopperEnemySchema,
  flyerEnemySchema,
]);

export const levelDataSchema = z.object({
  coins: z.array(levelCoinSchema),
  enemies: z.array(enemySchema),
  height: z.number().positive(),
  id: z.string().min(1),
  name: z.string().min(1),
  platforms: z.array(platformSchema),
  spawn: vectorSchema,
  summary: z.string().min(1),
  width: z.number().positive(),
});
