export default function migrate3(project) {
  const art = Object.values(project.art).map(a => ({
    ...a,
    id: a.id + 1,
  }))

  const particles = Object.values(project.particles).map(p => ({
    ...p,
    id: p.id + 1,
    graphic: incrementId(p.graphic),
  }))

  const blocks = Object.values(project.blocks).map(b => ({
    ...b,
    id: b.id + 1,
    graphic: incrementId(b.graphic),
    particles: incrementId(b.particles),
  }))

  const characters = Object.values(project.characters).map(c => ({
    ...c,
    id: c.id + 1,
    graphics: {
      still: incrementId(c.graphics?.still),
      moving: incrementId(c.graphics?.moving),
    },
    particles: incrementId(c.particles),
    abilities: c.abilities.map(a => ({
      ...a,
      graphics: {
        character: incrementId(a.graphics.character),
        projectile: incrementId(a.graphics.projectile),
      },
      particles: incrementId(a.particles),
    })),
  }))

  const enemies = Object.values(project.enemies).map(e => ({
    ...e,
    id: e.id + 1,
    graphics: {
      still: incrementId(e.graphics.still),
      moving: incrementId(e.graphics.moving),
    },
    particles: incrementId(e.particles),
    abilities: e.abilities.map(a => ({
      ...a,
      graphics: {
        character: incrementId(a.graphics.character),
        projectile: incrementId(a.graphics.projectile),
      },
      particles: incrementId(a.particles),
    })),
  }))

  const levels = Object.values(project.levels).map(l => ({
    ...l,
    id: l.id + 1,
    playableCharacters: l.playableCharacters.map(c => incrementId(c)),
    blocks: l.blocks.map(b => [incrementId(b[0]), b[1], b[2]]),
    enemies: l.enemies.map(e => [incrementId(e[0]), e[1], e[2]]),
    requiredLevels: l.requiredLevels.map(l => incrementId(l)),
  }))

  characters.forEach(c => {
    c.followers = c.followers?.map(f => incrementId(f)) ?? []
  })

  blocks.forEach(b => {
    b.followerOnConsume = b.followerOnConsume?.map(f => incrementId(f)) ?? []
    b.enemyOnConsume = b.enemyOnConsume?.map(e => incrementId(e)) ?? []
  })

  project.art = arrayToObject(art)
  project.particles = arrayToObject(particles)
  project.blocks = arrayToObject(blocks)

  project.characters = arrayToObject(characters)
  project.enemies = arrayToObject(enemies)
  project.levels = arrayToObject(levels)

  project.version = 3
  return project
}

function incrementId(id) {
  return id == null ? id : parseInt(id) + 1
}

function arrayToObject(collection) {
  const result = {}
  collection.forEach(item => {
    result[item.id] = JSON.parse(JSON.stringify(item))
  })
  return result
}
