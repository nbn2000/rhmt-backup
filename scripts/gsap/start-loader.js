export const starLoader = (totalFunctions, functions) => {
  return new Promise(async (resolve, reject) => {
    try {
      const startTime = Date.now(); // Start time of the loading process
      const minLoadingTime = 500;
      const hash = window.location.hash;
      window.scrollTo({ top: 0, behavior: "smooth" });
      const overlay = document.querySelector(".overlay");
      const bar = document.querySelectorAll(".bar");
      let currentProgress = 0;
      const progressIncrement = 100 / totalFunctions;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      overlay.style.visibility = "visible";

      function enableScroll() {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        overlay.style.visibility = "hidden";
        if (hash) {
          const section = document.querySelector(hash);
          if (section) {
            window.scrollTo({
              top: section.offsetTop,
              behavior: "smooth",
            });
          }
        }
      }

      const executedFunctions = new Set();

      for (const func of functions) {
        if (!executedFunctions.has(func)) {
          await func();
          executedFunctions.add(func);
          currentProgress += progressIncrement;
        }
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = minLoadingTime - elapsedTime;

      if (remainingTime > 0)
        await new Promise((resolve) => setTimeout(resolve, remainingTime));

      gsap.to(".loader-wrapper", {
        opacity: 0,
        visibility: "hidden",
        delay: 0.1,
        duration: 0.3,
        onComplete: async () => {
          const barAnimations = Array.from(bar).map((i, index) =>
            gsap
              .to(i, {
                height: 0,
                opacity: 0,
                duration: 1,
                backgroundColor: "white",
                ease: "power4.inOut",
                delay: 0.02 * (index + 1),
              })
              .then()
          );

          await Promise.all(barAnimations);

          enableScroll();
          resolve("Loader animation complete");
        },
      });
    } catch (err) {
      console.log("Error in loader animation:", err);
      reject(err);
    }
  });
};
