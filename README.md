# Backend-A4.2
Node.js Dynamic File Server


Server Setup: We use the http module to create a server, and set up error handling to catch and respond to any issues that arise during request processing.
Path Handling: The path module is used to safely join and manipulate file paths, ensuring cross-platform compatibility.
File System Operations: We use the fs module with promises to read directories and files asynchronously.
Directory Listing Generation: The generateDirectoryListing function creates an HTML representation of the current directory, including icons for folders and files, and navigation links.
Content Type Detection: The getContentType function determines the appropriate MIME type for files based on their extensions.
Dynamic Routing: The server dynamically handles requests for different paths, serving either directory listings or file contents as appropriate.
Error Handling: We implement a 404 response for requests to non-existent paths.
Unicode Icons: We use Unicode HTML entities to display folder and file icons in the directory listing.