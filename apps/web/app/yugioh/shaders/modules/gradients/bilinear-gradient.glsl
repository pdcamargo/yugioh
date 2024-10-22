vec3 bilinearGradient(vec2 uv, vec3 colorTopLeft, vec3 colorTopRight, vec3 colorBottomLeft, vec3 colorBottomRight) {
    vec3 topColor = mix(colorTopLeft, colorTopRight, uv.x);
    vec3 bottomColor = mix(colorBottomLeft, colorBottomRight, uv.x);
    return mix(bottomColor, topColor, uv.y);
}

#pragma glslify: export(bilinearGradient)