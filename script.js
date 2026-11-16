document.addEventListener('DOMContentLoaded', () => {
	const countrySelect = document.getElementById("country-select");
	const clock = document.getElementById("clock");
	const date = document.getElementById("date");
	const languageSelect = document.getElementById("language-select");
	const formatToggle = document.getElementById("format-toggle");
	const fullscreenBtn = document.getElementById("fullscreen-btn");
	const fullscreenIcon = document.getElementById("fullscreen-icon");
	let selectedTimezone = null;
	let selectedLanguage = "en-US";
	let is12hMode = false;

	function loadStoredValue(key, fallback) {
		try {
			const value = localStorage.getItem(key);
			return value === null ? fallback : value;
		} catch (e) {
			return fallback;
		}
	}

	function saveValue(key, value) {
		try {
			localStorage.setItem(key, value);
		} catch (e) {
			// storage unavailable (private mode, etc.) — fail silently
		}
	}

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
			hour12: is12hMode,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "2-digit",
		};
		const formatter = new Intl.DateTimeFormat(selectedLanguage, options);
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

	function handleTimezoneChange(timezone) {
		selectedTimezone = timezone;
		saveValue("selectedTimezone", timezone);
	}

	function handleLanguageChange(language) {
		selectedLanguage = language;
		saveValue("selectedLanguage", language);
	}

	function handleFormatToggle() {
		is12hMode = !is12hMode;
		formatToggle.textContent = is12hMode ? "12h" : "24h";
		updateClock();
		saveValue("use12h", is12hMode);
	}

	// Load stored preferences and initialize UI
	selectedTimezone = loadStoredValue("selectedTimezone", timezones[0].timezone);
	selectedLanguage = loadStoredValue("selectedLanguage", "en-US");
	is12hMode = loadStoredValue("use12h", "false") === "true";

	populateSelect();
	countrySelect.value = selectedTimezone;
	languageSelect.value = selectedLanguage;
	formatToggle.textContent = is12hMode ? "12h" : "24h";

	startClock();

	countrySelect.addEventListener("change", (e) => {
		handleTimezoneChange(e.target.value);
	});

	languageSelect.addEventListener("change", (e) => {
		handleLanguageChange(e.target.value);
	});

	formatToggle.addEventListener("click", () => {
		handleFormatToggle();
	});

	fullscreenBtn.addEventListener("click", () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {
				alert("Tela cheia não está disponível neste navegador.");
			});
		} else {
			document.exitFullscreen().catch(() => {
				alert("Não foi possível sair da tela cheia.");
			});
		}
	});

	document.addEventListener("fullscreenchange", () => {
		const isFullscreen = !!document.fullscreenElement;
		fullscreenIcon.className = isFullscreen ? "bi bi-fullscreen-exit" : "bi bi-fullscreen";
	});
});