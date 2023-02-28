// eslint-disable-next-line func-names
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
    uLong: "",
    uLat: "",
    regionNames: new Intl.DisplayNames(["en"], { type: "region" }),
    error: "",
    async init() {
      this.cacheDom();
      this.bindEvents();
      await this.getLocation();
      await this.getWeatherData();
      this.render();
    },
    cacheDom() {
      this.searchBtn = document.getElementById("searchIcon");
      this.searchInput = document.getElementById("searchInput");
      this.cityName = document.getElementById("cityName");
      this.cityTime = document.getElementById("cityTime");
      this.cityImg = document.getElementById("cityImg");
      this.cityTemp = document.getElementById("cityTemp");
      this.cityWeath = document.getElementById("cityWeath");
      this.degree = document.getElementById("degree");
      this.degreeBtn = document.getElementById("degreeBtn");
      this.errorDiv = document.getElementById("errorDiv");
    },
    bindEvents() {
      document.addEventListener("keydown", (e) =>
        e.key === "Enter" && this.searchInput.className !== "searched"
          ? this.searchAndRender()
          : null
      );
      this.searchBtn.addEventListener("click", this.searchAndRender.bind(this));
      this.degreeBtn.addEventListener("click", this.changeDegree.bind(this));
    },
    async getWeatherData() {
      try {
        if (this.uInput === "") {
          const response1 = await fetch(
            `http://api.openweathermap.org/geo/1.0/reverse?lat=${this.uLat}&lon=${this.uLong}&appid=f70b1477a53fdaa02a713d62054b16bf`,
            { mode: "cors" }
          );
          const response2 = await response1.json();
          this.uInput = response2[0].state;
        }
        const data = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.uInput}&APPID=f70b1477a53fdaa02a713d62054b16bf`,
          { mode: "cors" }
        );
        const dataJSON = await data.json();
        if (dataJSON.cod === "404") {
          this.showError();
          this.error = "404";
          setTimeout(this.hideError, 3000);
        } else {
          this.error = "";
          this.name = `${dataJSON.name}, ${this.regionNames.of(
            dataJSON.sys.country
          )}`;
          const d = new Date();
          const localTime = d.getTime();
          const localOffset = d.getTimezoneOffset() * 60000;
          const utc = localTime + localOffset;
          const tz = utc + 1000 * dataJSON.timezone;
          const nd = new Date(tz);
          this.time = nd.toLocaleString(undefined, {
            day: "2-digit",
            weekday: "short",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });
          this.tempK = Math.floor(dataJSON.main.temp);
          this.tempC = Math.floor(this.tempK - 273.15);
          this.tempF = Math.floor(this.tempC * 1.8 + 32);
          this.weath = dataJSON.weather[0].main;
        }
      } catch (err) {
        console.log(err);
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
    changeDegree() {
      if (this.degree.className === "C") {
        this.degree.classList.toggle("C");
        this.degree.classList.toggle("F");
        this.cityTemp.innerText = this.tempF;
        this.degree.innerText = "°F";
        this.degreeBtn.innerText = "°C";
      } else if (this.degree.className === "F") {
        this.degree.classList.toggle("F");
        this.degree.classList.toggle("C");
        this.cityTemp.innerText = this.tempC;
        this.degree.innerText = "°C";
        this.degreeBtn.innerText = "°F";
      }
    },
    getLocationPromise() {
      return new Promise((resolve, reject) => {
        // Promisifying the geolocation API
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      });
    },
    async getLocation() {
      const data = await this.getLocationPromise();
      this.uLat = data.coords.latitude;
      this.uLong = data.coords.longitude;
    },
    showError() {
      this.errorDiv.style.transform = "translate(10px)";
    },
    hideError() {
      this.errorDiv.style.transform = "translate(-233px)";
    },
    async searchAndRender() {
      if (
        this.searchInput.className !== "searched" &&
        this.searchInput.value !== ""
      ) {
        this.captureUserInput();
        this.hideShowInput();
        await this.getWeatherData();
        if (this.error === "") {
          this.render();
        }
      } else this.hideShowInput();
    },
    render() {
      this.cityName.innerText = this.name;
      this.cityTime.innerText = this.time;
      this.cityTemp.innerText = this.tempC;
      this.cityWeath.innerText = this.weath;
      switch (this.weath) {
        case "Clouds":
          this.cityImg.src = "assets/weathIcons/cloud.svg";
          break;
        case "Clear":
          this.cityImg.src = "assets/weathIcons/clear.svg";
          break;
        case "Tornado":
          this.cityImg.src = "assets/weathIcons/tornado.svg";
          break;
        case "Snow":
          this.cityImg.src = "assets/weathIcons/snow.svg";
          break;
        case "Rain":
          this.cityImg.src = "assets/weathIcons/rain.svg";
          break;
        case "Thunderstorm":
          this.cityImg.src = "assets/weathIcons/thunder.svg";
          break;
        case "Mist":
          this.cityImg.src = "assets/weathIcons/mist.svg";
          break;
        default:
          console.log("hello");
      }
    },
  };
  page.init();
})();
