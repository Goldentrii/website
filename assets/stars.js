// Live GitHub star count. The number in the HTML is the fallback, so a failed
// or rate-limited request leaves the page unchanged.
(function () {
  "use strict";
  var spots = document.querySelectorAll(".stars[data-repo]");
  if (!spots.length || !window.fetch) return;
  var repo = spots[0].getAttribute("data-repo");
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return;
  fetch("https://api.github.com/repos/" + repo, {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then(function (res) {
      return res.ok ? res.json() : null;
    })
    .then(function (data) {
      var n = data && data.stargazers_count;
      if (typeof n !== "number" || n < 1) return;
      for (var i = 0; i < spots.length; i++) {
        spots[i].textContent = n.toLocaleString("en");
      }
    })
    .catch(function () {});
})();
