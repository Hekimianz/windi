// API Key f70b1477a53fdaa02a713d62054b16bf
(function () {
  const page = {
    uInput: "",
    init() {
      this.cacheDom();
      this.bindEvents();
    },
    cacheDom() {
      this.searchBtn = document.getElementById("searchIcon");
      this.searchInput = document.getElementById("searchInput");
    },
    bindEvents() {
      document.addEventListener("keydown", (e) =>
        e.key === "Enter" && this.searchInput.className !== "searched"
          ? this.submitSearch()
          : null
      );
      this.searchBtn.addEventListener("click", this.submitSearch.bind(this));
    },
    async getWeatherData() {
      console.log(`Looking up ${this.uInput}`);
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.uInput}&APPID=f70b1477a53fdaa02a713d62054b16bf`,
        { mode: "cors" }
      );
      const dataJSON = await data.json();
      console.log(dataJSON);
    },
    hideShowInput() {
      document.activeElement.blur();
      this.searchInput.classList.toggle("searched");
      this.searchInput.classList.toggle("notSearched");
      this.searchInput.value = "";
    },
    captureUserInput() {
      this.uInput = this.searchInput.value;
    },
    submitSearch() {
      if (this.searchInput.className !== "searched") {
        this.captureUserInput();
        this.hideShowInput();
        this.getWeatherData();
      } else {
        this.hideShowInput();
      }
    },
  };
  page.init();
})();
