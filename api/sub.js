export default async function handler(req, res) {
  const githubRawBase = process.env.GITHUB_RAW_BASE;
  const user = req.query.user;

  if (!githubRawBase) {
    return res.status(500).send("Missing config");
  }

  if (!/^user[1-9]$/.test(user || "")) {
    return res.status(404).send("Not found");
  }

  const targetUrl = `${githubRawBase}/mantle/${user}.txt`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return res.status(502).send("Upstream error");
    }

    const content = await response.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).send(content);
  } catch {
    return res.status(500).send("Internal server error");
  }
}
