export default function migrate2(project) {
  const art = Object.values(project.art).map((a, id) => ({
    ...a,
    id,
  }))

  const particles = Object.values(project.particles).map((p, id) => ({
    ...p,
    id,
    graphic: nameToId(art, p.graphic),
  }))

  const blocks = Object.values(project.blocks).map((b, id) => ({
    ...b,
    id,
    graphic: nameToId(art, b.graphic),
    particles: nameToId(particles, b.particles),
  }))

  const characters = Object.values(project.characters).map((c, id) => ({
    ...c,
    id,
    graphics: {
      still: nameToId(art, c.graphics?.still),
      moving: nameToId(art, c.graphics?.moving),
    },
    particles: nameToId(particles, c.particles),
    abilities: c.abilities.map(a => ({
      ...a,
      graphics: {
        character: nameToId(art, a.graphics.character),
        projectile: nameToId(art, a.graphics.projectile),
      },
      particles: nameToId(particles, a.particles),
    })),
  }))

  const enemies = Object.values(project.enemies).map((e, id) => ({
    ...e,
    id,
    graphics: {
      still: nameToId(art, e.graphics.still),
      moving: nameToId(art, e.graphics.moving),
    },
    particles: nameToId(particles, e.particles),
    abilities: e.abilities.map(a => ({
      ...a,
      graphics: {
        character: nameToId(art, a.graphics.character),
        projectile: nameToId(art, a.graphics.projectile),
      },
      particles: nameToId(particles, a.particles),
    })),
  }))

  const levels = Object.values(project.levels).map((l, id) => ({
    ...l,
    id,
    playableCharacters: l.playableCharacters.map(c => nameToId(characters, c)),
    blocks: l.blocks.map(b => [nameToId(blocks, b[0]), b[1], b[2]]),
    enemies: l.enemies.map(e => [nameToId(enemies, e[0]), e[1], e[2]]),
    requiredLevels: [],
  }))

  characters.forEach(c => {
    c.followers = c.followers?.map(f => nameToId(characters, f)) ?? []
  })

  blocks.forEach(b => {
    b.followerOnConsume = b.followerOnConsume?.map(f => nameToId(characters, f)) ?? []
    b.enemyOnConsume = b.enemyOnConsume?.map(e => nameToId(enemies, e)) ?? []
  })

  project.art = { ...art }
  project.particles = { ...particles }
  project.blocks = { ...blocks }
  project.characters = { ...characters }
  project.enemies = { ...enemies }
  project.levels = { ...levels }

  project.version = 2
  return project
}

function nameToId(collection, name) {
  const result = name != null ? collection.find(i => i.name == name) : null
  return result != null ? result.id : null
}
