export const InteractWithDom = async (b) => {
  try {
    console.log("Function is loading");
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const allDropDownButtons = $$(".dropdownButton");
    const mainMenu = $(".main-menu");
    const mainMenuLinks = $$(".main-menu a");
    const burgerButton = $(".burger-icon");
    const closeMenuButton = $(".menu-close-icon");
    const toDownBtn = $("#toDownBtn");
    const toTopBtn = $("#toTopBtn");
    const nextSectionButtons = $$(".scrollToNextButtonMobile");
    const faqButtonsContainer = $("#faqButtons");
    const faqContentContainer = $("#faqContent");
    let currentCategoryIdx = 0;
    let currentLang = localStorage.getItem("selectedLanguage");
    let data = null;

    allDropDownButtons?.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const chevronIcon = btn.querySelector(".chevronIcon");
        chevronIcon?.classList.toggle("rotate-180");
        btn.classList.toggle("active");
      });

      window.addEventListener("click", () => {
        const chevronIcon = btn.querySelector(".chevronIcon");
        chevronIcon?.classList.remove("rotate-180");
        btn.classList.remove("active");
      });
    });

    burgerButton?.addEventListener("click", (e) => {
      mainMenu?.classList.toggle("active");
      e.stopPropagation();
    });

    mainMenu?.addEventListener("click", (e) => e.stopPropagation());
    closeMenuButton?.addEventListener("click", () =>
      mainMenu?.classList.remove("active")
    );

    mainMenuLinks?.forEach((link) => {
      link.addEventListener("click", () =>
        mainMenu?.classList.remove("active")
      );
    });

    window.addEventListener("click", () =>
      mainMenu?.classList.remove("active")
    );

    toDownBtn?.addEventListener("click", () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });

    toTopBtn?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    nextSectionButtons?.forEach((btn) => {
      btn.addEventListener("click", () => {
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      });
    });

    const fetchData = async () => {
      try {
        const url = b
          ? "https://api.rahmatqr.uz/api/get_business_faq/"
          : "https://api.rahmatqr.uz/api/get_faq/";
        const response = await axios.get(url);

        data = response.data;
        renderCategories(data);
        renderFAQContent(data[currentCategoryIdx]);
        addAnimation();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    window.addEventListener("languageChange", (e) => {
      currentLang = e.detail.language;
      renderCategories(data);
      renderFAQContent(data[currentCategoryIdx]);
      addAnimation();
    });

    const getTextByLang = (details, field) => {
      const currentDetail = details?.[`${field}_${currentLang}`] || "en";
      return currentDetail;
    };

    const renderCategories = (data) => {
      if (faqButtonsContainer) {
        faqButtonsContainer.innerHTML = "";
      }

      data.forEach((category, index) => {
        const button = document.createElement("button");
        button.className = `btn big ${
          currentCategoryIdx === index ? "dark" : "white"
        } select-btn`;
        button.innerText = getTextByLang(category, "name");

        button.addEventListener("click", () => {
          currentCategoryIdx = index;
          renderFAQContent(data[currentCategoryIdx]);
          updateButtons(data);
          addAnimation();
        });
        if (faqButtonsContainer) {
          faqButtonsContainer.appendChild(button);
        }
      });
    };

    const renderFAQContent = (category) => {
      if (!faqContentContainer) {
        console.log("faqContentContainer not found in the DOM.");
        return;
      }
      faqContentContainer.innerHTML = "";
      if (!category?.items) return;

      category.items.forEach((details, index) => {
        const detailsElement = document.createElement("details");
        detailsElement.className =
          "py-[30px] px-[40px]  max-md:border-b-[1px] max-md:border-b-[#88888880] max-md:pb-[15px]";
        detailsElement.style = "padding:15px 20px;width:100%";
        detailsElement.innerHTML = `
          <summary class="flex justify-between items-center">
            <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-5">
              <h3 class="max-md:hidden text-[16px] mr-2">${
                index < 9 ? "0" : ""
              }${index + 1}</h3>
              <h1
                class="text-[30px] max-w-[550px] max-lg:text-[25px] max-sm:text-[16px] max-sm:max-w-[200px]"
              >
                ${getTextByLang(details, "question")}
              </h1>
              </div>
              <div>
                <button class="icon-btn white plus">
                  <img src="./assets/icons/plus-icon.svg" alt="plus" />
                </button>
                <button class="icon-btn minus" style="display: none;">
                  <img src="./assets/icons/minus-icon.svg" alt="minus" />
                </button>
              </div>
            </div>
          </summary>
          <div class="content flex justify-between items-center">
            <div class="max-md:hidden"></div>
            <div class="max-w-[430px] w-full">
              <p class=" w-full max-sm:text-[12px]">
                ${getTextByLang(details, "answer")}
              </p>
            </div>
          </div>
        `;

        faqContentContainer.appendChild(detailsElement);
      });
    };

    const updateButtons = () => {
      faqButtonsContainer
        .querySelectorAll("button")
        .forEach((button, index) => {
          button.className = `btn big ${
            currentCategoryIdx === index ? "dark" : "white"
          }`;
        });
    };

    const addAnimation = () => {
      document.querySelectorAll("details").forEach((el) => {
        const summary = el.querySelector("summary");
        const content = el.querySelector(".content");
        const plusBtn = el.querySelector(".plus");
        const minusBtn = el.querySelector(".minus");

        summary.addEventListener("click", (e) => {
          e.preventDefault();
          if (el.open) {
            slideUp(content, () => {
              el.open = false;
              plusBtn.style.display = "block";
              minusBtn.style.display = "none";
            });
          } else {
            el.open = true;
            plusBtn.style.display = "none";
            minusBtn.style.display = "block";
            slideDown(content);
          }
        });
      });
    };

    const slideUp = (element, callback) => {
      element.style.height = element.offsetHeight + 45 + "px";
      element.offsetHeight;
      element.style.height = "0";
      element.style.paddingTop = "0";

      element.addEventListener("transitionend", function handler() {
        element.removeEventListener("transitionend", handler);
        callback();
      });
    };

    const slideDown = (element) => {
      element.style.height = "0";
      element.offsetHeight;

      const paddingTop = window.innerWidth <= 600 ? "20px" : "40px";
      element.style.height =
        element.scrollHeight + parseInt(paddingTop) + 5 + "px";
      element.style.paddingTop = paddingTop;

      element.addEventListener("transitionend", function handler() {
        element.removeEventListener("transitionend", handler);
        element.style.height = "auto";
      });
    };

    await fetchData();
    console.log("Function is ready");
  } catch (err) {
    console.error("Error from DOM interaction:", err);
    throw err;
  }
};
