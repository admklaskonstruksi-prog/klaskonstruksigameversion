"use server";

export interface BunnyVideo {
  guid: string;
  title: string;
  length: number;
  thumbnailFileName: string;
  dateUploaded: string;
  views: number;
}

const LIBRARY_ID = "587133"; // ID Library Anda
const API_KEY = process.env.BUNNY_API_KEY; // Dari .env.local

export async function getBunnyVideos(searchQuery: string = "") {
  if (!API_KEY) {
    console.error("Missing BUNNY_API_KEY in .env.local");
    return { success: false, error: "API Key Missing" };
  }

  try {
    let url = `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos?page=1&itemsPerPage=100&orderBy=date`;
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: API_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Bunny API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const videos: BunnyVideo[] = data.items.map((item: any) => ({
      guid: item.guid,
      title: item.title,
      length: item.length,
      thumbnailFileName: item.thumbnailFileName,
      dateUploaded: item.dateUploaded,
      views: item.views,
    }));

    return { success: true, data: videos };

  } catch (error: any) {
    console.error("Bunny Fetch Error:", error);
    return { success: false, error: error.message };
  }
}