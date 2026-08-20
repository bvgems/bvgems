import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { spawn } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

// Wraps spawn in a promise to easily await the ffmpeg process
const runFfmpeg = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    // High quality compression settings for web
    // crf 18 = visually lossless, preset slow = best compression, faststart = web optimized, pix_fmt = maximum compatibility
    const args = [
      '-i', inputPath,
      '-c:v', 'libx264',
      '-crf', '18',
      '-preset', 'slow',
      '-an', // Strip audio track entirely (works even if already muted)
      '-movflags', '+faststart',
      '-pix_fmt', 'yuv420p',
      '-y', // Overwrite output files without asking
      outputPath
    ];

    const ffmpegProcess = spawn('ffmpeg', args);

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ffmpegProcess.on('error', (err) => {
      reject(err);
    });
  });
};

async function main() {
  console.log("==================================================");
  console.log("🎥 BV Gems Local Video Pre-Processor (MOV -> MP4)");
  console.log("==================================================\n");

  const folderPathInput = await askQuestion('Enter the full path to the folder containing your new .mov videos:\n> ');
  
  // Clean up quotes or trailing spaces if they dragged the folder into the terminal
  const folderPath = folderPathInput.replace(/^["']|["']$/g, '').trim();

  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    console.error(`\n❌ Error: The path "${folderPath}" does not exist or is not a directory.`);
    rl.close();
    return;
  }

  // Find all .mov files (case insensitive)
  const files = fs.readdirSync(folderPath);
  const movFiles = files.filter(file => file.toLowerCase().endsWith('.mov'));

  if (movFiles.length === 0) {
    console.log(`\n⚠️ No .mov files found in "${folderPath}".`);
    rl.close();
    return;
  }

  console.log(`\n🔍 Found ${movFiles.length} .mov files. Preparing conversion...`);

  // Create temporary folder for ACID compliance (all-or-nothing)
  const tempFolderName = '.temp_mp4_conversion';
  const finalFolderName = 'Converted_MP4s';
  const tempFolderPath = path.join(folderPath, tempFolderName);
  const finalFolderPath = path.join(folderPath, finalFolderName);

  // Clean up any old temp folder if it exists
  if (fs.existsSync(tempFolderPath)) {
    fs.rmSync(tempFolderPath, { recursive: true, force: true });
  }

  // Create the fresh temp folder
  fs.mkdirSync(tempFolderPath);

  let successCount = 0;
  let hasError = false;

  console.log(`\n⚙️  Starting visually-lossless conversion. This may take some time depending on video length...\n`);

  for (let i = 0; i < movFiles.length; i++) {
    const file = movFiles[i];
    const inputPath = path.join(folderPath, file);
    // Replace .mov with .mp4
    const outputFilename = file.replace(/\.mov$/i, '.mp4');
    const outputPath = path.join(tempFolderPath, outputFilename);

    console.log(`⏳ [${i + 1}/${movFiles.length}] Converting: ${file} ...`);
    
    try {
      await runFfmpeg(inputPath, outputPath);
      console.log(`   ✅ Success!`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed to convert ${file}:`, error.message);
      hasError = true;
      break; // Abort immediately on first failure
    }
  }

  if (hasError) {
    console.error(`\n🚨 CRITICAL FAILURE 🚨`);
    console.error(`A video failed to convert. To ensure NO data loss and NO partial uploads, the entire batch is being aborted.`);
    console.error(`Deleting temporary folder...`);
    fs.rmSync(tempFolderPath, { recursive: true, force: true });
    console.error(`All your original .mov files are perfectly safe and untouched.`);
  } else {
    // If we reach here, 100% of the videos succeeded.
    // We safely rename the temp folder to the final folder name.
    
    // If the final folder already exists, we could just move files into it, 
    // but to keep it simple and safe, let's just make sure it's created or merged.
    if (!fs.existsSync(finalFolderPath)) {
      fs.renameSync(tempFolderPath, finalFolderPath);
    } else {
      // Merge files if Converted_MP4s already exists
      const tempFiles = fs.readdirSync(tempFolderPath);
      for (const tempFile of tempFiles) {
        fs.renameSync(
          path.join(tempFolderPath, tempFile), 
          path.join(finalFolderPath, tempFile)
        );
      }
      fs.rmSync(tempFolderPath, { recursive: true, force: true });
    }

    console.log(`\n🎉 BATCH COMPLETE! 🎉`);
    console.log(`Successfully converted ${successCount} videos!`);
    console.log(`You can find your highly-optimized MP4s here: ${finalFolderPath}`);
    console.log(`\nYou are now ready to safely upload the contents of the 'Converted_MP4s' folder to Cloudinary.`);
  }

  rl.close();
}

main();
