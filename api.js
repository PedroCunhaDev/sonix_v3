const http = require("http"),
  fs = require("fs"),
  url = require("url"),
  path = require("path");
const express = require("express");
const musicMetadata = require('music-metadata');
const app = express();

const PORT = 3000,
  SONGS_DIR = "./songs",
  ALBUMS_DIR = "./albums";
let songs = [];

const resp = (res, code, d, t = "application/json") => {
  res.writeHead(code, { "Content-Type": t });
  res.end(t === "application/json" ? JSON.stringify(d) : d);
};

const getReqBody = (req, cb) => {
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => cb(b));
};

app.use((req, res, next) => {
  let { pathname, query } = url.parse(req.url, true);
  if (pathname == "/songs" && req.method == "GET") {
    if (query.q) {
      let r = songs.filter(
        (s) =>
          s.name?.includes(query.q) ||
          s.album?.includes(query.q) ||
          s.artist?.includes(query.q)
      );
      return resp(res, 200, r);
    }
    if (songs.length == 0) {
      fs.readdir(SONGS_DIR, async (err, files) => {
        if (err)
          return resp(res, 500, { error: "Failed to read songs directory" });

        for (const [index, file] of files.filter((file) => file.endsWith(".mp3")).entries()) {
            try {
              const filePath = `${SONGS_DIR}/${file.trim()}`;
              const metadata = await musicMetadata.parseFile(filePath);
              const song = {
                  id: index,
                  name: path.basename(file, ".mp3"),
                  length: Math.floor(metadata.format.duration) || 0,
                }

              if (metadata.common.album) song.album = metadata.common.album;
              if (metadata.common.artist) song.album = metadata.common.artist;
              songs.push(song);
            } catch (err) {
              console.error(`Error reading metadata for file ${file}:`, err);
            }
          }
        console.log(files);

        return resp(res, 200, songs);
      });
      return;
    }
    return resp(res, 200, songs);
  }
  if (pathname == "/songs" && req.method == "POST") {
    getReqBody(req, (b) => {
      let d = JSON.parse(b);
      d.id = songs.length;
      songs.push(d);
      // In a real app, save d.file (the mp3) to SONGS_DIR.
      resp(res, 201, d);
    });
    return;
  }
  if (pathname.match(/^\/songs\/\d+$/) && req.method == "PUT") {
    let id = +pathname.split("/")[2];
    getReqBody(req, (b) => {
      let d = JSON.parse(b);
      songs[id] = Object.assign(songs[id] || {}, d);
      resp(res, 200, songs[id]);
    });
    return;
  }
  if (pathname.match(/^\/songs\/\d+\/file$/) && req.method == "GET") {
    let id = +pathname.split("/")[2];

    if (songs[id] && songs[id].name) {
      let f = path.join(SONGS_DIR, songs[id].name + '.mp3');
      fs.createReadStream(f)
        .on("error", () => resp(res, 404, ""))
        .pipe(res);
    } else resp(res, 404, "");
    return;
  }
  if (pathname == "/albums" && req.method == "POST") {
    getReqBody(req, (b) => {
      let d = JSON.parse(b); // Expect d.album, d.hq, d.sm (e.g. file buffers or file names)
      let hq = path.join(ALBUMS_DIR, d.album + "_hq.jpg"),
        sm = path.join(ALBUMS_DIR, d.album + "_sm.jpg");
      // Here you’d write d.hq and d.sm to files; skipping actual write for brevity.
      resp(res, 201, { album: d.album, hq, sm });
    });
    return;
  }
  resp(res, 404, "Not Found", "text/plain");
  next(); // Important: call next to pass control to Express
});

const server = http.createServer(app);
server.listen(PORT, () => console.log("API running on port " + PORT));
