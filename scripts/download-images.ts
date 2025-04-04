import fs from "fs";
import path from "path";
import https from "https";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const images = [
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/64db9bb0e264c840198d4c6b_instant-datasets-header-img-p-800.webp",
    path: "public/images/product/instant-datasets/header.webp",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/64c104834c6c18db47700ac2_datase-main-logo.svg",
    path: "public/images/product/instant-datasets/database-logo.svg",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/641c609670cd62592e1f0c12_graphics-dataset-can.svg",
    path: "public/images/product/instant-datasets/features-illustration.svg",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/603dd147c5b0a472a91bd41f_aws.svg",
    path: "public/images/product/instant-datasets/logos/aws.svg",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/641b388d1158160da8745e69_mysql-logo.svg",
    path: "public/images/product/instant-datasets/logos/mysql.svg",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/641b388d9b587c5914315f37_PostgressSQL-logo.svg",
    path: "public/images/product/instant-datasets/logos/postgresql.svg",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/641b388ca988d52a18504b80_GCP-logo.svg",
    path: "public/images/product/instant-datasets/logos/gcp.svg",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/641b388dc7b51be6601fd1fa_Azure-logo.svg",
    path: "public/images/product/instant-datasets/logos/azure.svg",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/64bab15a93c60506ae86e8f0_MariaDB2.svg",
    path: "public/images/product/instant-datasets/logos/mariadb.svg",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/64c4246f4c4309ebdf12c9d4_lp-tag-img.webp",
    path: "public/images/product/instant-datasets/employee.webp",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/64cd2842cc693549a987f856_instant-resource-image-card1.webp",
    path: "public/images/product/instant-datasets/resources/quickstart.webp",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/64cd284234c4581650e97801_instant-resource-image-card2.webp",
    path: "public/images/product/instant-datasets/resources/announcement.webp",
  },
  {
    url: "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/64d2a0b17e3c976b5d88eadf_instant-resource-image-card3-new.svg",
    path: "public/images/product/instant-datasets/resources/ephemeral.svg",
  },
];

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`),
          );
          return;
        }

        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });

        fileStream.on("error", (err) => {
          fs.unlink(filepath, () => reject(err));
        });
      })
      .on("error", reject);
  });
}

async function downloadAllImages() {
  console.log("Starting image downloads...");

  try {
    await Promise.all(images.map((img) => downloadImage(img.url, img.path)));
    console.log("All images downloaded successfully!");
  } catch (error) {
    console.error("Error downloading images:", error);
    process.exit(1);
  }
}

downloadAllImages();
