import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const OFFICIAL_EMAIL = "navdeep1912.be23@chitkara.edu.in";
const GEMINI_KEY = process.env.GEMINI_KEY;

const fibonacci = (n) => {
  let arr = [0, 1];
  for (let i = 2; i < n; i++) arr.push(arr[i - 1] + arr[i - 2]);
  return n === 1 ? [0] : arr.slice(0, n);
};

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm2 = (a, b) => (a * b) / gcd(a, b);

// POST /bfhl
app.post("/bfhl", async (req, res) => {
  try {
    const { fibonacci: fib, prime, lcm, hcf, AI } = req.body;

    const keys = [fib, prime, lcm, hcf, AI].filter((x) => x !== undefined);
    if (keys.length !== 1)
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        data: "Exactly ONE key required",
      });

    if (fib !== undefined)
      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: fibonacci(fib),
      });

    if (prime !== undefined)
      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: prime.filter(isPrime),
      });

    if (lcm !== undefined)
      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: lcm.reduce((a, b) => lcm2(a, b)),
      });

    if (hcf !== undefined)
      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: hcf.reduce((a, b) => gcd(a, b)),
      });

    if (AI !== undefined) {
      const result = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
        {
          contents: [{ parts: [{ text: AI }] }],
        }
      );

      const text = result.data.candidates[0].content.parts[0].text;
      const firstWord = text.split(" ")[0];

      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: firstWord,
      });
    }
  } catch (err) {
    res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      data: err.message,
    });
  }
});

app.get("/health", (req, res) => {
  res.json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
