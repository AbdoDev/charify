import { execSync } from "child_process";
import readline from "readline";

let sharpInstance;

function askYesNo(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

export async function loadSharp() {
  if (sharpInstance) return sharpInstance;

  try {
    sharpInstance = (await import("sharp")).default;
    return sharpInstance;
  } catch {
    console.warn(
      "[Warning]: 'sharp' package not found. charify might not work without it."
    );

    const install = await askYesNo(
      "Do you want to install 'sharp' now? (y/n): "
    );
    if (!install) {
      console.log("Skipping 'sharp' installation. Please install it manually.");
      return null;
    }

    try {
      execSync("npm install sharp", { stdio: "inherit" });
      sharpInstance = (await import("sharp")).default;
      console.log("'sharp' installed successfully.");
      return sharpInstance;
    } catch (installErr) {
      throw new Error(
        "Failed to install 'sharp'. Please install it manually and try again."
      );
    }
  }
}
