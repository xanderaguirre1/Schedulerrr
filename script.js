const schedule = [];
const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday", "Sunday"];

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = `⚠️ ${message}`;
  popup.style.display = "block";
  setTimeout(() => popup.style.display = "none", 3000);
}

function addSubject() {
  try {
    const subject = document.getElementById("subject").value.trim();
    const time = document.getElementById("time").value;
    const day = document.getElementById("day").value;

    if (!subject || !time || !day || time === "Time" || day === "Day") {
      throw "Please fill in all fields";
    }

    schedule.push({ subject, time, day });
    updateScheduleList();

    document.getElementById("subject").value = "";
    document.getElementById("time").selectedIndex = 0;
    document.getElementById("day").selectedIndex = 0;
  } catch (error) {
    showPopup(error);
  }
}

function convertTimeToMinutes(t) {
  let [time, modifier] = t.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function updateScheduleList() {
  schedule.sort((a, b) => {
    if (dayOrder.indexOf(a.day) !== dayOrder.indexOf(b.day)) {
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    }
    return convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time);
  });

  const list = document.getElementById("scheduleList");
  list.innerHTML = schedule.map((item, index) =>
    `<li>
      <span class="day">${item.day}</span> - 
      <span class="time">${item.time}</span> - 
      <strong>${item.subject}</strong>
      <button class="delete-btn" onclick="deleteSubject(${index})">❌</button>
    </li>`
  ).join("");
}

function deleteSubject(index) {
  schedule.splice(index, 1);
  updateScheduleList();
  showPopup("Subject deleted");
}


function downloadAsPNG() {
  const target = document.getElementById("scheduleDisplay");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach(btn => btn.style.display = "none");

  const scale = 3;

  html2canvas(target, {
    backgroundColor: document.getElementById("bgColor").value,
    scale: scale,
    useCORS: true,
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "schedule.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();


    deleteButtons.forEach(btn => btn.style.display = "inline");
  }).catch(err => {
    showPopup("Image generation failed");
    deleteButtons.forEach(btn => btn.style.display = "inline");
  });
}


function resetSchedule() {
  schedule.length = 0;
  updateScheduleList();
  showPopup("Schedule reset!");
}

document.getElementById("bgColor").addEventListener("input", function() {
  document.getElementById("scheduleDisplay").style.backgroundColor = this.value;
});
