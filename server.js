const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const BASE_DIR = process.cwd(); // Use the current working directory as the base

// Unicode icons for folders and files
const FOLDER_ICON = '&#128193;';
const FILE_ICON = '&#128196;';

const server = http.createServer(async (req, res) => {
  try {
    // Decode the URL to handle spaces and special characters in file/folder names
    const decodedUrl = decodeURIComponent(req.url);
    
    // Construct the full path by joining the base directory and the URL path
    const fullPath = path.join(BASE_DIR, decodedUrl);

    // Check if the path exists
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      // If it's a directory, generate and serve the directory listing
      const files = await fs.readdir(fullPath);
      const content = generateDirectoryListing(decodedUrl, files);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else {
      // If it's a file, serve the file content
      const content = await fs.readFile(fullPath);
      // Set the appropriate content type based on file extension
      const contentType = getContentType(fullPath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  } catch (err) {
    // Handle errors (e.g., file not found)
    console.error(err);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

function generateDirectoryListing(currentPath, files) {
  let html = '<html><head><title>Directory Listing</title></head><body>';
  html += `<h1>Directory Listing for ${currentPath}</h1>`;
  html += '<ul>';

  // Add parent directory link if not in root
  if (currentPath !== '/') {
    html += `<li>${FOLDER_ICON} <a href="${path.join(currentPath, '..')}">Parent Directory</a></li>`;
  }

  // Generate list items for each file/folder
  files.forEach(file => {
    const filePath = path.join(currentPath, file);
    const isDirectory = fs.statSync(path.join(BASE_DIR, filePath)).isDirectory();
    const icon = isDirectory ? FOLDER_ICON : FILE_ICON;
    html += `<li>${icon} <a href="${filePath}">${file}</a></li>`;
  });

  html += '</ul></body></html>';
  return html;
}

function getContentType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.txt': 'text/plain',
  };

  return mimeTypes[extname] || 'application/octet-stream';
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});