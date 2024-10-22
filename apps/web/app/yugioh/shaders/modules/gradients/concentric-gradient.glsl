vec3 concentricGradient(vec2 uv, vec2 center, vec3 color1, vec3 color2, float rings) {
    float dist = distance(uv, center);
    float modDist = mod(dist * rings, 1.0);
    return mix(color1, color2, modDist);
}

#pragma glslify: export(concentricGradient)