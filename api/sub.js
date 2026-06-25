export default async function handler(req, res) {
  // لینک پایه را از تنظیمات ورسل می‌گیرد
  const githubRawBase = process.env.GITHUB_RAW_BASE;
  const { user } = req.query;

  if (!user) {
    return res.status(400).send("Username is required.");
  }

  if (!githubRawBase) {
    return res.status(500).send("Server Configuration Error: GITHUB_RAW_BASE is not set.");
  }

  // حالا هر نامی که در آدرس بیاید، در پوشه mantle دنبال فایل .txt آن می‌گردد
  const targetUrl = `${githubRawBase}/mantle/${user}.txt`;

  try {
    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "Vercel-Proxy-Agent" }
    });

    if (!response.ok) {
      // اگر فایل در گیت‌هاب نبود (مثلاً user10.txt وجود نداشت)
      return res.status(404).send(`User '${user}' not found in configs.`);
    }

    const content = await response.text();

    // تنظیم هدرها برای جلوگیری از کش شدن و نمایش درست در کلاینت‌ها
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    
    return res.status(200).send(content);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}
