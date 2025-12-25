import { execSync } from "child_process";

let sharpInstance;

export async function loadSharp() {
  if (sharpInstance) return sharpInstance;

  try {
    sharpInstance = (await import("sharp")).default;
    return sharpInstance;
  } catch {
    console.warn(
      "[Warning]: 'sharp' package not found. Installing it now, please wait..."
    );

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
