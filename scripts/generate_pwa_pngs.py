import zlib
import struct
import os

def make_png(width, height, color_bg, color_border):
    raw_data = bytearray()
    border_thickness = max(2, width // 40)

    for y in range(height):
        raw_data.append(0) # filter byte: None
        for x in range(width):
            is_border = (
                x < border_thickness or x >= width - border_thickness or
                y < border_thickness or y >= height - border_thickness
            )
            if is_border:
                raw_data.extend(color_border)
            else:
                raw_data.extend(color_bg)

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
    idat = chunk(b'IDAT', zlib.compress(bytes(raw_data), 9))
    iend = chunk(b'IEND', b'')

    return header + ihdr + idat + iend

os.makedirs('public', exist_ok=True)
bg = (24, 22, 20)           # dark charcoal
border = (120, 29, 34)      # restrained Kamal burgundy

for size, fname in [(180, 'apple-touch-icon.png'), (192, 'pwa-192x192.png'), (512, 'pwa-512x512.png'), (512, 'pwa-maskable-512x512.png')]:
    data = make_png(size, size, bg, border)
    with open(os.path.join('public', fname), 'wb') as f:
        f.write(data)

print("Minimalist clean PWA PNG icons generated successfully.")
