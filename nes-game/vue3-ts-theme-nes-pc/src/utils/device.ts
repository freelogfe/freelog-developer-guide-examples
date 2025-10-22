// 设备检测工具函数
export const isMobileDevice = (): boolean => {
  // 检测用户代理字符串
  const userAgent = navigator.userAgent.toLowerCase();

  // 移动设备关键词
  const mobileKeywords = [
    "android",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
    "mobile",
    "tablet",
  ];

  // 检测是否包含移动设备关键词
  const hasMobileKeyword = mobileKeywords.some((keyword) =>
    userAgent.includes(keyword)
  );

  // 检测屏幕宽度（作为备用方案）
  const hasSmallScreen = window.innerWidth <= 768;

  // 检测触摸事件支持
  const hasTouchSupport =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // 综合判断
  return hasMobileKeyword || (hasSmallScreen && hasTouchSupport);
};

export const isTabletDevice = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();

  // 平板设备关键词
  const tabletKeywords = ["ipad", "tablet", "kindle", "silk"];

  return (
    tabletKeywords.some((keyword) => userAgent.includes(keyword)) ||
    (isMobileDevice() && window.innerWidth > 768)
  );
};

export const isDesktopDevice = (): boolean => {
  return !isMobileDevice();
};
export const gameCores = [
  "nesrom",
  "红白机",
  "atari5200",
  "vb",
  "nds",
  "arcade",
  "nes",
  "gb",
  "coleco",
  "segaMS",
  "segaMD",
  "segaGG",
  "segaCD",
  "sega32x",
  "sega",
  "lynx",
  "mame",
  "ngp",
  "pce",
  "pcfx",
  "psx",
  "ws",
  "gba",
  "n64",
  "3do",
  "psp",
  "atari7800",
  "snes",
  "atari2600",
  "jaguar",
  "segaSaturn",
  "amiga",
  "c64",
  "c128",
  "pet",
  "plus4",
  "vic20",
  "dos",
];
