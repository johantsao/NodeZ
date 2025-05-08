/* ─── src/utils/youtube.ts ───────────────────────────────────────────── */
export function getYoutubeId(url: string): string | null {
    try {
      const u = new URL(url)
      if (u.hostname === 'youtu.be')       return u.pathname.slice(1)
      if (u.hostname.includes('youtube'))  return u.searchParams.get('v')
      return null
    } catch { return null }
  }
  
  export function youtubeThumbUrl(ytId: string, quality: 'hq'|'mq'|'sd'='hq') {
    const q = quality === 'mq' ? 'mqdefault' :
              quality === 'sd' ? 'sddefault' : 'hqdefault'
    return `https://img.youtube.com/vi/${ytId}/${q}.jpg`
  }
  