const sheetUrl = "https://docs.google.com/spreadsheets/d/1RQcwdyvkes_KvgGQYvOj1Pf5LTyPjJB7SNe7TEFIVUU/edit?usp=sharing";

const workouts = [
  {
    day: "Push Day",
    focus: "Chest • Shoulders • Triceps",
    tag: "Push",
    exercises: [
      "Dumbbell Press",
      "Incline Smith Press",
      "Chest Flies",
      "Shoulder Press Smith Machine",
      "Cable Flies",
      "Triceps Pushdown",
      "Overhead Extension"
    ]
  },
  {
    day: "Pull Day",
    focus: "Back • Biceps",
    tag: "Pull",
    exercises: [
      "Lat Pulldown",
      "Wide Grip Row",
      "Single Arm Row",
      "High Row",
      "Single Arm Preacher Curl",
      "Reverse Grip Biceps Curl",
      "Spider Curl"
    ]
  },
  {
    day: "Leg Day",
    focus: "Quads • Hamstrings • Calves",
    tag: "Legs",
    exercises: [
      "Squats",
      "Romanian Deadlift",
      "Leg Extension",
      "Leg Curls",
      "Standing Calf Raise"
    ]
  },
  {
    day: "Upper",
    focus: "Full Upper Body",
    tag: "Upper",
    exercises: [
      "Incline Dumbbell Press",
      "Chest Flies",
      "Lat Pulldown",
      "Wide Grip Row",
      "Dumbbell Shoulder Press",
      "Dumbbell Lateral Raises",
      "Triceps Pushdown",
      "Cable Biceps Curl"
    ]
  },
  {
    day: "Lower",
    focus: "Lower Body • Posterior Chain",
    tag: "Lower",
    exercises: [
      "Squats",
      "Romanian Deadlift",
      "Leg Extension",
      "Leg Curls",
      "Standing Calf Raise",
      "Back Extension"
    ]
  }
];

const weeklySchedule = [
  { day: "Mon", title: "Push Day", type: "Workout" },
  { day: "Tue", title: "Pull Day", type: "Workout" },
  { day: "Wed", title: "Leg Day", type: "Workout" },
  { day: "Thu", title: "Rest / Mobility", type: "Recovery", rest: true },
  { day: "Fri", title: "Upper", type: "Workout" },
  { day: "Sat", title: "Lower", type: "Workout" },
  { day: "Sun", title: "Rest", type: "Recovery", rest: true }
];

const stateKey = "ppl-upper-lower-progress-v1";
const notesKey = "ppl-upper-lower-notes-v1";
let activeFilter = "All";

const savedProgress = JSON.parse(localStorage.getItem(stateKey) || "{}");
const savedNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");

const workoutGrid = document.getElementById("workoutGrid");
const dayFilter = document.getElementById("dayFilter");
const scheduleGrid = document.getElementById("scheduleGrid");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressCount = document.getElementById("progressCount");
const resetProgress = document.getElementById("resetProgress");
const totalExercises = document.getElementById("totalExercises");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function exerciseId(day, exercise) {
  return `${day}__${exercise}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function renderSchedule() {
  scheduleGrid.innerHTML = weeklySchedule.map(item => `
    <article class="schedule-card ${item.rest ? "rest" : ""}">
      <div>
        <span class="schedule-badge">${item.type}</span>
      </div>
      <div>
        <strong>${item.day}</strong>
        <span>${item.title}</span>
      </div>
    </article>
  `).join("");
}

function renderFilters() {
  const filters = ["All", ...workouts.map(workout => workout.tag)];
  dayFilter.innerHTML = filters.map(filter => `
    <button class="filter-btn ${filter === activeFilter ? "active" : ""}" data-filter="${filter}">${filter}</button>
  `).join("");

  dayFilter.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderWorkouts();
    });
  });
}

function renderWorkouts() {
  const visibleWorkouts = activeFilter === "All"
    ? workouts
    : workouts.filter(workout => workout.tag === activeFilter);

  workoutGrid.innerHTML = visibleWorkouts.map(workout => `
    <article class="day-card">
      <header class="day-card-header">
        <div>
          <h3>${workout.day}</h3>
          <p class="muted">${workout.focus}</p>
        </div>
        <span class="day-pill">3 sets × 6–10 reps</span>
      </header>
      <ul class="exercise-list">
        ${workout.exercises.map(exercise => {
          const id = exerciseId(workout.day, exercise);
          const checked = Boolean(savedProgress[id]);
          const note = savedNotes[id] || "";
          return `
            <li class="exercise-item ${checked ? "done" : ""}" data-id="${id}">
              <input type="checkbox" ${checked ? "checked" : ""} aria-label="Mark ${exercise} complete" />
              <div>
                <div class="exercise-name">
                  <span>${exercise}</span>
                  <span class="set-badge">3 × 6–10</span>
                </div>
                <div class="exercise-meta">Write weight, reps, or form notes for next time.</div>
                <input class="note-input" type="text" placeholder="Example: 20kg, 8/8/7 reps" value="${escapeHtml(note)}" aria-label="Notes for ${exercise}" />
              </div>
            </li>
          `;
        }).join("")}
      </ul>
    </article>
  `).join("");

  workoutGrid.querySelectorAll(".exercise-item").forEach(item => {
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
  const allIds = workouts.flatMap(workout => workout.exercises.map(exercise => exerciseId(workout.day, exercise)));
  const completed = allIds.filter(id => savedProgress[id]).length;
  const total = allIds.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  totalExercises.textContent = total;
  progressText.textContent = `${percent}%`;
  progressCount.textContent = `${completed} of ${total} completed`;
  progressBar.style.width = `${percent}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

renderSchedule();
renderFilters();
renderWorkouts();
