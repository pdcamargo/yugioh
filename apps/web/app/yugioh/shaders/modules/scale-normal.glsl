// Function to handle vec2 input, returning vec3
vec3 scaleNormal(vec2 normalColor, float scale) {
    // Expand vec2 to vec3 by adding z component as 0.0
    vec3 normal = vec3(normalColor * 2.0 - 1.0, 0.0);
    return normalize(normal) * scale;
}

// Function to handle vec3 input, returning vec3
vec3 scaleNormal(vec3 normalColor, float scale) {
    vec3 normal = normalColor * 2.0 - 1.0;
    return normalize(normal) * scale;
}

// Function to handle vec2 input, returning vec4 with alpha set to 1.0
vec4 scaleNormal(vec2 normalColor, float scale, float alpha) {
    // Expand vec2 to vec3 by adding z component as 0.0
    vec3 normal = vec3(normalColor * 2.0 - 1.0, 0.0);
    return vec4(normalize(normal) * scale, alpha);
}

// Function to handle vec3 input, returning vec4 with alpha set to 1.0
vec4 scaleNormal(vec3 normalColor, float scale, float alpha) {
    vec3 normal = normalColor * 2.0 - 1.0;
    return vec4(normalize(normal) * scale, alpha);
}

#pragma glslify: export(scaleNormal)
