vec3 diamondGradient(vec2 uv, vec2 center, vec3 color1, vec3 color2) {
    float dist = abs(uv.x - center.x) + abs(uv.y - center.y);
    return mix(color1, color2, dist);
}

#pragma glslify: export(diamondGradient)