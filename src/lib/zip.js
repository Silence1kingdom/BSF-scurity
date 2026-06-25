export async function downloadAllAsZip(files, zipName = 'BSF_Books.zip') {
  // Minimal ZIP generator (no compression — STORE method)
  const encoder = new TextEncoder()

  function crc32(data) {
    let c = 0xffffffff
    for (let i = 0; i < data.length; i++) {
      c ^= data[i]
      for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0)
    }
    return ~c >>> 0
  }

  const entries = []
  let offset = 0

  for (const { name, url } of files) {
    const resp = await fetch(url)
    const blob = await resp.blob()
    const buf = new Uint8Array(await blob.arrayBuffer())
    const crc = crc32(buf)
    const compSize = buf.length
    const header = new ArrayBuffer(30)
    const dv = new DataView(header)
    dv.setUint32(0, 0x04034b50, true) // local file header signature
    dv.setUint16(4, 20, true) // version needed
    dv.setUint16(6, 0, true) // flags
    dv.setUint16(8, 0, true) // compression: STORE
    dv.setUint16(10, 0, true) // mod time
    dv.setUint16(12, 0, true) // mod date
    dv.setUint32(14, crc, true) // crc32
    dv.setUint32(18, compSize, true) // compressed size
    dv.setUint32(22, compSize, true) // uncompressed size
    const nameBytes = encoder.encode(name)
    dv.setUint16(26, nameBytes.length, true) // file name length
    dv.setUint16(28, 0, true) // extra field length

    const localHeader = new Uint8Array(30 + nameBytes.length)
    localHeader.set(new Uint8Array(header), 0)
    localHeader.set(nameBytes, 30)

    entries.push({
      name,
      nameBytes,
      crc,
      compSize,
      localHeader,
      data: buf,
      headerOffset: offset,
    })
    offset += localHeader.length + buf.length
  }

  // Central directory
  const cenEntries = []
  let cenOffset = 0
  for (const e of entries) {
    const cen = new ArrayBuffer(46)
    const dv = new DataView(cen)
    dv.setUint32(0, 0x02014b50, true) // central directory header signature
    dv.setUint16(4, 20, true)
    dv.setUint16(6, 20, true)
    dv.setUint16(8, 0, true)
    dv.setUint16(10, 0, true)
    dv.setUint16(12, 0, true)
    dv.setUint32(14, e.crc, true)
    dv.setUint32(18, e.compSize, true)
    dv.setUint32(22, e.compSize, true)
    dv.setUint16(26, e.nameBytes.length, true)
    dv.setUint16(28, 0, true)
    dv.setUint16(30, 0, true)
    dv.setUint16(32, 0, true)
    dv.setUint16(34, 0, true)
    dv.setUint32(36, 0, true)
    dv.setUint32(40, e.headerOffset, true)
    dv.setUint16(44, 0, true)

    const cenU8 = new Uint8Array(46 + e.nameBytes.length)
    cenU8.set(new Uint8Array(cen), 0)
    cenU8.set(e.nameBytes, 46)
    cenEntries.push(cenU8)
    cenOffset += cenU8.length
  }

  // End of central directory
  const eocd = new ArrayBuffer(22)
  const ev = new DataView(eocd)
  ev.setUint32(0, 0x06054b50, true)
  ev.setUint16(4, 0, true)
  ev.setUint16(6, 0, true)
  ev.setUint16(8, entries.length, true)
  ev.setUint16(10, entries.length, true)
  const cenSize = cenEntries.reduce((a, e) => a + e.length, 0)
  ev.setUint32(12, cenSize, true)
  ev.setUint32(16, offset, true)
  ev.setUint16(20, 0, true)

  // Combine everything
  const totalSize = offset + cenSize + 22
  const zip = new Uint8Array(totalSize)
  let pos = 0
  for (const e of entries) {
    zip.set(e.localHeader, pos)
    pos += e.localHeader.length
    zip.set(e.data, pos)
    pos += e.data.length
  }
  for (const ce of cenEntries) {
    zip.set(ce, pos)
    pos += ce.length
  }
  zip.set(new Uint8Array(eocd), pos)

  // Download
  const blob = new Blob([zip], { type: 'application/zip' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = zipName
  link.click()
  URL.revokeObjectURL(link.href)
}
