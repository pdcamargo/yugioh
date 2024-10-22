vec3 angularGradient(vec2 uv, vec2 center, vec3 color1, vec3 color2) {
    vec2 fromCenter = uv - center;

    float angle = atan(fromCenter.y, fromCenter.x);

    float normalizedAngle = (angle + 3.14159265359) / (2.0 * 3.14159265359);

    return mix(color1, color2, normalizedAngle);
}

#pragma glslify: export(angularGradient)