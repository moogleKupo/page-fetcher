const request = require('request');
const fs = require('fs');

const [, , url, filePath] = process.argv;

if (!url || !filePath) {
  console.error('Usage: node fetcher.js <URL> <file_path>');
  process.exit(1);
}

const downloadFile = () => {
  const downloadStream = request(url);

  downloadStream.on('response', (response) => {
    let totalBytes = 0;

    const writeStream = fs.createWriteStream(filePath);

    response.on('data', (chunk) => {
      totalBytes += chunk.length;
      writeStream.write(chunk);
    });

    response.on('end', () => {
      writeStream.end();
      console.log(`Downloaded and saved ${totalBytes} bytes to ${filePath}`);
    });

    response.on('error', (err) => {
      console.error('Error during response:', err);
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to file:', err);
    });
  });

  downloadStream.on('error', (err) => {
    console.error('Error during download:', err);
  });
};

downloadFile();
