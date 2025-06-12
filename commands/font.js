module.exports = {
  name: 'font',
  description: 'Convert text into font styles',
  category: 'Tools',
  async execute(senderId, args, pageAccessToken, event, sendMessage) {
    const input = args.join(' ').trim();
    if (!input) {
      return sendMessage(senderId, {
        text: 'Usage: font <your text>',
      }, pageAccessToken);
    }

    // 10 font converters
    const fonts = [
      { name: 'Cursive', fn: txt => txt.replace(/[a-z]/gi, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119951 : 119917))) },
      { name: 'Bold', fn: txt => txt.replace(/[A-Za-z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 119743 : 119737))) },
      { name: 'Bold Italic', fn: txt => txt.replace(/[A-Za-z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 119795 : 119789))) },
      { name: 'Italic', fn: txt => txt.replace(/[a-z]/gi, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119893 : 119860))) },
      { name: 'Monospace', fn: txt => txt.replace(/[A-Za-z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 120055 : 120049))) },
      { name: 'Weird', fn: txt => txt.replace(/[a-z]/gi, c => weirdCharMap[c.toLowerCase()] || c) },
      { name: 'Small Caps', fn: txt => txt.replace(/[a-z]/g, c => smallCaps[c] || c) },
      { name: 'Boxed', fn: txt => txt.replace(/[A-Z]/gi, c => String.fromCodePoint(0x1F130 + c.toUpperCase().charCodeAt(0) - 65)) },
      { name: 'Superscript', fn: txt => txt.replace(/[a-z]/g, c => superscript[c] || c) },
      { name: 'Subscript', fn: txt => txt.replace(/[a-z]/g, c => subscript[c] || c) },
    ];

    const weirdCharMap = {
      a: 'ค', b: '๒', c: '¢', d: '∂', e: 'є', f: 'ƒ', g: 'g', h: 'н',
      i: 'ι', j: 'נ', k: 'к', l: 'ℓ', m: 'м', n: 'η', o: 'σ', p: 'ρ',
      q: 'q', r: 'я', s: 'ѕ', t: 'т', u: 'υ', v: 'ν', w: 'ω', x: 'χ',
      y: 'у', z: 'z'
    };

    const smallCaps = {
      a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ',
      i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ',
      q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
      y: 'ʏ', z: 'ᴢ'
    };

    const superscript = {
      a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ',
      i: 'ᶦ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ',
      q: 'ᑫ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ',
      y: 'ʸ', z: 'ᶻ'
    };

    const subscript = {
      a: 'ₐ', b: '♭', c: '₡', d: 'ᵈ', e: 'ₑ', f: 'f', g: '₉', h: 'ₕ',
      i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ',
      q: 'q', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', w: 'w', x: 'ₓ',
      y: 'y', z: 'z'
    };

    let out = fonts.map((font, i) => `${i + 1}. ${font.fn(input)} (${font.name})`).join('\n\n');
    await sendMessage(senderId, { text: out }, pageAccessToken);
  }
};
