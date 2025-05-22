// server.js
const http = require("http");
const { writeFileSync, readFileSync } = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  console.log(`Received ${method} request for ${url}`);

  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Welcome to the Home Page");
  }

  if (url === "/contact" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);
    return;
  }

  if (url === "/contact" && method === "POST") {
    // Implement form submission handling
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const params = new URLSearchParams(body);
      let name = params.get("name");
      name = name.trim();
      try {
        if (!name) {
          throw new Error("Empty name input!");
        }
        // writeFileSync("submissions.txt", name + "\n", { flag: "a" });
        
        // Write data in JSON format instead of plain text
        let data = readFileSync("submissions.json", "utf-8");
        data = data ? JSON.parse(data) : [];
        data.push({name});
        writeFileSync("submissions.json", JSON.stringify(data));
      } catch (err) {
        console.error(`Submission Error: ${err.message}`);
        res.writeHead(400, { "Content-type": "text/plain" });
        return res.end(`Submission Error: ${err.message}`);
      }
      return res.end(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Form Submitted Confirmation</title>
          </head>
          <body>
            <h1>Form Submitted!</h1>
          </body>
        </html>
        `);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});