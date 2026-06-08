import { Jimp } from 'jimp';

const files = ['public/icons/cart.png', 'public/icons/user.png', 'public/icons/expand.png', 'public/icons/expand1.png'];
for (const file of files) {
  const image = await Jimp.read(file);
  const colorCounts = new Map();
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const a = image.bitmap.data[idx + 3];
    if (a < 30) return;
    const r = image.bitmap.data[idx], g = image.bitmap.data[idx+1], b = image.bitmap.data[idx+2];
    const key = `${Math.round(r/20)*20},${Math.round(g/20)*20},${Math.round(b/20)*20}`;
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
  });
  const sorted = [...colorCounts.entries()].sort((a,b) => b[1]-a[1]).slice(0, 4);
  console.log(file, sorted);
}
