import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// GET — Fetch OG metadata from a URL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(5000),
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "";
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
    const image =
      $('meta[property="og:image"]').attr("content") ||
      "";
    const type =
      $('meta[property="og:type"]').attr("content") ||
      "";

    return NextResponse.json({
      data: { title: title.trim(), description: description.trim(), image, type, url },
    });
  } catch (error) {
    console.error("OG fetch error:", error);
    return NextResponse.json({
      data: { title: "", description: "", image: "", type: "", url: "" },
    });
  }
}
