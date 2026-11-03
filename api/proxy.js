const fetch = require('node-fetch');
const ytdl = require('@distube/ytdl-core');

const TIKWM = 'https://www.tikwm.com/api/';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url, hd } = req.query;
  if (!url) return res.status(400).json({ error: 'url required' });

  try {
    if (/youtube\.com|youtu\.be/.test(url)) {
      const info = await ytdl.getInfo(url);
      const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
      const hd1080 = formats.find(f => f.qualityLabel === '1080p');
      const hd720  = formats.find(f => f.qualityLabel === '720p');
      const best   = hd1080 || hd720 || formats[0];
      const audio  = ytdl.filterFormats(info.formats, 'audioonly')[0];

      return res.json({
        code: 0,
        data: {
          title: info.videoDetails.title,
          author: { unique_id: info.videoDetails.author.name },
          cover: info.videoDetails.thumbnails.slice(-1)[0]?.url || '',
          play: best?.url || '',
          hdplay: hd1080?.url || best?.url || '',
          wmplay: '',
          music: audio?.url || ''
        }
      });
    }

    // TikTok + Instagram
    const r = await fetch(`${TIKWM}?url=${encodeURIComponent(url)}&hd=${hd || 1}`);
    const data = await r.json();
    res.json(data);

  } catch (e) {
    res.status(500).json({ error: e.message || 'upstream failed' });
  }
};
