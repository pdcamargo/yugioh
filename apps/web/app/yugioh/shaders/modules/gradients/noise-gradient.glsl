#pragma glslify: random = require('../highp-random.glsl')

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x);
}

vec3 noiseGradient(vec2 uv, vec3 color1, vec3 color2) {
    float t = noise(uv);
    return mix(color1, color2, t);
}

#pragma glslify: export(noiseGradient)