document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImg = document.querySelector(".empty-img");
  const todoContainer = document.querySelector(".todos-container");
  const progressBar = document.getElementById("progres");
  const progresNumbers = document.getElementById("numbers");

  const toggleEmptyState = () => {
    emptyImg.style.display = taskList.children.length === 0 ? "block" : "none";
    todoContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
  };

  // Confetti function
  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      
      const emojis = ["🎉", "✨", "🎊", "🥳", "💫"];
      confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = -10 + "px";
      confetti.style.opacity = Math.random() * 0.7 + 0.3;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  // Show celebration modal
  const showCelebration = () => {
    const modal = document.getElementById("celebration-modal");
    modal.classList.add("active");
    createConfetti();
  };

  // Close celebration modal
  const closeCelebration = () => {
    const modal = document.getElementById("celebration-modal");
    modal.classList.remove("active");
  };

  // Update progress bar
  const updateProgres = (checkCompletion = true) => {
    const totalTasks = taskList.children.length;
    const completedTasks =
      taskList.querySelectorAll(".checkbox:checked").length;
    const progressPercentage = totalTasks
      ? (completedTasks / totalTasks) * 100
      : 0;
    
    progressBar.style.width = `${progressPercentage}%`;
    progresNumbers.textContent = `${completedTasks} / ${totalTasks}`;
    
    // Trigger celebration ketika progress 100%
    if (totalTasks > 0 && progressPercentage === 100) {
      setTimeout(showCelebration, 300);
    }
  };

  // Simpan tasks ke localStorage
  const saveTasks = () => {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((li) => {
      tasks.push({
        text: li.querySelector("span").textContent,
        completed: li.querySelector(".checkbox").checked,
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Muat tasks dari localStorage
  const loadTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      tasks.forEach((task) => {
        addTask(task.text, task.completed);
      });
    }
  };

  // Load tasks dari localStorage
  const addTask = (text, completed = false, checkCompletion = true) => {
    const taskText = (typeof text === "string" ? text : taskInput.value).trim();
    if (!taskText) {
      return;
    }

    // Membuat elemen task baru
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" class="checkbox" ${
      completed ? "checked" : ""
    } > 
    <span>${taskText}</span>
    <div class="task-buttons"> 
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div> `;

    // Menambahkan event listeners
    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? "0.5" : "1";
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      updateProgres();
      saveTasks
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
        updateProgres(false);
        saveTasks
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgres(checkCompletion);
      saveTasks();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    toggleEmptyState();
    updateProgres();
  };

  // Load tasks from localStorage on page load
  addTaskBtn.addEventListener("click", () => {
    addTask();
    saveTasks();
  });
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
      saveTasks();
    }
  });

  // Close celebration modal button
  const closeCelebrationBtn = document.getElementById("close-celebration-btn");
  if (closeCelebrationBtn) {
    closeCelebrationBtn.addEventListener("click", () => {
      closeCelebration();
      taskInput.focus();
    });
  }

  // Close modal ketika klik di luar
  const celebrationModal = document.getElementById("celebration-modal");
  if (celebrationModal) {
    celebrationModal.addEventListener("click", (e) => {
      if (e.target === celebrationModal) {
        closeCelebration();
      }
    });
  }

  toggleEmptyState();
  updateProgres();
  loadTasks();
});
