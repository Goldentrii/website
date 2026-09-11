(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("langToggle");
  const descriptions = {
    en: "Tong Wu connects AI engineering, complex project management and product growth. Explore shipped products, European supply-chain experience, and learning credentials. Career focus: project management, growth and FDE.",
    zh: "吴桐：连接 AI 工程、复杂项目管理与产品增长。聚焦项目管理、增长与 FDE，展示 AI 产品、欧洲物流供应链经历，以及六西格玛、Google 和机器学习证书。",
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
  const aliases = {
    "#experience": "#path",
    "#projects": "#building",
    "#skills": "#focus",
  };
  if (aliases[location.hash]) {
    const target = document.querySelector(aliases[location.hash]);
    if (target) target.scrollIntoView();
  }
})();
