vec3 circularWavesGradient(vec2 uv, vec2 center, vec3 color1, vec3 color2, float frequency) {
    float dist = distance(uv, center);
    float wave = sin(dist * frequency) * 0.5 + 0.5;
    return mix(color1, color2, wave);
}

#pragma glslify: export(circularWavesGradient)