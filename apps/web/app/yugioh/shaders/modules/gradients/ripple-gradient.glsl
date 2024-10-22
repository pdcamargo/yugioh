vec3 rippleGradient(vec2 uv, vec2 center, vec3 color1, vec3 color2, float frequency) {
    float dist = distance(uv, center);
    float ripple = sin(dist * frequency) * 0.5 + 0.5;
    return mix(color1, color2, ripple);
}

#pragma glslify: export(rippleGradient)