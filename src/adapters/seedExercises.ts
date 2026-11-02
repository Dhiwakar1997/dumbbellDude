// trussel: T-YR2PY9CFG2@1
import type { Equipment, Exercise, MuscleGroup } from '../domain/model';

const SEED: [string, MuscleGroup, Equipment][] = [
  ['Bench Press', 'chest', 'barbell'],
  ['Incline Bench Press', 'chest', 'barbell'],
  ['Incline Dumbbell Press', 'chest', 'dumbbell'],
  ['Dumbbell Fly', 'chest', 'dumbbell'],
  ['Push-up', 'chest', 'bodyweight'],
  ['Dips', 'chest', 'bodyweight'],
  ['Cable Crossover', 'chest', 'cable'],
  ['Deadlift', 'back', 'barbell'],
  ['Pull-up', 'back', 'bodyweight'],
  ['Chin-up', 'back', 'bodyweight'],
  ['Barbell Row', 'back', 'barbell'],
  ['Dumbbell Row', 'back', 'dumbbell'],
  ['Lat Pulldown', 'back', 'cable'],
  ['Seated Cable Row', 'back', 'cable'],
  ['Face Pull', 'back', 'cable'],
  ['Back Squat', 'legs', 'barbell'],
  ['Front Squat', 'legs', 'barbell'],
  ['Romanian Deadlift', 'legs', 'barbell'],
  ['Leg Press', 'legs', 'machine'],
  ['Lunge', 'legs', 'dumbbell'],
  ['Bulgarian Split Squat', 'legs', 'dumbbell'],
  ['Leg Curl', 'legs', 'machine'],
  ['Leg Extension', 'legs', 'machine'],
  ['Calf Raise', 'legs', 'machine'],
  ['Hip Thrust', 'legs', 'barbell'],
  ['Overhead Press', 'shoulders', 'barbell'],
  ['Dumbbell Shoulder Press', 'shoulders', 'dumbbell'],
  ['Lateral Raise', 'shoulders', 'dumbbell'],
  ['Rear Delt Fly', 'shoulders', 'dumbbell'],
  ['Arnold Press', 'shoulders', 'dumbbell'],
  ['Biceps Curl', 'arms', 'dumbbell'],
  ['Hammer Curl', 'arms', 'dumbbell'],
  ['Preacher Curl', 'arms', 'barbell'],
  ['Triceps Pushdown', 'arms', 'cable'],
  ['Skull Crusher', 'arms', 'barbell'],
  ['Overhead Triceps Extension', 'arms', 'dumbbell'],
  ['Plank', 'core', 'bodyweight'],
  ['Hanging Leg Raise', 'core', 'bodyweight'],
  ['Cable Crunch', 'core', 'cable'],
  ['Ab Wheel Rollout', 'core', 'other'],
  ['Russian Twist', 'core', 'bodyweight'],
];

const kebab = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// trussel: T-QNHJG9B83R@1
export function seedExercises(): Exercise[] {
  return SEED.map(([name, muscleGroup, equipment]) => ({
    id: `seed-${kebab(name)}`,
    name,
    muscleGroup,
    equipment,
    isCustom: false,
  }));
}
