export class SharpMissingError extends Error {
  constructor() {
    super(
      "sharp is required but not installed. Install it with: npm install sharp"
    );
    this.name = "SharpMissingError";
  }
}
