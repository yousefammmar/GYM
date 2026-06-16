const sheetUrl = "https://docs.google.com/spreadsheets/d/1RQcwdyvkes_KvgGQYvOj1Pf5LTyPjJB7SNe7TEFIVUU/edit?usp=sharing";

const workouts = [
  {
    day: "Push Day",
    slug: "push",
    focus: "Chest • Shoulders • Triceps",
    prescription: "3 × 6–10 reps",
    exercises: [
      { name: "Dumbbell Press", sets: "3", reps: "6–10", type: "Chest press" },
      { name: "Incline Smith Press", sets: "3", reps: "6–10", type: "Upper chest" },
      { name: "Chest Flies", sets: "3", reps: "6–10", type: "Chest isolation" },
      { name: "Smith Machine Shoulder Press", sets: "3", reps: "6–10", type: "Shoulders" },
      { name: "Cable Flies", sets: "3", reps: "6–10", type: "Chest isolation" },
      { name: "Triceps Pushdown", sets: "3", reps: "6–10", type: "Triceps" },
      { name: "Overhead Extension", sets: "3", reps: "6–10", type: "Triceps long head" }
    ]
  },
  {
    day: "Pull Day",
    slug: "pull",
    focus: "Back • Biceps",
    prescription: "3 × 6–10 reps",
    exercises: [
      { name: "Lat Pulldown", sets: "3", reps: "6–10", type: "Vertical pull" },
      { name: "Wide Grip Row", sets: "3", reps: "6–10", type: "Row" },
      { name: "Single Arm Row", sets: "3", reps: "6–10", type: "Unilateral row" },
      { name: "High Row", sets: "3", reps: "6–10", type: "Upper back" },
      { name: "Single Arm Preacher Curl", sets: "3", reps: "6–10", type: "Biceps" },
      { name: "Reverse Grip Biceps Curl", sets: "3", reps: "6–10", type: "Biceps / forearms" },
      { name: "Spider Curl", sets: "3", reps: "6–10", type: "Biceps" }
    ]
  },
  {
    day: "Leg Day + Core",
    slug: "legs",
    focus: "Quads • Hamstrings • Calves • Core",
    prescription: "Mixed",
    exercises: [
      { name: "Squats", sets: "3", reps: "6–10", type: "Compound" },
      { name: "Romanian Deadlift", sets: "3", reps: "6–10", type: "Hamstrings" },
      { name: "Leg Extension", sets: "3", reps: "6–10", type: "Quads" },
      { name: "Leg Curls", sets: "3", reps: "6–10", type: "Hamstrings" },
      { name: "Standing Calf Raise", sets: "3", reps: "6–10", type: "Calves" },
      { name: "High-Low Plank", sets: "2", reps: "to form-failure", type: "Core" },
      { name: "Hanging Leg Raises", sets: "2", reps: "to form-failure", type: "Core" }
    ]
  },
  {
    day: "Upper",
    slug: "upper",
    focus: "Chest • Back • Shoulders • Arms",
    prescription: "Mixed",
    exercises: [
      { name: "Incline Dumbbell Press", sets: "3", reps: "6–10", type: "Chest press" },
      { name: "Chest Flies", sets: "3", reps: "6–10", type: "Chest isolation" },
      { name: "Lat Pulldown", sets: "3", reps: "6–10", type: "Back" },
      { name: "Wide Grip Row", sets: "3", reps: "6–10", type: "Back" },
      { name: "Dumbbell Shoulder Press", sets: "3", reps: "6–10", type: "Shoulders" },
      { name: "Dumbbell Shoulder Fly", sets: "3", reps: "6–10", type: "Side delts" },
      { name: "Triceps Pushdown", sets: "3", reps: "6–10", type: "Triceps" },
      { name: "Cable Biceps Curl", sets: "3", reps: "6–10", type: "Biceps" },
      { name: "Kneeling Twists", sets: "2", reps: "15", type: "Core" }
    ]
  },
  {
    day: "Lower",
    slug: "lower",
    focus: "Lower Body • Posterior Chain",
    prescription: "Mixed",
    exercises: [
      { name: "Squats", sets: "3", reps: "6–10", type: "Compound" },
      { name: "Romanian Deadlift", sets: "3", reps: "6–10", type: "Hamstrings" },
      { name: "Leg Extension", sets: "3", reps: "6–10", type: "Quads" },
      { name: "Leg Curls", sets: "3", reps: "6–10", type: "Hamstrings" },
      { name: "Standing Calf Raise", sets: "3", reps: "6–10", type: "Calves" },
      { name: "Back Extension", sets: "3", reps: "6–10", type: "Lower back" },
      { name: "Back Extension", sets: "2", reps: "to form-failure", type: "Lower back finisher" }
    ]
  }
];

