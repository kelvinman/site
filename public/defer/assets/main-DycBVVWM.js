(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[`hold`,`tidal`,`wander`,`overlap`,`audience`];function t(e,t,s){return e===`tidal`?r(t):e===`wander`?i(t):e===`overlap`?a(t):e===`audience`?o(t,s):n(t)}function n(e){let t=0;return{update(n){t+=n;let r=Math.min(1,t/e);return{pull:r,drains:[[.5,.5,r]],status:``}}}}function r(e){let t=0;return{update(n){t+=n/e;let r=.5+.38*Math.sin(t*2.1-1.57)+.22*Math.sin(t*3.7+2)+.12*Math.sin(t*6.3+4.1),i=Math.min(1,Math.max(0,r));return{pull:i,drains:[[.5,.5,i]],status:``}}}}function i(e){let t=`drain`,n=0,r=0,i=1,a=[.5,.5],o=.12;return{update(s){if(t===`drain`)n=Math.min(1,n+s/e),n>=1&&(t=`hold`,r=e*.25);else if(t===`hold`)r-=s,r<=0&&(t=`release`);else if(n=Math.max(o,n-s/(e*2)),n<=o){let e;do e=[.15+Math.random()*.7,.15+Math.random()*.7];while(Math.hypot(e[0]-a[0],e[1]-a[1])<.3);a=e,t=`drain`,i++}return{pull:n,drains:[[a[0],a[1],n]],status:`drain ${i}, ${t}`}}}}function a(e){let t=(e,t)=>({x:e,y:t,strength:0,phase:`drain`,timer:0}),n=[t(.5,.5)],r=1;return{update(i){for(let t of n)t.phase===`drain`?(t.strength=Math.min(1,t.strength+i/e),t.strength>=1&&(t.phase=`hold`,t.timer=e*.25)):t.phase===`hold`?(t.timer-=i,t.timer<=0&&(t.phase=`release`)):t.strength=Math.max(0,t.strength-i/(e*2));let a=n[n.length-1];if(a.phase===`release`&&a.strength<.5){let e,i;do e=Math.random(),i=Math.random();while(Math.hypot(e-a.x,i-a.y)<.3);n.push(t(e,i)),r++}return n=n.filter(e=>e.phase!==`release`||e.strength>0),{pull:Math.max(.12,...n.map(e=>e.strength)),drains:n.map(e=>[e.x,e.y,e.strength]),status:`drain ${r}, ${n.length} open`}}}}function o(e,t){let n=0,r=0,i=-1/0,a=0;return addEventListener(`pointermove`,()=>i=performance.now()),t&&s(e=>a=e),{setPeople(e){r=e},update(o){let s=+(performance.now()-i<3e3),c=a>.015?Math.min(5,Math.ceil(a*60)):0,l=Math.max(r,s,c),u=1-Math.exp(-.6*l),d=u>n?1/e:1/(e*2);return n+=Math.sign(u-n)*Math.min(Math.abs(u-n),d*o),{pull:n,drains:[[.5,.5,n]],status:`${l} watching${t?`, motion ${a.toFixed(3)}`:``}`}}}}async function s(e){let t=await navigator.mediaDevices.getUserMedia({video:{width:160,height:120}}),n=document.createElement(`video`);n.srcObject=t,n.muted=!0,await n.play();let r=document.createElement(`canvas`);r.width=32,r.height=24;let i=r.getContext(`2d`,{willReadFrequently:!0}),a=null,o=0;setInterval(()=>{i.drawImage(n,0,0,r.width,r.height);let t=i.getImageData(0,0,r.width,r.height).data;if(a){let n=0;for(let e=0;e<t.length;e+=4)n+=Math.abs(t[e+1]-a[e+1]);o+=(n/(t.length/4)/255-o)*.3,e(o)}a=t},200)}function c(e,t,n){let r=(t,n)=>{let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(`Shader compile failed:\n${e.getShaderInfoLog(r)}`);return r},i=e.createProgram();if(e.attachShader(i,r(e.VERTEX_SHADER,t)),e.attachShader(i,r(e.FRAGMENT_SHADER,n)),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))throw Error(`Program link failed:\n${e.getProgramInfoLog(i)}`);return i}function l(e,t,n,r,i=null){let a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a),r===`agents`||r===`memory`?(e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,t,n,0,e.RGBA,e.FLOAT,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)):(e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,t,n,0,e.RGBA,e.HALF_FLOAT,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT));let o=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw Error(`Framebuffer for ${r} is not complete`);return e.clearColor(0,0,0,0),i||e.clear(e.COLOR_BUFFER_BIT),e.bindFramebuffer(e.FRAMEBUFFER,null),{tex:a,fbo:o,width:t,height:n}}function u(e,t){e.deleteTexture(t.tex),e.deleteFramebuffer(t.fbo)}var d=class{read;write;constructor(e,t){this.read=e,this.write=t}swap(){[this.read,this.write]=[this.write,this.read]}};function f(e,t,n,r,i){e.activeTexture(e.TEXTURE0+i),e.bindTexture(e.TEXTURE_2D,r),e.uniform1i(e.getUniformLocation(t,n),i)}var p=`#version 300 es
// One triangle that covers the whole screen. No vertex buffer needed:
// the corners come from gl_VertexID (0, 1, 2).
out vec2 v_uv;

void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  v_uv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`,ee=`#version 300 es
precision highp float;

// ---------------------------------------------------------------------------
// Kelvin's file. The heart of the piece: how one walker decides where to go.
//
// This shader runs once per walker, every frame. Each pixel of u_agents is one
// walker. You read its old state, decide, and write its new state to outAgent.
//
// One walker:
//   agent.xy  position, 0..1 across the trail map (wraps at the edges)
//   agent.z   heading, in radians
//   agent.w   stubbornness, 0..1. The sign is the state:
//             positive while thinking, negative while following.
//
// Right now every walker only thinks. Your job is the rest.
// ---------------------------------------------------------------------------

uniform sampler2D u_agents;
uniform sampler2D u_trail;      // live trails; sample with texture(u_trail, uv).r
uniform vec2 u_resolution;      // trail map size in pixels
uniform float u_frame;          // frame counter, for randomness
uniform float u_pull;           // 0..1, how hard the world pulls towards following

uniform float u_speed;          // pixels per frame
uniform float u_wander;         // radians, how far a thinker may turn at random
uniform float u_sensorAngle;    // radians, how far left/right a follower looks
uniform float u_sensorDistance; // pixels, how far ahead a follower looks
uniform float u_turnSpeed;      // radians per frame, how hard a follower steers

out vec4 outAgent;

// A random number 0..1 from any 2D input (Dave Hoskins' hash).
// Change the seed to get a different, independent number.
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float rand(float seed) {
  return hash(gl_FragCoord.xy + vec2(mod(u_frame, 1024.0) * 17.0, seed * 131.0));
}

void main() {
  vec4 agent = texelFetch(u_agents, ivec2(gl_FragCoord.xy), 0);
  vec2 pos = agent.xy;
  float heading = agent.z;
  float stubbornness = abs(agent.w);
  bool following = agent.w < 0.0;

  // TODO 1. Decide: does this walker start following, or break out and think again?
  //         Compare u_pull with stubbornness, and use rand() so it is only a chance.
  //         Breaking out should get harder as u_pull rises, never impossible.

  // TODO 2. If following: sample the trail at three points ahead (left, centre,
  //         right of heading, u_sensorDistance away) and turn towards the strongest.

  // Thinking: turn a little at random.
  heading += (rand(1.0) - 0.5) * u_wander;

  // Step forward. Dividing by resolution keeps the speed in pixels on any aspect ratio.
  vec2 dir = vec2(cos(heading), sin(heading));
  pos = fract(pos + dir * u_speed / u_resolution);

  outAgent = vec4(pos, heading, following ? -stubbornness : stubbornness);
}
`,te=`#version 300 es
precision highp float;

// ---------------------------------------------------------------------------
// Claude's sketch of agents.frag, written first so the look could be judged.
// Kelvin's own version lives in agents.frag; load it with ?mine.
//
// This shader runs once per walker, every frame. Each pixel of u_agents is one
// walker. You read its old state, decide, and write its new state to outAgent.
//
// One walker:
//   agent.xy  position, 0..1 across the trail map (wraps at the edges)
//   agent.z   heading, in radians
//   agent.w   stubbornness, 0..1. The sign is the state:
//             positive while thinking, negative while following.
//
// ---------------------------------------------------------------------------

uniform sampler2D u_agents;
uniform sampler2D u_trail;      // live trails; sample with texture(u_trail, uv).r
uniform vec2 u_resolution;      // trail map size in pixels
uniform float u_frame;          // frame counter, for randomness
uniform float u_pull;           // 0..1, how hard the world pulls towards following

uniform float u_speed;          // pixels per frame
uniform float u_wander;         // radians, how far a thinker may turn at random
uniform float u_sensorAngle;    // radians, how far left/right a follower looks
uniform float u_sensorDistance; // pixels, how far ahead a follower looks
uniform float u_turnSpeed;      // radians per frame, how hard a follower steers

uniform vec3 u_drains[4];       // each open drain: x, y (0..1) and strength (0..1)
uniform int u_drainCount;
uniform float u_sourceTurn;     // radians per frame a follower turns towards a drain at full strength
uniform float u_reach;          // pixels; a drain this far away pulls half as hard as one close by
uniform float u_followWobble;   // radians; a follower's small unsteadiness, so no path stays ruler-straight
uniform float u_spiral;         // radians; how far off-centre followers aim as they near it
uniform float u_eye;            // pixels; the empty eye at the centre

out vec4 outAgent;

// A random number 0..1 from any 2D input (Dave Hoskins' hash).
// Change the seed to get a different, independent number.
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float rand(float seed) {
  return hash(gl_FragCoord.xy + vec2(mod(u_frame, 1024.0) * 17.0, seed * 131.0));
}

float sense(vec2 pos, float angle) {
  vec2 dir = vec2(cos(angle), sin(angle));
  vec2 point = pos + dir * u_sensorDistance / u_resolution;
  return texture(u_trail, point).r;
}

void main() {
  vec4 agent = texelFetch(u_agents, ivec2(gl_FragCoord.xy), 0);
  vec2 pos = agent.xy;
  float heading = agent.z;
  float stubbornness = abs(agent.w);
  bool following = agent.w < 0.0;

  // Decide. Per-frame chances are tiny because this runs 60 times a second.
  float dice = rand(2.0);
  if (!following) {
    // Give in only once the pull outweighs your stubbornness; the wider the gap, the likelier.
    float gap = u_pull - stubbornness;
    if (gap > 0.0 && dice < gap * 0.02) following = true;
  } else {
    // Break out: easier for the stubborn, harder as the pull rises, never impossible.
    float leave = 0.0002 + stubbornness * (1.0 - u_pull) * 0.01;
    if (dice < leave) following = false;
  }

  if (following) {
    float left = sense(pos, heading + u_sensorAngle);
    float centre = sense(pos, heading);
    float right = sense(pos, heading - u_sensorAngle);
    if (centre > left && centre > right) {
      // already on the strongest trail
    } else if (centre < left && centre < right) {
      heading += (rand(4.0) < 0.5 ? 1.0 : -1.0) * u_turnSpeed;
    } else if (left > right) {
      heading += u_turnSpeed;
    } else {
      heading -= u_turnSpeed;
    }

    // Drains pull followers directly, the strong and the near ones hardest. Close in, they
    // aim off-centre, so they spiral like water into a drain and leave the eye empty.
    for (int i = 0; i < 4; i++) {
      if (i >= u_drainCount) break;
      vec2 d = u_drains[i].xy - pos;
      d -= round(d);          // the nearest way round the wrapping edges
      // Near the far seam, left and right (or up and down) are equally short ways round, so
      // the pull fades out there. Otherwise it can pin walkers to a ruler-straight line that
      // wraps all the way round the sheet and feeds itself.
      float seam = 1.0 - smoothstep(0.35, 0.5, max(abs(d.x), abs(d.y)));
      d *= u_resolution;      // in pixels
      float dist = length(d);
      float toward = atan(d.y, d.x) + u_spiral * (1.0 - smoothstep(u_eye, u_eye * 4.0, dist));
      float diff = atan(sin(toward - heading), cos(toward - heading)); // shortest signed turn
      float weight = u_drains[i].z / (1.0 + dist / u_reach) * seam;
      heading += clamp(diff, -1.0, 1.0) * u_sourceTurn * weight;
    }

    // Nobody follows perfectly. Without this, a path through a drain can close into a loop
    // round the wrapping sheet and stay dead straight forever.
    heading += (rand(5.0) - 0.5) * u_followWobble;
  } else {
    heading += (rand(1.0) - 0.5) * u_wander;
  }

  vec2 dir = vec2(cos(heading), sin(heading));
  pos = fract(pos + dir * u_speed / u_resolution);

  outAgent = vec4(pos, heading, following ? -stubbornness : stubbornness);
}
`,ne=`#version 300 es
// Draw one point per walker, at its position in the trail map.
uniform sampler2D u_agents;
flat out float v_following;

void main() {
  int width = textureSize(u_agents, 0).x;
  ivec2 cell = ivec2(gl_VertexID % width, gl_VertexID / width);
  vec4 agent = texelFetch(u_agents, cell, 0);
  v_following = agent.w < 0.0 ? 1.0 : 0.0;
  gl_Position = vec4(agent.xy * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`,re=`#version 300 es
precision highp float;

// Red is the trail followers sense. Green is a mark only thinkers leave, never sensed.
uniform vec2 u_follow; // (red, green) a follower adds
uniform vec2 u_think;  // (red, green) a thinker adds
flat in float v_following;
out vec4 outColor;

// Added on top of what is already there (additive blending), so busy paths get brighter.
void main() {
  outColor = vec4(v_following > 0.5 ? u_follow : u_think, 0.0, 0.0);
}
`,ie=`#version 300 es
precision highp float;

uniform sampler2D u_trail;
uniform vec4 u_diffuse; // per channel: 0 keeps it sharp, 1 replaces it with its 3x3 blur
uniform vec4 u_decay;   // per channel, multiplied in each frame, just under 1

out vec4 outColor;

void main() {
  ivec2 size = textureSize(u_trail, 0);
  ivec2 cell = ivec2(gl_FragCoord.xy);
  vec4 sum = vec4(0.0);
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      sum += texelFetch(u_trail, (cell + ivec2(dx, dy) + size) % size, 0);
    }
  }
  vec4 here = texelFetch(u_trail, cell, 0);
  outColor = mix(here, sum / 9.0, u_diffuse) * u_decay;
}
`,ae=`#version 300 es
precision highp float;

uniform sampler2D u_trail;
uniform sampler2D u_patina;
uniform float u_exposure;       // followers' live trail
uniform float u_thinkExposure;  // thinkers' live mark
uniform float u_patinaExposure; // the worn residue
uniform int u_palette;          // 0 space, 1 bronze, 2 etching, 3 ink

in vec2 v_uv;
out vec4 outColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

// Xuan paper: long fibres laid in a few directions, plus a soft cloudiness. Fixed in place,
// in pixels, so it is the paper and not part of the motion.
float fibre(vec2 px) {
  float f = 0.0;
  for (int i = 0; i < 3; i++) {
    float a = float(i) * 2.1 + 0.4;
    mat2 r = mat2(cos(a), -sin(a), sin(a), cos(a));
    f += noise((r * px) * vec2(0.012, 0.35));
  }
  return f / 3.0 * 0.7 + noise(px * 0.01) * 0.3;
}

// How much ink has bled into the paper around this point: the live trail averaged over two
// rings, so dense rivers carry a pale wash beside them.
float bleed(vec2 uv) {
  vec2 texel = 1.0 / vec2(textureSize(u_trail, 0));
  float sum = 0.0;
  for (int i = 0; i < 12; i++) {
    float a = float(i) * 0.5236;
    vec2 d = vec2(cos(a), sin(a)) * texel;
    sum += texture(u_trail, uv + d * 4.0).r + texture(u_trail, uv + d * 10.0).r;
  }
  return sum / 24.0;
}

// Layers, bottom to top: ground, the patina worn into it, the thinkers' mark, live rivers.
void main() {
  vec4 t = texture(u_trail, v_uv);
  vec4 p = texture(u_patina, v_uv);
  float follow = 1.0 - exp(-t.r * u_exposure);
  float think = 1.0 - exp(-t.g * u_thinkExposure);
  float wornFollow = 1.0 - exp(-p.r * u_patinaExposure);
  float wornThink = 1.0 - exp(-p.g * u_patinaExposure);

  vec3 color;
  if (u_palette == 1) {
    // Bronze: warm black, umber residue, and rivers that run umber to ochre to a bone core.
    color = vec3(0.030, 0.026, 0.024);
    color = mix(color, vec3(0.13, 0.11, 0.10), wornThink);
    color = mix(color, vec3(0.32, 0.20, 0.11), wornFollow);
    color = mix(color, vec3(0.20, 0.18, 0.17), think);
    vec3 river = follow < 0.5
      ? mix(vec3(0.45, 0.27, 0.13), vec3(0.78, 0.58, 0.32), follow * 2.0)
      : mix(vec3(0.78, 0.58, 0.32), vec3(0.96, 0.92, 0.84), follow * 2.0 - 1.0);
    color = mix(color, river, smoothstep(0.0, 0.35, follow));
  } else if (u_palette == 2) {
    // Etching: aged paper, a pencil grain where people think, sepia foxing, ink rivers.
    color = vec3(0.91, 0.88, 0.81);
    color = mix(color, vec3(0.80, 0.76, 0.69), wornThink);
    color = mix(color, vec3(0.62, 0.46, 0.30), wornFollow);
    color = mix(color, vec3(0.66, 0.64, 0.60), think);
    color = mix(color, vec3(0.07, 0.06, 0.06), follow);
  } else if (u_palette == 3) {
    // Ink: ink is laid once and stays. The patina is the ink here: every path ever walked is
    // painted and never lifts, darkening each time the crowd passes again. The live walkers are
    // only a faint wet sheen showing where the brush is now. Paths walked alone leave the
    // palest grey; the paper yellows and foxes slowly around the heaviest strokes.
    vec2 px = gl_FragCoord.xy;
    float grain = fibre(px);
    // A square root lifts paths walked a few times, so ink away from the centre still reads,
    // and keeps the much-walked centre from going solid.
    float laid = 1.0 - exp(-sqrt(p.r) * u_patinaExposure * 1.5);
    float laidAlone = 1.0 - exp(-p.g * u_patinaExposure * 0.6);

    vec3 paper = vec3(0.935, 0.915, 0.865) * (0.96 + 0.06 * grain);
    paper *= mix(vec3(1.0), vec3(0.93, 0.88, 0.78), smoothstep(0.1, 0.6, laid) * 0.35);

    float dry = smoothstep(0.2, 0.65, laid + (grain - 0.5) * 0.5); // thin strokes break along the fibres
    float stroke = laid * mix(dry, 1.0, smoothstep(0.5, 0.85, laid));
    // The wet brush is soft and broken, not a clean line: spread, and patchy along the fibres.
    float wet = (1.0 - exp(-bleed(v_uv) * u_exposure * 1.2)) * smoothstep(0.3, 0.75, grain) * 0.2;

    float ink = clamp(stroke * 0.9 + laidAlone * 0.12 + wet + think * 0.04, 0.0, 0.92);
    vec3 sumi = vec3(0.07, 0.065, 0.07);
    color = mix(paper, sumi, ink);
  } else {
    // Space: ink, umber and ash, slate, bone.
    vec3 ink = vec3(0.035, 0.035, 0.043);
    vec3 umber = vec3(0.30, 0.22, 0.15);  // where the crowd went
    vec3 ash = vec3(0.15, 0.155, 0.165);   // where someone went alone
    vec3 slate = vec3(0.26, 0.27, 0.29);
    vec3 bone = vec3(0.93, 0.90, 0.84);
    color = ink;
    color = mix(color, ash, wornThink);
    color = mix(color, umber, wornFollow);
    color = mix(color, slate, think);
    color = mix(color, bone, follow);
  }
  outColor = vec4(color, 1.0);
}
`,oe=`#version 300 es
precision highp float;

// Sources breathe trail into the map, so followers find them without knowing they exist.
// Each source is (x, y, strength); added on top with additive blending.
uniform vec3 u_sources[32];
uniform int u_count;
uniform vec2 u_resolution;
uniform float u_radius; // pixels

in vec2 v_uv;
out vec4 outColor;

void main() {
  float sum = 0.0;
  for (int i = 0; i < 32; i++) {
    if (i >= u_count) break;
    vec2 d = (v_uv - u_sources[i].xy) * u_resolution;
    d -= u_resolution * round(d / u_resolution); // nearest copy across the wrapping edges
    sum += u_sources[i].z * exp(-dot(d, d) / (2.0 * u_radius * u_radius));
  }
  outColor = vec4(sum, 0.0, 0.0, 0.0);
}
`,se=`#version 300 es
precision highp float;

// The patina: every path ever walked, kept. It gathers a little of the live trail each
// frame and fades so slowly that a run of hours wears it in rather than wiping it.
uniform sampler2D u_patina;
uniform sampler2D u_trail;
uniform float u_gain;  // how much of the live trail soaks in each frame
uniform float u_decay; // just under 1; the closer to 1, the longer the memory

out vec4 outColor;

void main() {
  ivec2 cell = ivec2(gl_FragCoord.xy);
  vec4 patina = texelFetch(u_patina, cell, 0);
  vec4 trail = texelFetch(u_trail, cell, 0);
  // Compress the live trail so busy rivers do not drown out a single thinker's mark.
  outColor = patina * u_decay + log(1.0 + trail) * u_gain;
}
`,m=new URLSearchParams(location.search),h=(e,t)=>m.has(e)?Number(m.get(e)):t,g=[`rivers`,`sources`,`thinkers`].includes(m.get(`mode`)??``)?m.get(`mode`):`thinkers`,ce={agents:1024,speed:1,wander:.6,sensorAngle:.4,sensorDistance:14,turnSpeed:.25,deposit:.05,diffuse:.3,decay:.9,exposure:.35,thinkRed:.05,thinkGreen:0,thinkDecay:.9,thinkExposure:0,localSources:0,sourceStrength:0,sourceRadius:6,drain:0,sourceTurn:0,spiral:1.7,eye:50,reach:500,followWobble:.12,patinaGain:6e-4,patinaDecay:.99998,patinaExposure:.6},le={rivers:{},sources:{localSources:14,sourceStrength:.2,sourceRadius:40,drain:60},thinkers:{wander:.08,thinkRed:0,thinkGreen:.02,thinkDecay:.99,thinkExposure:5,drain:15,sourceTurn:.08}},_=[`space`,`bronze`,`etching`,`ink`],v=_.includes(m.get(`palette`))?m.get(`palette`):`space`,ue={ink:{patinaDecay:.99986}},de={...ce,...le[g],...ue[v]},y=Object.fromEntries(Object.entries(de).map(([e,t])=>[e,h(e,t)])),b=document.getElementById(`c`),x=document.getElementById(`hud`);addEventListener(`error`,e=>{x.hidden=!1,x.style.color=`#e07a5f`,x.textContent=String(e.message)});var S=b.getContext(`webgl2`,{antialias:!1,alpha:!1});if(!S)throw Error(`WebGL2 is not available`);if(!S.getExtension(`EXT_color_buffer_float`))throw Error(`EXT_color_buffer_float is required`);var C={agents:c(S,p,m.has(`mine`)?ee:te),deposit:c(S,ne,re),diffuse:c(S,p,ie),display:c(S,p,ae),sources:c(S,p,oe),patina:c(S,p,se)},fe=S.createVertexArray();S.bindVertexArray(fe);function w(){if(m.has(`w`)&&m.has(`h`))return{width:h(`w`,0),height:h(`h`,0)};let e=window.devicePixelRatio||1;return{width:Math.max(1,Math.round(innerWidth*e)),height:Math.max(1,Math.round(innerHeight*e))}}function pe(e){let t=new Float32Array(e*e*4);for(let n=0;n<e*e;n++)t[n*4+0]=Math.random(),t[n*4+1]=Math.random(),t[n*4+2]=Math.random()*Math.PI*2,t[n*4+3]=.001+Math.random()*.999;return t}if(!m.has(`agents`)){let{width:e,height:t}=w();y.agents=Math.min(1600,Math.max(1024,Math.round(Math.sqrt(e*t*.4))))}var T=y.agents*y.agents,E,D,O,k=[];function A(){k=Array.from({length:Math.min(31,y.localSources)},()=>[Math.random(),Math.random()])}function j(){let e=pe(y.agents);E=new d(l(S,y.agents,y.agents,`agents`,e),l(S,y.agents,y.agents,`agents`,e))}function M(){D&&[D.read,D.write,O.read,O.write].forEach(e=>u(S,e));let{width:e,height:t}=w();b.width=e,b.height=t,D=new d(l(S,e,t,`field`),l(S,e,t,`field`)),O=new d(l(S,e,t,`memory`),l(S,e,t,`memory`))}j(),M(),A();function N(e){S.bindFramebuffer(S.FRAMEBUFFER,e?e.fbo:null),S.viewport(0,0,e?e.width:b.width,e?e.height:b.height)}var P=(e,t,n)=>S.uniform1f(S.getUniformLocation(e,t),n),F=1/120,I=4,L=0,R=h(`pull`,0),z=[[.5,.5,0]],B=``,V=e.includes(m.get(`cycle`))?m.get(`cycle`):`overlap`,H=()=>t(V,y.drain||60,m.has(`camera`)),U=H(),W=(y.drain>0||m.has(`cycle`))&&!m.has(`pull`),G=!1,K=!1;function q(){if(W||(z=[[.5,.5,R]]),W){let e=U.update(F);R=e.pull,z=e.drains,B=e.status}let e=C.agents;S.useProgram(e),N(E.write),f(S,e,`u_agents`,E.read.tex,0),f(S,e,`u_trail`,D.read.tex,1),S.uniform2f(S.getUniformLocation(e,`u_resolution`),D.read.width,D.read.height),P(e,`u_frame`,L),P(e,`u_pull`,R),P(e,`u_speed`,y.speed),P(e,`u_wander`,y.wander),P(e,`u_sensorAngle`,y.sensorAngle),P(e,`u_sensorDistance`,y.sensorDistance),P(e,`u_turnSpeed`,y.turnSpeed),S.uniform3fv(S.getUniformLocation(e,`u_drains`),z.slice(0,4).flat()),S.uniform1i(S.getUniformLocation(e,`u_drainCount`),Math.min(4,z.length)),P(e,`u_reach`,z.length>1||m.has(`reach`)?y.reach:1e9),P(e,`u_sourceTurn`,y.sourceTurn),P(e,`u_spiral`,y.spiral),P(e,`u_eye`,y.eye),P(e,`u_followWobble`,y.followWobble),S.drawArrays(S.TRIANGLES,0,3),E.swap();let t=C.deposit;if(S.useProgram(t),N(D.read),f(S,t,`u_agents`,E.read.tex,0),S.uniform2f(S.getUniformLocation(t,`u_follow`),y.deposit,0),S.uniform2f(S.getUniformLocation(t,`u_think`),y.thinkRed,y.thinkGreen),S.enable(S.BLEND),S.blendFunc(S.ONE,S.ONE),S.drawArrays(S.POINTS,0,T),y.sourceStrength>0){let e=C.sources;S.useProgram(e);let t=k.map(([e,t])=>[e,t,(1-R)*y.sourceStrength]);t.push([.5,.5,R*y.sourceStrength*2]),S.uniform3fv(S.getUniformLocation(e,`u_sources`),t.flat()),S.uniform1i(S.getUniformLocation(e,`u_count`),t.length),S.uniform2f(S.getUniformLocation(e,`u_resolution`),D.read.width,D.read.height),P(e,`u_radius`,y.sourceRadius),S.drawArrays(S.TRIANGLES,0,3)}S.disable(S.BLEND);let n=C.diffuse;if(S.useProgram(n),N(D.write),f(S,n,`u_trail`,D.read.tex,0),S.uniform4f(S.getUniformLocation(n,`u_diffuse`),y.diffuse,0,0,0),S.uniform4f(S.getUniformLocation(n,`u_decay`),y.decay,y.thinkDecay,0,0),S.drawArrays(S.TRIANGLES,0,3),D.swap(),L%I===0){let e=C.patina;S.useProgram(e),N(O.write),f(S,e,`u_patina`,O.read.tex,0),f(S,e,`u_trail`,D.read.tex,1),P(e,`u_gain`,y.patinaGain*I),P(e,`u_decay`,y.patinaDecay**+I),S.drawArrays(S.TRIANGLES,0,3),O.swap()}L++}function me(){let e=C.display;S.useProgram(e),N(null),f(S,e,`u_trail`,D.read.tex,0),f(S,e,`u_patina`,O.read.tex,1),P(e,`u_exposure`,y.exposure),P(e,`u_thinkExposure`,y.thinkExposure),P(e,`u_patinaExposure`,y.patinaExposure),S.uniform1i(S.getUniformLocation(e,`u_palette`),_.indexOf(v)),S.drawArrays(S.TRIANGLES,0,3)}function he(){b.toBlob(e=>{if(!e)return;let t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=`defer-${new Date().toISOString().replace(/[:.]/g,`-`)}.png`,t.click(),URL.revokeObjectURL(t.href)},`image/png`)}var J=null;function ge(){if(J){J.stop();return}let e=MediaRecorder.isTypeSupported(`video/mp4`)?`video/mp4`:`video/webm`,t=[];J=new MediaRecorder(b.captureStream(60),{mimeType:e,videoBitsPerSecond:4e7}),J.ondataavailable=e=>t.push(e.data),J.onstop=()=>{J=null;let n=new Blob(t,{type:e}),r=`defer-${new Date().toISOString().replace(/[:.]/g,`-`)}.${e===`video/mp4`?`mp4`:`webm`}`;{let e=document.createElement(`a`);e.href=URL.createObjectURL(n),e.download=r,e.click()}},J.start()}var _e=h(`ff`,0),ve=h(`ffsteps`,40),Y=8,X=performance.now(),Z=60,Q=0;function $(e){let t=Math.min(.1,(e-X)/1e3);if(Z+=(1/Math.max(.001,t)-Z)*.05,X=e,!G&&L*F<_e){Y=t<1/50?Math.min(ve,Y+1):Math.max(2,Y>>1);for(let e=0;e<Y;e++)q();Q=0}else if(!G){Q+=t;for(let e=0;Q>=F&&e<4;e++)q(),Q-=F;Q=Math.min(Q,F)}me(),K&&(K=!1,he()),x.textContent=`${J?`recording  `:``}${g}  ${T.toLocaleString()} walkers  ${b.width}x${b.height}  ${Z.toFixed(0)} fps\n${V}${B?` (${B})`:``}  pull ${R.toFixed(2)}  [ ] to change   space pause   s save png   v record   r reset   h hide`,requestAnimationFrame($)}requestAnimationFrame($),addEventListener(`keydown`,e=>{e.key===` `&&(G=!G),e.key===`s`&&(K=!0),e.key===`v`&&ge(),e.key===`r`&&(j(),M(),A(),L=0,U=H()),e.key===`h`&&(x.hidden=!x.hidden),/^[0-9]$/.test(e.key)&&U.setPeople?.(Number(e.key)),(e.key===`[`||e.key===`]`)&&(W=!1),e.key===`[`&&(R=Math.max(0,R-.05)),e.key===`]`&&(R=Math.min(1,R+.05))});var ye=0;addEventListener(`resize`,()=>{m.has(`w`)||(clearTimeout(ye),ye=window.setTimeout(M,200))});