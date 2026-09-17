/**
 * Re-read the sequence out of Figma.
 *
 * This is not run by the build. It is a Figma *plugin* snippet: paste the body
 * into the Figma console MCP (`figma_execute`) with the Pura Website file open,
 * and transcribe what it returns into `src/hero/frames.js`.
 *
 * It exists because the slides get REBUILT rather than edited — every node id
 * changed between the first and second pass — so nothing in this project may
 * ever match a Figma node by id. Everything here matches by layer name and by
 * position in the page, which has survived every revision so far.
 *
 * What it deliberately does:
 *
 *   - Sorts slides by their trailing number, so `Slide 10` lands after `Slide 9`
 *     rather than after `Slide 1`.
 *   - Ignores `Slide overview`, which is an assembly board rather than a moment
 *     in the sequence.
 *   - Returns CENTRES, not top-left corners, and honours rotation when it
 *     computes them: several device rects sit at -10.5°, and a rotated node's
 *     x/y in Figma is its transform origin rather than the corner you see.
 *   - Reports the hand IMAGE rather than its group. Figma groups the hand with
 *     a gradient backdrop that extends well below it, so the group's centre is
 *     not the image's and using it drops the hand by about 20px.
 *
 * What it cannot do is decide anything. Opacities, sizes and positions come
 * back raw; how they become poses — which rotation, which scale reference —
 * is a judgement that lives in `frames.js` with its reasoning next to it.
 */
await figma.loadAllPagesAsync()

const page = figma.root.children.find((p) => p.name === 'Final Website')
const slides = page.children
  .filter((c) => /^Slide \d+$/.test(c.name))
  .sort((a, b) => Number(a.name.split(' ')[1]) - Number(b.name.split(' ')[1]))

/** Centre of a node in its slide's coordinates, honouring rotation. */
function centreIn(node, frame) {
  const t = node.absoluteTransform
  const f = frame.absoluteTransform
  const w = node.width
  const h = node.height
  const ax = t[0][0] * (w / 2) + t[0][1] * (h / 2) + t[0][2]
  const ay = t[1][0] * (w / 2) + t[1][1] * (h / 2) + t[1][2]
  return [Math.round((ax - f[0][2]) * 10) / 10, Math.round((ay - f[1][2]) * 10) / 10]
}

const round = (v) => Math.round(v * 100) / 100
const label = (n) => {
  const t = n.findAll((x) => x.type === 'TEXT' && x.visible !== false)[0]
  return t ? t.characters : '?'
}

const out = {}
for (const f of slides) {
  const pick = (name) => f.children.filter((c) => c.name === name)
  const first = (name) => pick(name)[0] ?? null
  const hand = first('Hand')
  const handImage = hand && 'children' in hand ? hand.children[0] : null

  out[f.name] = {
    chips: pick('Pillar item').map((c) => ({
      label: label(c),
      c: centreIn(c, f),
      o: round(c.opacity),
    })),
    // Sizes are reported as the rect's height so `frames.js` can scale them
    // against slide 4's 1440px reference.
    device: pick('Device').map((d) => ({
      c: centreIn(d, f),
      w: Math.round(d.width),
      h: Math.round(d.height),
      rot: Math.round((d.rotation || 0) * 10) / 10,
      o: round(d.opacity),
    })),
    hand: handImage
      ? { c: centreIn(handImage, f), w: Math.round(handImage.width), o: round(hand.opacity) }
      : null,
    // Slides 7+ replace the device with a flat front-on mock. Its screen height
    // is what `frames.js` converts into a device size.
    puraAI: first('Pura AI')
      ? {
          c: centreIn(first('Pura AI'), f),
          w: Math.round(first('Pura AI').width),
          h: Math.round(first('Pura AI').height),
        }
      : null,
    agentBar: first('Pura Agent Bar')
      ? {
          c: centreIn(first('Pura Agent Bar'), f),
          w: Math.round(first('Pura Agent Bar').width),
          o: round(first('Pura Agent Bar').opacity),
        }
      : null,
    // Both washes, in stacking order — slides 7 and 8 really do use two.
    wash: pick('Overlay').map((o) => round(o.opacity)),
    // Slide 2 carries a leftover copy of the heading at y=-105 as well as the
    // live one; whichever is visible is the one that matters.
    heading: pick('Heading').map((h) => ({ y: Math.round(h.y), o: round(h.opacity) })),
    kicker: f.children
      .filter((c) => c.name === 'A health companion that knows you')
      .map((c) => ({ c: centreIn(c, f), o: round(c.opacity) })),
    body: f.children
      .filter((c) => /^Ask Pura AI anything/.test(c.name))
      .map((c) => ({ c: centreIn(c, f), w: Math.round(c.width), o: round(c.opacity) })),
  }
}
return out
