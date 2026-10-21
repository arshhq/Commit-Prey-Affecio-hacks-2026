/**
 * Offline regression tests for Message Guard rules.
 * Run: node scripts/test-safety.mjs
 */
import { analyzeMessageLocally } from "../server/rules.mjs";

const cases = [
  {
    name: "money + urgency = high",
    text: "Baby please send $500 via Western Union today — hospital emergency for my sister!",
    expectLevel: "high",
    expectTypes: ["money_request", "urgency"],
  },
  {
    name: "off-platform WhatsApp",
    text: "Add me on WhatsApp +1 5551234567 so we can talk privately",
    expectLevel: "moderate",
    expectTypes: ["off_platform"],
  },
  {
    name: "OTP / sensitive",
    text: "Just forward me the verification code they texted you so I can verify my account",
    expectLevel: "moderate",
    expectTypes: ["sensitive_info"],
  },
  {
    name: "suspicious short link",
    text: "Click this link to claim your prize bit.ly/xyz99",
    expectLevel: "moderate",
    expectTypes: ["suspicious_link"],
  },
  {
    name: "benign hello stays low",
    text: "Hey! Want to grab coffee this weekend if you're free?",
    expectLevel: "low",
    expectTypes: [],
  },
  {
    name: "empty is low",
    text: "   ",
    expectLevel: "low",
    expectTypes: [],
  },
];

let failed = 0;
for (const c of cases) {
  const result = analyzeMessageLocally(c.text);
  const types = result.flags.map((f) => f.type);
  const levelOk = result.riskLevel === c.expectLevel;
  const typesOk = c.expectTypes.every((t) => types.includes(t));
  if (!levelOk || !typesOk) {
    failed += 1;
    console.error(`FAIL: ${c.name}`);
    console.error(`  expected level=${c.expectLevel} types=${c.expectTypes.join(",")}`);
    console.error(`  got level=${result.riskLevel} types=${types.join(",")}`);
  } else {
    console.log(`ok: ${c.name} (${result.riskLevel}, ${types.join(",") || "none"})`);
  }
}

if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} Message Guard tests passed.`);
