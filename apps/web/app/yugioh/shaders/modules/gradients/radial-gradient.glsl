vec3 radialGradient(vec2 uv, vec2 center, vec3 color1, vec3 color2) {
    float dist = distance(uv, center);
    return mix(color1, color2, dist);
}

#pragma glslify: export(radialGradient)