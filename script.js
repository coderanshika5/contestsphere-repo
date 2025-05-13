
function formatTimestamp(seconds) {
  const date = new Date(seconds * 1000);
  return date.toLocaleString();
}


function createContestCard(title, start, duration, timerId = "", url = "") {
  const div = document.createElement("div");
  div.className = "contest";

  div.innerHTML = `
    <h3>
      ${url ? `<a href="${url}" target="_blank">${title}</a>` : title}
    </h3>
    <p><strong>Start:</strong> ${start}</p>
    <p><strong>Duration:</strong> ${duration}</p>
    ${timerId ? `<p id="${timerId}" style="color: #0f0;">Loading timer...</p>` : ""}
    ${url ? `<a href="${url}" target="_blank" class="join-btn">Join Now</a>` : ""}
  `;

  return div;
}


function fetchCodeforcesContests() {
  const container = document.getElementById("cf-list");

  fetch("https://codeforces.com/api/contest.list")
    .then(res => res.json())
    .then(data => {
      const upcoming = data.result
        .filter(c => c.phase === "BEFORE")
        .slice(0, 5);

      upcoming.forEach(contest => {
        const link = `https://codeforces.com/contest/${contest.id}`;
        const card = createContestCard(
          contest.name,
          formatTimestamp(contest.startTimeSeconds),
          `${(contest.durationSeconds / 3600).toFixed(1)}h`,
          "",
          link
        );
        container.appendChild(card);
      });
    })
    .catch(err => {
      container.innerHTML = `<p style="color:red;">Failed to load Codeforces contests.</p>`;
      console.error(err);
    });
}


function getNextWednesday8PM() {
  const now = new Date();
  const target = new Date(now);
  target.setUTCHours(14, 30, 0, 0); 

  const day = now.getUTCDay();
  const daysUntilWed = (3 - day + 7) % 7 || 7;
  target.setUTCDate(now.getUTCDate() + daysUntilWed);

  if (target <= now) target.setUTCDate(target.getUTCDate() + 7);
  return target;
}


function getNextSunday8AM() {
  const now = new Date();
  const target = new Date(now);
  target.setUTCHours(2, 30, 0, 0); 

  const day = now.getUTCDay();
  const daysUntilSun = (7 - day) % 7 || 7;
  target.setUTCDate(now.getUTCDate() + daysUntilSun);

  if (target <= now) target.setUTCDate(target.getUTCDate() + 7);
  return target;
}


function startCountdown(elementId, targetDate) {
  const el = document.getElementById(elementId);

  function update() {
    const now = new Date();
    const diff = Math.floor((targetDate - now) / 1000);

    if (diff <= 0) {
      el.textContent = "Live or expired!";
      return;
    }

    const hrs = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;

    el.textContent = `Starts in: ${hrs}h ${mins}m ${secs}s`;
  }

  update();
  setInterval(update, 1000);
}


function setupFixedTimers() {
  const ccContainer = document.getElementById("cc-list");
  const lcContainer = document.getElementById("lc-list");

  const ccDate = getNextWednesday8PM();
  const lcDate = getNextSunday8AM();

  const ccCard = createContestCard(
    "CodeChef Starters (Every Wednesday)",
    ccDate.toLocaleString(),
    "2h",
    "cc-timer",
    "https://www.codechef.com/contests"
  );

  const lcCard = createContestCard(
    "LeetCode Weekly Contest (Every Sunday)",
    lcDate.toLocaleString(),
    "2h",
    "lc-timer",
    "https://leetcode.com/contest/"
  );

  ccContainer.appendChild(ccCard);
  lcContainer.appendChild(lcCard);

  startCountdown("cc-timer", ccDate);
  startCountdown("lc-timer", lcDate);
}


fetchCodeforcesContests();
setupFixedTimers();

