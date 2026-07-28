const MODE = process.env.MODE === 'medium' ? 'medium' : 'easy';
const PORT = Number(process.env.PORT) || (MODE === 'medium' ? 3002 : 3001);
const IS_VERCEL = Boolean(process.env.VERCEL);

const STAMPS = {
  easy: {
    idor: '秘密データ-OK!!',
    xss: 'スクリプト実行-OK!!',
    bypass: '連投成功-OK!!',
  },
  medium: {
    idor: '内部ID発見-OK!!',
    xss: 'サニタイズ突破-OK!!',
    bypass: 'IP偽装-OK!!',
  },
};

module.exports = { MODE, PORT, STAMPS, IS_VERCEL };
