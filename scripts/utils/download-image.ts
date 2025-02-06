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

  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
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
          resolve(filename);
        });
      })
      .on("error", reject);
  });
}
