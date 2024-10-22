// Helper function to convert RGB to HSV
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0/6.0, 1.0/3.0, 2.0/3.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Helper function to convert HSV back to RGB
vec3 hsv2rgb(vec3 c) {
    vec3 p = abs(fract(c.xxx + vec3(0.0, 1.0/3.0, 2.0/3.0)) * 6.0 - 3.0);
    return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}

vec3 shiftHue(vec3 color, float shift) {
  vec3 hsv = rgb2hsv(color);

  hsv.x += shift;
  hsv.x = fract(hsv.x);  // Ensure hue stays in the range [0, 1]

  return hsv2rgb(hsv);
}

#pragma glslify: export(rgb2hsv)
#pragma glslify: export(hsv2rgb)
#pragma glslify: export(shiftHue)
