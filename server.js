const fs = require("fs");
const express = require("express");
const xlsx = require("xlsx");
const path = require("path");

const app = express();
const PORT = 3000;
const dbFilePath = path.join(__dirname, "DatabasebillAI.xlsx");

app.use(express.static("public"));

// Fungsi untuk membaca dan menambahkan data baru ke file Excel
function searchGameInExcel(gameName) {
  try {
    const workbook = xlsx.readFile(dbFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Logging untuk memastikan database terbaca
    console.log("Database berhasil dibaca.");

    const game = data.find(
      (row) => row.GameName.toLowerCase() === gameName.toLowerCase()
    );

    if (game) {
      if (game.DownloadLink === "Pending") {
        console.log("Game ditemukan dengan status 'Pending'");
        return {
          message:
            "Maaf! Game Masih Diproses Untuk Dicari Linknya, Tanyakan Game Lain atau Memang Game Tersebut Belum Dibuat atau Sudah Dihapus.",
        };
      } else {
        console.log(
          "Game ditemukan dengan link download, install, dan gameplay."
        );
        return {
          downloadLink: game.DownloadLink,
          installLink: game.InstallLink,
          gameplayLink: game.GameplayLink,
        };
      }
    } else {
      console.log("Game tidak ditemukan, menambahkan game ke database.");
      data.push({
        GameName: gameName,
        DownloadLink: "Pending",
        InstallLink: "Pending",
        GameplayLink: "Pending",
      });
      const newWorksheet = xlsx.utils.json_to_sheet(data);
      workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
      xlsx.writeFile(workbook, dbFilePath);

      return {
        message: "Game tidak ditemukan. Akan ditambahkan ke daftar permintaan.",
      };
    }
  } catch (error) {
    console.error("Error saat mengakses database Excel:", error);
    throw new Error("Database tidak dapat diakses.");
  }
}

app.get("/search-game", (req, res) => {
  try {
    const gameName = req.query.name;
    const result = searchGameInExcel(gameName);

    if (result) {
      res.json(result);
    } else {
      res.status(500).json({ message: "Error: Game tidak ditemukan." });
    }
  } catch (error) {
    console.error("Error dalam /search-game endpoint:", error);
    res.status(500).json({ message: "Error: Tidak dapat mengakses database." });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
