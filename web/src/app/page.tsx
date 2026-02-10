"use client";

import { useMemo, useState } from "react";

type IntensityLevel = "low" | "medium" | "high";

type Workout = {
  id: string;
  title: string;
  type: string;
  duration: number;
  intensity: IntensityLevel;
  focus: string;
  equipment?: string;
  notes?: string;
  completed: boolean;
};

type DayPlan = {
  id: string;
  dayName: string;
  dateLabel: string;
  focus: string;
  energyTarget: IntensityLevel;
  workouts: Workout[];
  recoveryTip: string;
};

const INITIAL_WEEK: DayPlan[] = [
  {
    id: "mon",
    dayName: "Mon",
    dateLabel: "Jan 8",
    focus: "Lower Body Strength",
    energyTarget: "high",
    recoveryTip: "Roll quads and hamstrings, hydrate every hour.",
    workouts: [
      {
        id: "mon-1",
        title: "Barbell Back Squat",
        type: "Strength",
        duration: 35,
        intensity: "high",
        focus: "Quads & Glutes",
        equipment: "Barbell + Rack",
        completed: false,
        notes: "5x5 @ 75% 1RM",
      },
      {
        id: "mon-2",
        title: "Romanian Deadlift",
        type: "Strength",
        duration: 20,
        intensity: "medium",
        focus: "Hamstrings",
        equipment: "Barbell",
        completed: false,
      },
      {
        id: "mon-3",
        title: "Assault Bike Intervals",
        type: "Conditioning",
        duration: 15,
        intensity: "high",
        focus: "VO2 Max",
        completed: false,
        notes: "10 rounds 20s on / 40s off",
      },
    ],
  },
  {
    id: "tue",
    dayName: "Tue",
    dateLabel: "Jan 9",
    focus: "Mobility + Core",
    energyTarget: "low",
    recoveryTip: "10 minute contrast shower before bed.",
    workouts: [
      {
        id: "tue-1",
        title: "Yoga Flow",
        type: "Mobility",
        duration: 30,
        intensity: "low",
        focus: "Full Body",
        completed: false,
      },
      {
        id: "tue-2",
        title: "Core Ladder",
        type: "Core",
        duration: 18,
        intensity: "medium",
        focus: "Anterior Core",
        completed: false,
        notes: "4 rounds hollow body + V-ups",
      },
    ],
  },
  {
    id: "wed",
    dayName: "Wed",
    dateLabel: "Jan 10",
    focus: "Upper Push + Conditioning",
    energyTarget: "high",
    recoveryTip: "Add 20g protein shake post session.",
    workouts: [
      {
        id: "wed-1",
        title: "Bench Press Wave",
        type: "Strength",
        duration: 32,
        intensity: "high",
        focus: "Chest & Triceps",
        equipment: "Barbell",
        completed: false,
        notes: "4x6 @ RPE 8",
      },
      {
        id: "wed-2",
        title: "Landmine Press",
        type: "Strength",
        duration: 15,
        intensity: "medium",
        focus: "Shoulders",
        completed: false,
      },
      {
        id: "wed-3",
        title: "Echo Bike Finisher",
        type: "Conditioning",
        duration: 12,
        intensity: "high",
        focus: "Anaerobic Capacity",
        completed: false,
      },
    ],
  },
  {
    id: "thu",
    dayName: "Thu",
    dateLabel: "Jan 11",
    focus: "Athletic Conditioning",
    energyTarget: "medium",
    recoveryTip: "Add light jog cool down and long calf stretch.",
    workouts: [
      {
        id: "thu-1",
        title: "Sprint Drills",
        type: "Speed",
        duration: 25,
        intensity: "high",
        focus: "Acceleration",
        completed: false,
        notes: "6 x 40m sprints",
      },
      {
        id: "thu-2",
        title: "Plyometric Circuit",
        type: "Power",
        duration: 20,
        intensity: "medium",
        focus: "Explosiveness",
        completed: false,
      },
    ],
  },
  {
    id: "fri",
    dayName: "Fri",
    dateLabel: "Jan 12",
    focus: "Upper Pull + Grip",
    energyTarget: "high",
    recoveryTip: "Contrast bath + grip recovery ball.",
    workouts: [
      {
        id: "fri-1",
        title: "Weighted Pull-Ups",
        type: "Strength",
        duration: 25,
        intensity: "high",
        focus: "Lats",
        equipment: "Dip belt",
        completed: false,
      },
      {
        id: "fri-2",
        title: "Seated Row Dropset",
        type: "Strength",
        duration: 18,
        intensity: "medium",
        focus: "Upper Back",
        completed: false,
      },
      {
        id: "fri-3",
        title: "Farmer Carry Ladder",
        type: "Grip",
        duration: 15,
        intensity: "medium",
        focus: "Forearms",
        equipment: "Trap bar",
        completed: false,
      },
    ],
  },
  {
    id: "sat",
    dayName: "Sat",
    dateLabel: "Jan 13",
    focus: "Endurance + Mobility",
    energyTarget: "medium",
    recoveryTip: "Refuel with 60g carbs within 30 minutes.",
    workouts: [
      {
        id: "sat-1",
        title: "Zone 2 Run",
        type: "Endurance",
        duration: 45,
        intensity: "medium",
        focus: "Aerobic Base",
        completed: false,
      },
      {
        id: "sat-2",
        title: "Hip Mobility Flow",
        type: "Mobility",
        duration: 20,
        intensity: "low",
        focus: "Hips",
        completed: false,
      },
    ],
  },
  {
    id: "sun",
    dayName: "Sun",
    dateLabel: "Jan 14",
    focus: "Active Recovery",
    energyTarget: "low",
    recoveryTip: "20 minute walk + foam rolling.",
    workouts: [
      {
        id: "sun-1",
        title: "Guided Mobility",
        type: "Recovery",
        duration: 25,
        intensity: "low",
        focus: "Full Body",
        completed: false,
      },
      {
        id: "sun-2",
        title: "Breathing Drills",
        type: "Breathwork",
        duration: 15,
        intensity: "low",
        focus: "Parasympathetic",
        completed: false,
      },
    ],
  },
];

