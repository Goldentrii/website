(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("langToggle");
  const descriptions = {
    en: "Tong Wu builds AI products and improves real-world operations. Explore AgentRecall, agent infrastructure, and supply-chain experience at Novada Labs, Amazon, Xiaomi, and Huawei.",
    zh: "吴桐：连接 AI 产品与真实业务。了解 AgentRecall、智能体基础设施，以及 Novada Labs、亚马逊、小米和华为的产品、供应链与流程改进经历。",
  };
  function applyLanguage(lang) {
    root.dataset.lang = lang;
    root.lang = lang === "zh" ? "zh-CN" : "en";
    toggle.setAttribute(
      "aria-label",
      lang === "zh" ? "Switch to English" : "Switch to Chinese",
    );
    document.title =
      lang === "zh"
        ? "吴桐 Tong Wu — AI 产品与业务运营"
        : "Tong Wu — AI Products & Operations";
    document.querySelector('meta[name="description"]').content =
      descriptions[lang];
    try {
      localStorage.setItem("tw-lang", lang);
    } catch {
      /* Language still works without storage. */
    }
  }
  applyLanguage(root.dataset.lang === "zh" ? "zh" : "en");
  toggle.addEventListener("click", () =>
    applyLanguage(root.dataset.lang === "zh" ? "en" : "zh"),
  );
  // Preserve deep links from previous versions of the site.
  const aliases = { "#experience": "#path", "#projects": "#building" };
  if (aliases[location.hash]) {
    const target = document.querySelector(aliases[location.hash]);
    if (target) target.scrollIntoView();
  }
})();
