import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";

export async function downloadImage(
  url: string,
  outputDir: string,
): Promise<string> {
  const extension = path.extname(url);
  const hash = crypto.createHash("md5").update(url).digest("hex");
  const filename = `${hash}${extension}`;
  const outputPath = path.join(outputDir, filename);

  console.log(`Downloading ${url}`);
  console.log(`Output path: ${outputPath}`);

  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`File already exists: ${outputPath}`);
    return filename;
  }

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`),
          );
          return;
        }

        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`Successfully downloaded ${url} to ${outputPath}`);
          resolve(filename);
        });
      })
      .on("error", (error) => {
        console.error(`Error downloading ${url}:`, error);
        reject(error);
      });
  });
}
