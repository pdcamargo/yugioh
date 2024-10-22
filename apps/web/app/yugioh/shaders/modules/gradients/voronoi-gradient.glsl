#pragma glslify: random = require('../highp-random.glsl')

vec3 voronoiGradient(vec2 uv, vec3 color1, vec3 color2, float scale) {
    vec2 p = uv * scale;
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec3 res = vec3(0.0);
    float minDist = 1.0;
    for (int y=-1; y<=1; y++) {
        for (int x=-1; x<=1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = neighbor + random(i + neighbor);
            float dist = length(f - point);
            if (dist < minDist) {
                minDist = dist;
                res = mix(color1, color2, dist);
            }
        }
    }
    return res;
}

#pragma glslify: export(voronoiGradient)