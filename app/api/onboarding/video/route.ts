import { NextRequest, NextResponse } from 'next/server';

// Fallback free stock videos (Pixabay CDN — public domain, no attribution required)
const FALLBACK_VIDEOS = [
  { url: 'https://cdn.pixabay.com/video/2022/09/27/132888-756792866_large.mp4', credit: 'Pixabay' },
  { url: 'https://cdn.pixabay.com/video/2018/04/04/14802-262973993_large.mp4', credit: 'Pixabay' },
  { url: 'https://cdn.pixabay.com/video/2020/07/22/45464-444640366_large.mp4', credit: 'Pixabay' },
  { url: 'https://cdn.pixabay.com/video/2016/09/05/5056-182170745_large.mp4', credit: 'Pixabay' },
];

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword') ?? 'office technology';
  const apiKey = process.env.PEXELS_API_KEY;

  if (apiKey) {
    try {
      const encodedKeyword = encodeURIComponent(keyword);
      const res = await fetch(
        `https://api.pexels.com/videos/search?query=${encodedKeyword}&per_page=5&orientation=landscape&size=medium`,
        { headers: { Authorization: apiKey } }
      );
      if (res.ok) {
        const data = await res.json();
        const videos = data.videos ?? [];
        if (videos.length > 0) {
          const video = videos[Math.floor(Math.random() * videos.length)];
          // Pick the medium or SD quality file
          const files: Array<{ link: string; quality: string; width: number }> = video.video_files ?? [];
          const file = files.find(f => f.quality === 'sd') ?? files.find(f => f.width <= 1280) ?? files[0];
          if (file) {
            return NextResponse.json({ url: file.link, credit: `Video by ${video.user?.name ?? 'Pexels'} on Pexels` });
          }
        }
      }
    } catch {
      // Fall through to fallback
    }
  }

  // No API key or request failed — use a random fallback
  const fallback = FALLBACK_VIDEOS[Math.floor(Math.random() * FALLBACK_VIDEOS.length)];
  return NextResponse.json(fallback);
}
