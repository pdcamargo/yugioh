vec3 sinusoidalGradient(vec2 uv, vec3 color1, vec3 color2, float frequency, float amplitude) {
    float wave = sin(uv.x * frequency) * amplitude;
    return mix(color1, color2, wave);
}

#pragma glslify: export(sinusoidalGradient)