const weeklySchedule = [
  { day: "Mon", title: "Push Day", tag: "Push", slug: "push" },
  { day: "Tue", title: "Pull Day", tag: "Pull", slug: "pull" },
  { day: "Wed", title: "Leg Day + Core", tag: "Legs", slug: "legs" },
  { day: "Thu", title: "Rest / Mobility", tag: "Recovery", slug: "rest", rest: true },
  { day: "Fri", title: "Upper", tag: "Upper", slug: "upper" },
  { day: "Sat", title: "Lower", tag: "Lower", slug: "lower" },
  { day: "Sun", title: "Rest / Mobility", tag: "Recovery", slug: "rest", rest: true }
];

const stateKey = "ppl-upper-lower-restructured-progress-v1";
const notesKey = "ppl-upper-lower-restructured-notes-v1";

let activeFilter = "All";
const savedProgress = JSON.parse(localStorage.getItem(stateKey) || "{}");
const savedNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");

const weekGrid = document.getElementById("weekGrid");
const filters = document.getElementById("filters");
const workoutLayout = document.getElementById("workoutLayout");
const totalExercises = document.getElementById("totalExercises");
const trainingDays = document.getElementById("trainingDays");
const completedExercises = document.getElementById("completedExercises");
const progressText = document.getElementById("progressText");
const progressCount = document.getElementById("progressCount");
const progressBar = document.getElementById("progressBar");
const resetProgress = document.getElementById("resetProgress");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function exerciseId(day, exercise, index) {
  return `${day}-${exercise.name}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderWeek() {
  weekGrid.innerHTML = weeklySchedule.map(item => `
    <article class="week-card ${item.slug} ${item.rest ? "rest" : ""}">
      <span class="week-badge">${item.tag}</span>
      <div>
        <strong>${item.day}</strong>
        <span>${item.title}</span>
      </div>
    </article>
  `).join("");
}

function renderFilters() {
  const filterList = ["All", ...workouts.map(workout => workout.day)];
  filters.innerHTML = filterList.map(filter => `
    <button class="filter-btn ${filter === activeFilter ? "active" : ""}" data-filter="${filter}">
      ${filter}
    </button>
  `).join("");

  filters.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderWorkouts();
    });
  });
}

function renderWorkouts() {
  const visible = activeFilter === "All"
    ? workouts
    : workouts.filter(workout => workout.day === activeFilter);

  workoutLayout.innerHTML = visible.map((workout, workoutIndex) => `
    <article class="day-card ${workout.slug}">
      <header class="day-header">
        <span class="day-number">${workoutIndex + 1}</span>
        <div>
          <h3>${workout.day}</h3>
          <p class="muted">${workout.focus}</p>
        </div>
        <span class="day-pill">${workout.prescription}</span>
      </header>

      <ul class="exercise-grid">
        ${workout.exercises.map((exercise, index) => {
          const id = exerciseId(workout.day, exercise, index);
          const checked = Boolean(savedProgress[id]);
          const note = savedNotes[id] || "";
          return `
            <li class="exercise-item ${checked ? "done" : ""}" data-id="${id}">
              <input type="checkbox" ${checked ? "checked" : ""} aria-label="Mark ${exercise.name} complete" />
              <div>
                <div class="exercise-title">
                  <span>${exercise.name}</span>
                  <span class="set-badge">${exercise.sets} × ${exercise.reps}</span>
                </div>
                <div class="exercise-meta">${exercise.type}</div>
                <input class="note-input" value="${escapeHtml(note)}" placeholder="Weight, reps, or form notes" aria-label="Notes for ${exercise.name}" />
              </div>
            </li>
          `;
        }).join("")}
      </ul>
    </article>
  `).join("");

  workoutLayout.querySelectorAll(".exercise-item").forEach(item => {
    const id = item.dataset.id;
    const checkbox = item.querySelector("input[type='checkbox']");
    const noteInput = item.querySelector(".note-input");

    checkbox.addEventListener("change", () => {
      savedProgress[id] = checkbox.checked;
      item.classList.toggle("done", checkbox.checked);
      localStorage.setItem(stateKey, JSON.stringify(savedProgress));
      updateProgress();
    });

    noteInput.addEventListener("input", () => {
      savedNotes[id] = noteInput.value;
      localStorage.setItem(notesKey, JSON.stringify(savedNotes));
    });
  });

  updateProgress();
}

function updateProgress() {
  const ids = workouts.flatMap(workout =>
    workout.exercises.map((exercise, index) => exerciseId(workout.day, exercise, index))
  );
  const total = ids.length;
  const completed = ids.filter(id => savedProgress[id]).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  totalExercises.textContent = total;
  trainingDays.textContent = weeklySchedule.filter(item => !item.rest).length;
  completedExercises.textContent = completed;
  progressText.textContent = `${percent}%`;
  progressCount.textContent = `${completed} of ${total} completed`;
  progressBar.style.width = `${percent}%`;
}

resetProgress.addEventListener("click", () => {
  Object.keys(savedProgress).forEach(key => delete savedProgress[key]);
  localStorage.setItem(stateKey, JSON.stringify(savedProgress));
  renderWorkouts();
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

renderWeek();
renderFilters();
renderWorkouts();
