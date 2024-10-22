vec4 sampleAndProcessTexture(
    sampler2D textureSampler, // The texture to be sampled
    vec2 uv,                  // Base UV coordinates
    vec2 tiling,              // Tiling factor
    vec2 offset,              // Offset factor
    float power               // Power to raise the texture color
) {
    // Apply tiling and offset to the UV coordinates
    vec2 modifiedUV = uv * tiling + offset;

    // Sample the texture using modified UVs
    vec4 texColor = texture2D(textureSampler, modifiedUV);

    // Apply the power function to the color intensity
    texColor.rgb = pow(texColor.rgb, vec3(power));

    return texColor;
}

#pragma glslify: export(sampleAndProcessTexture)
