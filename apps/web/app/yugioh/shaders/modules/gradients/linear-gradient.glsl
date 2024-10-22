vec3 linearGradient(vec2 uv, vec3 color1, vec3 color2) {
    float t = uv.y; // Transition on the x-axis (you can change to y for vertical)
    return mix(color1, color2, t);
}

vec3 linearGradient(vec2 uv, vec3 color1, vec3 color2, float angle) {
    float t = dot(normalize(uv), vec2(cos(angle), sin(angle)));
    return mix(color1, color2, t);
}

#pragma glslify: export(linearGradient)
