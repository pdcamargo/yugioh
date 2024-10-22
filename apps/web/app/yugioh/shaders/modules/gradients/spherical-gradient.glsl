vec3 sphericalGradient(vec2 uv, vec2 center, vec3 lightColor, vec3 shadowColor) {
    float dist = distance(uv, center);
    float sphereEffect = 1.0 - dist;
    return mix(shadowColor, lightColor, smoothstep(0.0, 1.0, sphereEffect));
}

#pragma glslify: export(sphericalGradient)