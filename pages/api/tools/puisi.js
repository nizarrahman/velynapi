import axios from "axios";
import cheerio from "cheerio";
import { API_KEY, CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    try {
        const hasilPuisi = await puisi();
        if (!hasilPuisi) {
            throw new Error("Tidak ada puisi yang ditemukan.");
        }

        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: hasilPuisi,
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: error.message || "Internal Server Error",
        });
    }
}

const BASE = "https://karyakarsa.com/sigota/kumpulan-puisi-random-2";

async function puisi() {
    try {
        const { data } = await axios.get(BASE);
        const $ = cheerio.load(data);

        let puisiList = [];

        $(".content-lock p").each((i, el) => {
            let text = $(el).text().trim();
            if (text) puisiList.push(text);
        });

        if (puisiList.length === 0) {
            throw new Error("Gagal menemukan puisi di halaman.");
        }

        let puisiFormatted = [];
        let currentPuisi = [];

        for (let line of puisiList) {
            if (line === "-----------") {
                if (currentPuisi.length) {
                    puisiFormatted.push([...currentPuisi]);
                    currentPuisi = [];
                }
            } else {
                currentPuisi.push(line);
            }
        }

        if (currentPuisi.length) puisiFormatted.push([...currentPuisi]);

        if (puisiFormatted.length === 0) {
            throw new Error("Tidak ada puisi yang dapat diambil.");
        }

        let randomIndex = Math.floor(Math.random() * puisiFormatted.length);
        return puisiFormatted[randomIndex];
    } catch (error) {
        console.error("Scraping error:", error.message);
        throw new Error("Terjadi kesalahan dalam mengambil data puisi.");
    }
}
