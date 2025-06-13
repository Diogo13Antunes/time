document.addEventListener('DOMContentLoaded', () => {
	const countrySelect = document.getElementById("country-select");
	const clock = document.getElementById("clock");
	const date = document.getElementById("date");
	let selectedTimezone = null

	function populateSelect() {
		timezones.forEach(({ country, timezone, flag }) => {
			const option = document.createElement("option");
			option.value = timezone;
			option.textContent = `${flag} ${country}`;
			countrySelect.appendChild(option);
		});
	}

	function updateClock() {
		const now = new Date();
		const options = {
			timeZone: selectedTimezone,
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "2-digit",
		};
		const formatter = new Intl.DateTimeFormat("en-US", options);
		const parts = formatter.formatToParts(now);
		const time = `${parts.find((p) => p.type === "hour").value}:${parts.find((p) => p.type === "minute").value}:${parts.find((p) => p.type === "second").value}`;
		const dayOfWeek = parts.find((p) => p.type === "weekday").value;
		const day = parts.find((p) => p.type === "day").value;
		const month = parts.find((p) => p.type === "month").value;
		const year = parts.find((p) => p.type === "year").value;

		clock.textContent = time;
		date.textContent = `${dayOfWeek} ${day} ${month} ${year}`;
	}

	function startClock() {
		function update() {
			updateClock();
		}
		update();
		const now = new Date();
		const delay = 1000 - now.getMilliseconds();
		setTimeout(() => {
			update();
			setInterval(update, 1000);
		}, delay);
	}

	populateSelect();
	countrySelect.selectedIndex = 0;
	selectedTimezone = countrySelect.value;
	startClock();

	countrySelect.addEventListener("change", (e) => {
		selectedTimezone = e.target.value;
	});

	const fullscreenBtn = document.getElementById("fullscreen-btn");
	const fullscreenIcon = document.getElementById("fullscreen-icon");

	fullscreenBtn.addEventListener("click", () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	});

	document.addEventListener("fullscreenchange", () => {
		const isFullscreen = !!document.fullscreenElement;
		fullscreenIcon.className = isFullscreen ? "bi bi-fullscreen-exit" : "bi bi-fullscreen";
	});

});