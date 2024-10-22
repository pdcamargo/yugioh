vec3 stepGradient(vec2 uv, vec3 color1, vec3 color2, int steps) {
    float t = floor(uv.x * float(steps)) / float(steps);
    return mix(color1, color2, t);
}

#pragma glslify: export(stepGradient)