const INTENSITY_STYLES: Record<IntensityLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
};

const INTENSITY_LABEL: Record<IntensityLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function Home() {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(INITIAL_WEEK);
  const [selectedDayId, setSelectedDayId] = useState<string>(weekPlan[0].id);

  const [newWorkout, setNewWorkout] = useState({
    title: "",
    type: "Strength",
    duration: 20,
    intensity: "medium" as IntensityLevel,
    focus: "",
    equipment: "",
    notes: "",
  });

  const selectedDay = weekPlan.find((day) => day.id === selectedDayId) ?? weekPlan[0];

  const weeklyStats = useMemo(() => {
    const totalMinutes = weekPlan.reduce(
      (sum, day) => sum + day.workouts.reduce((acc, workout) => acc + workout.duration, 0),
      0,
    );
    const completedCount = weekPlan.reduce(
      (sum, day) => sum + day.workouts.filter((workout) => workout.completed).length,
      0,
    );
    const totalSessions = weekPlan.reduce((sum, day) => sum + day.workouts.length, 0);
    const completionRate = totalSessions === 0 ? 0 : Math.round((completedCount / totalSessions) * 100);

    const intensityBuckets = weekPlan.reduce(
      (acc, day) => {
        day.workouts.forEach((workout) => {
          acc[workout.intensity] += 1;
        });
        return acc;
      },
      { low: 0, medium: 0, high: 0 } as Record<IntensityLevel, number>,
    );

    return {
      totalMinutes,
      completionRate,
      intensityBuckets,
      totalSessions,
    };
  }, [weekPlan]);

  const toggleWorkout = (dayId: string, workoutId: string) => {
    setWeekPlan((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          workouts: day.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  completed: !workout.completed,
                }
              : workout,
          ),
        };
      }),
    );
  };

  const handleAddWorkout = () => {
    if (!newWorkout.title.trim()) return;
    setWeekPlan((prev) =>
      prev.map((day) => {
        if (day.id !== selectedDay.id) return day;
        return {
          ...day,
          workouts: [
            ...day.workouts,
            {
              id: `${day.id}-${crypto.randomUUID()}`,
              title: newWorkout.title.trim(),
              type: newWorkout.type,
              duration: Number(newWorkout.duration),
              intensity: newWorkout.intensity,
              focus: newWorkout.focus.trim() || "General",
              equipment: newWorkout.equipment.trim() || undefined,
              notes: newWorkout.notes.trim() || undefined,
              completed: false,
            },
          ],
        };
      }),
    );

    setNewWorkout({
      title: "",
      type: "Strength",
      duration: 20,
      intensity: "medium",
      focus: "",
      equipment: "",
      notes: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pb-16 text-zinc-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-24 pt-10 sm:px-6">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm uppercase tracking-[0.3em] text-zinc-500">Weekly Flow</span>
            <h1 className="text-3xl font-semibold sm:text-4xl">Mobile Performance Planner</h1>
            <p className="text-sm text-zinc-400">
              Dial in each training day, balance intensity, and stay accountable on the go.
            </p>
          </div>
          <section className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-400">Week of Jan 8 — Jan 14</p>
                <p className="text-lg font-semibold">Elite Conditioning + Strength Split</p>
              </div>
              <div className="hidden flex-col items-end text-right text-xs text-zinc-400 sm:flex">
                <span>{weeklyStats.totalSessions} total sessions</span>
                <span>{weeklyStats.totalMinutes} planned minutes</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400 sm:grid-cols-6">
              {(Object.keys(weeklyStats.intensityBuckets) as IntensityLevel[]).map((level) => (
                <div
                  key={level}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${INTENSITY_STYLES[level]}`}
                >
                  <span className="font-medium text-inherit">{INTENSITY_LABEL[level]}</span>
                  <span>{weeklyStats.intensityBuckets[level]}</span>
                </div>
              ))}
              <div className="col-span-3 flex items-center justify-between gap-2 rounded-xl border border-zinc-700/60 bg-zinc-900/60 px-3 py-2 sm:col-span-3">
                <span className="font-medium text-zinc-100">Completion target</span>
                <span className="font-semibold text-emerald-400">{weeklyStats.completionRate}%</span>
              </div>
            </div>
          </section>
        </header>

        <section className="flex snap-x gap-3 overflow-x-auto pb-2 pt-1">
          {weekPlan.map((day) => {
            const minutes = day.workouts.reduce((sum, workout) => sum + workout.duration, 0);
            const completed = day.workouts.filter((workout) => workout.completed).length;
            const total = day.workouts.length;

            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className={`group min-w-[120px] flex-1 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 sm:min-w-[140px] ${
                  selectedDayId === day.id
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:border-emerald-400/60 hover:bg-emerald-500/10"
                }`}
              >
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 group-hover:text-emerald-300">
                  {day.dayName}
                </span>
                <p className="text-sm font-semibold text-zinc-100">{day.dateLabel}</p>
                <p className="mt-2 line-clamp-2 text-xs text-zinc-400">{day.focus}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{minutes} mins</span>
                  <span>
                    {completed}/{total} done
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-zinc-900/70 p-5 shadow-2xl shadow-emerald-500/10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-50">{selectedDay.dayName} Plan</h2>
                <p className="text-sm text-zinc-400">{selectedDay.focus}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${INTENSITY_STYLES[selectedDay.energyTarget]}`}>
                Target {INTENSITY_LABEL[selectedDay.energyTarget]} Output
              </span>
            </div>
            <p className="text-xs text-zinc-400">Recovery: {selectedDay.recoveryTip}</p>
          </div>

          <div className="flex flex-col gap-3">
            {selectedDay.workouts.map((workout) => (
              <article
                key={workout.id}
                className={`flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-4 transition ${
                  workout.completed ? "ring-2 ring-emerald-400/60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-100">{workout.title}</h3>
                    <p className="text-xs text-zinc-400">{workout.type} • {workout.focus}</p>
                  </div>
                  <button
                    onClick={() => toggleWorkout(selectedDay.id, workout.id)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                      workout.completed
                        ? "border-emerald-400/70 bg-emerald-500/20 text-emerald-200"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:border-emerald-400 hover:text-emerald-200"
                    }`}
                  >
                    {workout.completed ? "Completed" : "Mark complete"}
                  </button>
                </div>
                <div className="flex flex-col gap-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-zinc-300">
                      {INTENSITY_LABEL[workout.intensity]} intensity
                    </span>
                    <span>{workout.duration} mins</span>
                    {workout.equipment && <span>Equipment: {workout.equipment}</span>}
                  </div>
                  {workout.notes && <p className="text-zinc-400">Note: {workout.notes}</p>}
                </div>
              </article>
            ))}
            {selectedDay.workouts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-sm text-zinc-400">
                No workouts yet. Build out the day below.
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-emerald-100">Add custom session</h2>
              <p className="text-xs text-emerald-200/80">Append a targeted workout directly into {selectedDay.dayName}.</p>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-100">
              {selectedDay.workouts.length + 1} of 6 suggested
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-emerald-100/80">
              Session title
              <input
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-400/80"
                value={newWorkout.title}
                onChange={(event) => setNewWorkout((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="e.g. Tempo Deadlift"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-emerald-100/80">
              Training type
              <select
                className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-400/80"
                value={newWorkout.type}
                onChange={(event) => setNewWorkout((prev) => ({ ...prev, type: event.target.value }))}
              >
                <option value="Strength">Strength</option>
                <option value="Conditioning">Conditioning</option>
                <option value="Mobility">Mobility</option>
                <option value="Endurance">Endurance</option>
                <option value="Speed">Speed</option>
                <option value="Recovery">Recovery</option>
                <option value="Core">Core</option>
                <option value="Grip">Grip</option>
                <option value="Power">Power</option>
                <option value="Breathwork">Breathwork</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-emerald-100/80">
              Duration (mins)
              <input
                type="number"
                min={5}
                max={120}
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-400/80"
                value={newWorkout.duration}
                onChange={(event) =>
                  setNewWorkout((prev) => ({ ...prev, duration: Number(event.target.value) || 0 }))
                }
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-emerald-100/80">
              Focus area
              <input
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-400/80"
                value={newWorkout.focus}
                onChange={(event) => setNewWorkout((prev) => ({ ...prev, focus: event.target.value }))}
                placeholder="e.g. Posterior Chain"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-emerald-100/80">
              Intensity
              <div className="flex items-center gap-2">
                {(Object.keys(INTENSITY_LABEL) as IntensityLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setNewWorkout((prev) => ({ ...prev, intensity: level }))}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                      newWorkout.intensity === level
                        ? `${INTENSITY_STYLES[level]} border-emerald-400/80`
                        : "border-white/10 bg-zinc-950/60 text-emerald-100/70 hover:border-emerald-400/60"
                    }`}
                  >
                    {INTENSITY_LABEL[level]}
                  </button>
                ))}
              </div>
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-emerald-100/80">
              Equipment
              <input
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-400/80"
                value={newWorkout.equipment}
                onChange={(event) => setNewWorkout((prev) => ({ ...prev, equipment: event.target.value }))}
                placeholder="Optional"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-1 text-xs uppercase tracking-wide text-emerald-100/80">
              Notes
              <textarea
                className="min-h-[80px] w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-400/80"
                value={newWorkout.notes}
                onChange={(event) => setNewWorkout((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Add loading schemes, intervals, or cues"
              />
            </label>
          </div>

          <button
            onClick={handleAddWorkout}
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/80 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200"
          >
            Add to {selectedDay.dayName}
          </button>
        </section>
      </main>
    </div>
  );
}
