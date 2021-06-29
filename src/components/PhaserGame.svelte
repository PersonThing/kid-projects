<div class="game-window">
  {#if level != null && character != null}
    {#if gameOver}
      <GameOver {score} {player} won={gameWon} {level} />
    {:else if paused}
      <Paused />
    {/if}
    {#if player}
      <TemporaryAbilityBar abilities={character.abilities} {activeKeyStore} />
    {/if}
    <div bind:this={container} />
  {/if}
</div>

{#if character != null}
  <Instructions abilities={character.abilities} canDoubleJump={character.canDoubleJump} />
  <div class="p-1">
    <FieldCheckbox bind:checked={debug}>Debug?</FieldCheckbox>
  </div>
{/if}

<script>
  import { createParticles, hasParticlesConfigured } from '../services/particles'
  import { gridSize, gravityPixelsPerSecond } from './PhaserGame/Constants'
  import { onMount, onDestroy } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { rgbaStringToHex } from '../services/rgba-to-hex'
  import { writable } from 'svelte/store'
  import Enemy from './PhaserGame/Enemy'
  import FieldCheckbox from './FieldCheckbox.svelte'
  import Follower from './PhaserGame/Follower'
  import GameOver from './GameOver.svelte'
  import getAnimationKey from './PhaserGame/GetAnimationKey'
  import Instructions from './Instructions.svelte'
  import Paused from './Paused.svelte'
  import Player from './PhaserGame/Player'
  import playerData from '../stores/player-data'
  import project from '../stores/active-project-store'
  import SkillKeys from './PhaserGame/SkillKeys'
  import TemporaryAbilityBar from './PhaserGame/TemporaryAbilityBar.svelte'

  const activeKeyStore = writable(null)

  export let levelId = null
  let level

  export let characterId = null
  let character

  let scene

  let debug = false

  $: debug, setTimeout(() => start(), 10)

  const attackRange = 600
  const followerLeashRange = 600

  let container

  let gameOver
  let gameWon
  let winBlockTouched
  let hasWinBlock = false
  let score
  let paused

  let blocks

  let config
  let game
  let preloadedData
  let keys = {}

  let gameWidth = 1200
  let viewportHeight = 600

  let maxLevelX
  let maxLevelY
  let player

  onMount(() => {
    character = $project.characters[characterId]
    level = $project.levels[levelId]

    maxLevelX = Math.max(...level.blocks.map(b => b[1] + 1)) * gridSize
    maxLevelY = Math.max(...level.blocks.map(b => b[2] + 1)) * gridSize

    blocks = level.blocks.map(([name, x, y]) => {
      const template = $project.blocks[name]
      const art = $project.art[template.graphic]
      return {
        ...$project.blocks[name],
        x,
        y,
        template,
        art,
      }
    })

    start()
  })

  function backToLevelSelect() {
    push(`/${encodeURIComponent($project.name)}/play`)
  }

  function start() {
    destroyGame()
    preload().then(() => {
      if (container == null) return

      gameOver = false
      gameWon = false
      winBlockTouched = false
      paused = false
      score = 0
      gameWidth = window.innerWidth

      config = {
        type: Phaser.AUTO,
        parent: container,
        scene: {
          create: onCreate,
          update: onUpdate,
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug,
          },
        },
        width: gameWidth,
        height: viewportHeight,
        pixelArt: true,
      }

      game = new Phaser.Game(config)
    })
  }

  onDestroy(() => {
    destroyGame()
  })

  function destroyGame() {
    if (game != null) {
      game.destroy()
      container.querySelectorAll('*').forEach(n => n.remove())
    }
  }

  function preload() {
    return new Promise((resolve, reject) => {
      const distinctBlocks = [...new Set(level.blocks.map(b => b[0]))].map(n => $project.blocks[n]).filter(b => b != null)

      const distinctEnemies = [...new Set([...level.enemies.map(e => e[0]), ...distinctBlocks.flatMap(b => b.enemyOnConsume || [])])]
        .map(n => $project.enemies[n])
        .filter(e => e != null)

      const distinctCharacters = [...new Set([character.id, ...character.followers, ...distinctBlocks.flatMap(b => b.followerOnConsume || [])])].map(
        id => $project.characters[id]
      )
      const allArt = [
        ...new Set([
          // blocks
          ...distinctBlocks.map(b => b.graphic),

          // particles
          ...Object.values($project.particles).map(p => p.graphic),

          // characters
          ...distinctCharacters.flatMap(c => Object.values(c.graphics)),

          // character abilities
          ...distinctCharacters.flatMap(c => c.abilities.flatMap(a => Object.values(a.graphics))),

          // enemies
          ...distinctEnemies.flatMap(e => Object.values(e.graphics)),

          // enemy abilities
          ...distinctEnemies.filter(e => e.abilities != null).flatMap(e => e.abilities.flatMap(a => Object.values(a.graphics))),
        ]),
      ].filter(id => id != null)
      // console.log(distinctCharacters.flatMap(c => Object.values(c.graphics)).map(id => $project.art[id].name))
      Promise.all(allArt.map(id => preloadArt(id))).then(data => {
        preloadedData = data
        resolve()
      })
    })
  }

  function preloadArt(id) {
    const art = $project.art[id]
    return new Promise((res, rej) => {
      const image = new Image()
      image.onload = () => {
        res({
          ...art,
          image,
        })
      }
      image.src = art.png
    })
  }

  function onCreate() {
    scene = this
    // set bg color
    this.cameras.main.setBackgroundColor(rgbaStringToHex(level.background))

    // set up textures and sprites for all blocks, character, and enemies in level
    preloadedData.forEach(art => {
      if (art.animated) {
        // animated spritesheet
        this.textures.addSpriteSheet(art.id, art.image, {
          frameWidth: art.frameWidth,
          frameHeight: art.height,
        })
        const frames = this.anims.generateFrameNumbers(art.id, {
          start: 0,
          end: Math.ceil(art.width / art.frameWidth),
        })
        this.anims.create({
          key: getAnimationKey(art.id),
          frames,
          frameRate: art.frameRate,
          repeat: -1,
          yoyo: art.yoyo,
        })
      } else {
        // simple static image
        this.textures.addImage(art.id, art.image)
      }
    })

    // add blocks as static objects
    // TODO: block class to abstract this...
    this.backgroundBlocksGroup = this.physics.add.staticGroup()
    this.simpleBlocksGroup = this.physics.add.staticGroup()
    this.effectBlocksGroup = this.physics.add.staticGroup()
    this.teleportBlocksGroup = this.physics.add.staticGroup()
    this.consumableBlocksGroup = this.physics.add.staticGroup()
    this.winBlocksGroup = this.physics.add.staticGroup()

    const createBlock = (group, b) => {
      const block = group.create(translateX(b.x * gridSize, gridSize), translateY(b.y * gridSize, gridSize), b.art.id)
      if (b.art.animated) block.anims.play(getAnimationKey(b.art.id), true)
      if (hasParticlesConfigured(b)) {
        const { particles, emitter } = createParticles(this, $project.particles[b.particles], block)
        block.particles = particles
      }
      block.template = b.template
    }
    blocks.forEach(b => {
      if (b.consumable) createBlock(this.consumableBlocksGroup, b)
      else if (b.winOnTouch) {
        hasWinBlock = true
        createBlock(this.winBlocksGroup, b)
      } else if (b.damage > 0 || b.throwOnTouch || b.flipGravityOnTouch) createBlock(this.effectBlocksGroup, b)
      else if (b.teleportOnTouch) createBlock(this.teleportBlocksGroup, b)
      else if (b.solid) createBlock(this.simpleBlocksGroup, b)
      else createBlock(this.backgroundBlocksGroup, b)
    })

    // configure input
    keys = {
      cursors: this.input.keyboard.createCursorKeys(),
    }
    const keysWeCareAbout = ['SPACE', 'ENTER', 'ESC', 'A', 'D', ...SkillKeys]
    keysWeCareAbout.forEach(k => {
      keys[k] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[k])
    })
    this.input.mouse.disableContextMenu()

    // add player
    const startingY =
      translateY(Math.max(...blocks.filter(b => b.x == 0).map(b => b.y * gridSize)), gridSize) - $project.art[character.graphics.still].height
    const template = hydrateGraphics(character)
    player = this.physics.add.existing(
      new Player(this, translateX(0, template.graphics.still.width), startingY, character.graphics.still.id, template, keys, activeKeyStore)
    )
    this.player = player
    setGravity(player, template.gravityMultiplier)
    this.physics.add.collider(player, this.simpleBlocksGroup)
    this.physics.add.collider(player, this.effectBlocksGroup, onEffectBlockCollision)
    this.physics.add.overlap(player, this.winBlocksGroup, onWinBlockOverlap)
    this.physics.add.overlap(player, this.teleportBlocksGroup, onTeleportBlockOverlap)
    this.physics.add.overlap(player, this.consumableBlocksGroup, onConsumableBlockOverlap)

    // add player followers
    this.followers = this.physics.add.group()
    addFollowers(character.followers)
    this.physics.add.collider(this.followers, this.simpleBlocksGroup)
    this.physics.add.collider(this.followers, this.effectBlocksGroup, onEffectBlockCollision)
    this.physics.add.collider(this.followers, this.followers)

    // add enemies
    this.enemies = this.physics.add.group()
    addEnemies(
      level.enemies.map(([id, x, y]) => {
        const template = hydrateGraphics($project.enemies[id])
        const x1 = translateX(x * gridSize, template.graphics.still.width)
        const y1 = translateY(y * gridSize, template.graphics.still.height)
        return [id, x1, y1]
      })
    )
    this.physics.add.collider(this.enemies, this.simpleBlocksGroup)
    this.physics.add.collider(this.enemies, this.effectBlocksGroup, onEffectBlockCollision)

    // camera and player bounds
    this.physics.world.setBounds(0, -viewportHeight, maxLevelX, maxLevelY + viewportHeight)
    this.cameras.main.setBounds(0, -viewportHeight, maxLevelX, maxLevelY + viewportHeight)
    this.cameras.main.startFollow(player)

    // score method
    let scoreText = this.add.text(10, 10, '')
    scoreText.setScrollFactor(0)
    scoreText.setColor('black')
    scoreText.setAlpha(0.8)
    this.addScore = function (s) {
      score += s
      scoreText.setText(`Score: ${score}`)
    }
    this.addScore(0)
  }

  function setGravity(sprite, gravityMultiplier, isFlipped) {
    sprite.setGravity(0, gravityPixelsPerSecond * gravityMultiplier * (isFlipped ? -1 : 1))
  }

  function onUpdate() {
    if (Phaser.Input.Keyboard.JustDown(keys.ENTER)) start()
    if (Phaser.Input.Keyboard.JustDown(keys.ESC)) backToLevelSelect()
    if (gameOver) return

    // if player is dead or fell out bottom of world, you lose
    if (!player.alive) {
      gameOver = true
    }

    // you win if all enemies are dead or you touched a win block
    if ((hasWinBlock && winBlockTouched) || (!hasWinBlock && this.enemies.countActive() == 0 && level.enemies.length > 0)) {
      gameWon = true
      gameOver = true
      playerData.addLevelWin(level.id, score, character.id)
    }

    if (gameOver) this.physics.pause()
  }

  function addFollowers(followerIds) {
    if (followerIds == null || followerIds.length == 0) return
    followerIds.forEach(id => {
      const template = hydrateGraphics($project.characters[id])
      const y = player.body.y - (template.graphics.still.height - player.graphics.still.height)
      const follower = new Follower(scene, player.x, y, template.graphics.still.id, template, player, followerLeashRange)
      scene.followers.add(follower)
      setGravity(follower, template.gravityMultiplier)
    })
  }

  function addEnemies(enemies) {
    enemies.forEach(([id, x, y]) => {
      const template = hydrateGraphics($project.enemies[id])
      const enemy = new Enemy(scene, x, y, template.graphics.still.id, template, attackRange)
      // const enemy = new LivingSprite(scene, x, y, template.graphics.still.id, template)
      scene.enemies.add(enemy)
      setGravity(enemy, template.gravityMultiplier)
    })
  }

  function translateX(x, width) {
    return x + width / 2
  }

  function translateY(y, height) {
    // convert Y = 100 to Y = height - 100
    return Math.max(maxLevelY) - y - height / 2
  }

  function onEffectBlockCollision(sprite, block) {
    sprite.damage(block.template.damage)
    if (block.template.throwOnTouch) sprite.setVelocityY(-1000)

    const time = scene.time.now
    if (block.template.flipGravityOnTouch && !(block.disabledUntil > time)) {
      block.disabledUntil = time + 1000
      sprite.gravityFlipped = !sprite.gravityFlipped
      setGravity(sprite, sprite.template.gravityMultiplier, sprite.gravityFlipped)
    }
  }

  function onWinBlockOverlap(sprite, block) {
    winBlockTouched = true
  }

  function onTeleportBlockOverlap(sprite, block) {
    const time = scene.time.now
    if (block.disabledUntil > time) return false

    const targets = scene.teleportBlocksGroup
      .getChildren()
      // get teleporters that are of the same template
      .filter(targetBlock => targetBlock.template.id == block.template.id)
      // don't teleport to source block
      .filter(targetBlock => targetBlock.x != block.x || targetBlock.y != block.y)
      // add distance to this block
      .map(targetBlock => ({
        targetBlock,
        distanceFromThisBlock: Phaser.Math.Distance.Between(block.x, block.y, targetBlock.x, targetBlock.y),
      }))
      // sort by distance
      .sort((t1, t2) => t1.distanceFromThisBlock - t2.distanceFromThisBlock)

    if (targets.length == 0) return false

    const target = targets.shift()
    target.targetBlock.disabledUntil = time + 2000
    sprite.setVelocityY(0)
    sprite.setVelocityX(0)
    sprite.x = target.targetBlock.x
    sprite.y = target.targetBlock.y - target.targetBlock.height / 2
  }

  function onConsumableBlockOverlap(sprite, block) {
    if (block.template.healthOnConsume) sprite.heal(block.template.healthOnConsume)
    if (block.template.scoreOnConsume) sprite.scene.addScore(block.template.scoreOnConsume)
    if (block.template.throwOnTouch) sprite.setVelocityY(-1000)
    if (block.template.followerOnConsume != null) addFollowers(block.template.followerOnConsume)
    // we could allow spawning enemies at specific points rather than right where the block was
    if (block.template.enemyOnConsume != null) {
      addEnemies(block.template.enemyOnConsume.map(id => [id, block.x, block.y - block.height]))
    }
    block.disableBody(true, true)
    if (block.particles) block.particles.destroy()
    block.destroy()
  }

  function hydrateGraphics(template) {
    const copy = JSON.parse(JSON.stringify(template))
    copy.graphics = hydrateGraphicsObject(copy.graphics)
    if (copy.abilities != null)
      copy.abilities = copy.abilities.map(a => ({
        ...a,
        particles: $project.particles[a.particles],
        graphics: hydrateGraphicsObject(a.graphics),
      }))

    if (copy.particles != null && copy.particles.graphics == null) copy.particles = $project.particles[copy.particles]

    return copy
  }

  function hydrateGraphicsObject(graphics) {
    Object.keys(graphics).forEach(key => {
      const artId = graphics[key]
      graphics[key] = $project.art[artId] != null ? JSON.parse(JSON.stringify($project.art[artId])) : null
      if (graphics[key] != null && graphics[key].animated) graphics[key].width = graphics[key].frameWidth
      return graphics[key]
    })
    return graphics
  }
</script>

<style>
  .game-window {
    width: 100%;
    position: relative;
  }
</style>
