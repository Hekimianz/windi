// API Key f70b1477a53fdaa02a713d62054b16bf
(function () {
  const page = {
    uInput: "",
    name: "",
    time: "",
    img: "",
    tempK: "",
    tempC: "",
    tempF: "",
    weath: "",
    regionNames: new Intl.DisplayNames(["en"], { type: "region" }),
    init() {
      this.cacheDom();
      this.bindEvents();
    },
    cacheDom() {
      this.searchBtn = document.getElementById("searchIcon");
      this.searchInput = document.getElementById("searchInput");
      this.cityName = document.getElementById("cityName");
      this.cityTime = document.getElementById("cityTime");
      this.cityImg = document.getElementById("cityImg");
      this.cityTemp = document.getElementById("cityTemp");
      this.cityWeath = document.getElementById("cityWeath");
    },
    bindEvents() {
      document.addEventListener("keydown", (e) =>
        e.key === "Enter" && this.searchInput.className !== "searched"
          ? this.searchAndRender()
          : null
      );
      this.searchBtn.addEventListener("click", this.searchAndRender.bind(this));
    },
    async getWeatherData() {
      try {
        const data = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.uInput}&APPID=f70b1477a53fdaa02a713d62054b16bf`,
          { mode: "cors" }
        );
        const dataJSON = await data.json();
        console.log(dataJSON);
        this.name = `${dataJSON.name}, ${this.regionNames.of(
          dataJSON.sys.country
        )}`;
        const d = new Date();
        const localTime = d.getTime();
        const localOffset = d.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const tz = utc + 1000 * dataJSON.timezone;
        const nd = new Date(tz);
        console.log(this.name);
        this.time = nd.toLocaleString(undefined, {
          day: "2-digit",
          weekday: "short",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
        console.log(this.time);
        this.tempK = Math.floor(dataJSON.main.temp);
        this.tempC = Math.floor(this.tempK - 273.15);
        this.tempF = Math.floor(this.tempC * 1.8 + 32);
        console.log(this.tempK, this.tempC, this.tempF);
        this.weath = dataJSON.weather[0].main;
        console.log(this.weath);
      } catch (err) {
        alert(err);
      }
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
    async searchAndRender() {
      if (
        this.searchInput.className !== "searched" &&
        this.searchInput.value !== ""
      ) {
        this.captureUserInput();
        this.hideShowInput();
        await this.getWeatherData();
        this.render();
      } else this.hideShowInput();
    },
    render() {
      this.cityName.innerText = this.name;
      this.cityTime.innerText = this.time;
      this.cityTemp.innerText = this.tempC;
      this.cityWeath.innerText = this.weath;
    },
  };
  page.init();
})();
