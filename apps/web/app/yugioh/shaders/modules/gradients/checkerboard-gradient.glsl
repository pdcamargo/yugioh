vec3 checkerboardGradient(vec2 uv, vec3 color1, vec3 color2, float size) {
    vec2 check = floor(uv * size);
    
    float modCheck = mod(check.x + check.y, 2.0);

    return mix(color1, color2, modCheck);
}

#pragma glslify: export(checkerboardGradient)