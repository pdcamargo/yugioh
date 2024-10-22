vec3 stripesGradient(vec2 uv, vec3 color1, vec3 color2, float frequency) {
    float stripes = sin(uv.x * frequency) * 0.5 + 0.5;
    return mix(color1, color2, stripes);
}

#pragma glslify: export(stripesGradient)